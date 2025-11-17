import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useDataFetcher } from './useDataFetcher';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('useDataFetcher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
  });

  describe('REST API calls', () => {
    it('should handle successful GET request', async () => {
      const mockData = { id: 1, name: 'Test' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => 'application/json' },
        json: async () => mockData,
      });

      const { result } = renderHook(() => useDataFetcher());

      act(() => {
        result.current.get('https://api.example.com/test');
      });

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(mockData);
      expect(result.current.error).toBeNull();
      expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/test', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
    });

    it('should handle successful POST request', async () => {
      const mockData = { id: 1, name: 'Created' };
      const postData = { name: 'New Item' };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => 'application/json' },
        json: async () => mockData,
      });

      const { result } = renderHook(() => useDataFetcher());

      act(() => {
        result.current.post('https://api.example.com/test', postData);
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });
    });

    it('should handle GET request with query parameters', async () => {
      const mockData = { results: [] };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => 'application/json' },
        json: async () => mockData,
      });

      const { result } = renderHook(() => useDataFetcher());

      act(() => {
        result.current.get('https://api.example.com/search', { q: 'test', limit: '10' });
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/search?q=test&limit=10', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
    });

    it('should handle HTTP errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      const { result } = renderHook(() => useDataFetcher());

      act(() => {
        result.current.get('https://api.example.com/notfound');
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toBeNull();
      expect(result.current.error?.message).toBe('HTTP Error: 404 Not Found');
      expect(result.current.error?.name).toBe('ApiError');
      expect(result.current.error?.code).toBe('404');
    });
  });

  describe('GraphQL API calls', () => {
    it('should handle successful GraphQL request', async () => {
      const mockData = { user: { id: 1, name: 'Test User' } };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockData }),
      });

      const { result } = renderHook(() => useDataFetcher());

      const query = `query { user(id: 1) { id name } }`;
      const variables = { id: 1 };

      act(() => {
        result.current.graphql({ query, variables });
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledWith(import.meta.env.VITE_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables }),
      });
    });

    it('should handle GraphQL errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          errors: [{ message: 'User not found' }],
        }),
      });

      const { result } = renderHook(() => useDataFetcher());

      act(() => {
        result.current.graphql({ query: 'query { user { id } }' });
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toBeNull();
      expect(result.current.error?.message).toBe('User not found');
      expect(result.current.error?.name).toBe('ApiError');
      expect(result.current.error?.code).toBe('GRAPHQL_ERROR');
    });

    it('should use custom GraphQL endpoint', async () => {
      const mockData = { test: 'data' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockData }),
      });

      const { result } = renderHook(() => useDataFetcher());

      act(() => {
        result.current.graphql({
          query: 'query { test }',
          endpoint: 'https://custom.graphql.com/api',
        });
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockFetch).toHaveBeenCalledWith('https://custom.graphql.com/api', expect.any(Object));
    });
  });

  describe('Error handling and callbacks', () => {
    it('should call onError callback when request fails', async () => {
      const onError = vi.fn();
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useDataFetcher({ onError }));

      act(() => {
        result.current.get('https://api.example.com/test');
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(onError).toHaveBeenCalledWith({
        message: 'Network error',
        name: 'ApiError',
        details: expect.any(Error),
      });
    });

    it('should call onSuccess callback when request succeeds', async () => {
      const onSuccess = vi.fn();
      const mockData = { success: true };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => 'application/json' },
        json: async () => mockData,
      });

      const { result } = renderHook(() => useDataFetcher({ onSuccess }));

      act(() => {
        result.current.get('https://api.example.com/test');
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(onSuccess).toHaveBeenCalledWith(mockData);
    });
  });

  describe('Retry logic', () => {
    it('should retry failed requests', async () => {
      mockFetch
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          headers: { get: () => 'application/json' },
          json: async () => ({ success: true }),
        });

      const { result } = renderHook(() => useDataFetcher({ retryAttempts: 2, retryDelay: 10 }));

      act(() => {
        result.current.get('https://api.example.com/test');
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual({ success: true });
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });

    it('should fail after exhausting retry attempts', async () => {
      mockFetch.mockRejectedValue(new Error('Persistent error'));

      const { result } = renderHook(() => useDataFetcher({ retryAttempts: 1, retryDelay: 10 }));

      act(() => {
        result.current.get('https://api.example.com/test');
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error?.message).toBe('Persistent error');
      expect(mockFetch).toHaveBeenCalledTimes(2); // Initial + 1 retry
    });
  });

  describe('Utility methods', () => {
    it('should reset state', () => {
      const { result } = renderHook(() => useDataFetcher());

      // Set some initial state
      act(() => {
        result.current.reset();
      });

      expect(result.current.data).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle all HTTP methods', async () => {
      const mockData = { success: true };
      const mockResponse = {
        ok: true,
        headers: { get: () => 'application/json' },
        json: async () => mockData,
      };

      mockFetch.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useDataFetcher());

      // Test all HTTP methods
      const methods = ['get', 'post', 'put', 'delete', 'patch'] as const;

      for (const method of methods) {
        act(() => {
          if (method === 'get' || method === 'delete') {
            result.current[method]('https://api.example.com/test');
          } else {
            result.current[method]('https://api.example.com/test', { data: 'test' });
          }
        });

        await waitFor(() => {
          expect(result.current.loading).toBe(false);
        });

        expect(result.current.data).toEqual(mockData);
      }
    });
  });
});
