import { useCallback, useState } from 'react';

// Custom error class for better error handling
class ApiError extends Error {
  public code?: string;
  public details?: unknown;

  constructor(message: string, code?: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
  }
}

// Generic response state
interface DataState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

// GraphQL request configuration
interface GraphQLConfig {
  query: string;
  variables?: Record<string, unknown>;
  endpoint?: string;
}

// REST request configuration
interface RestConfig {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string>;
}

// Request configuration union type
type RequestConfig =
  | { type: 'graphql'; config: GraphQLConfig }
  | { type: 'rest'; config: RestConfig };

// Hook options
interface UseDataFetcherOptions {
  defaultGraphQLEndpoint?: string;
  defaultHeaders?: Record<string, string>;
  onError?: (error: ApiError) => void;
  onSuccess?: <T>(data: T) => void;
  retryAttempts?: number;
  retryDelay?: number;
}

/**
 * A comprehensive data fetching hook that supports both GraphQL and REST APIs
 * with built-in loading states, error handling, and retry logic
 */
export const useDataFetcher = <T = unknown>(options: UseDataFetcherOptions = {}) => {
  const {
    defaultGraphQLEndpoint = 'http://localhost:4001/graphql',
    defaultHeaders = { 'Content-Type': 'application/json' },
    onError,
    onSuccess,
    retryAttempts = 0,
    retryDelay = 1000,
  } = options;

  const [state, setState] = useState<DataState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  // Helper function to build URL with query parameters
  const buildUrl = (baseUrl: string, params?: Record<string, string>): string => {
    if (!params || Object.keys(params).length === 0) return baseUrl;

    const url = new URL(baseUrl);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    return url.toString();
  };

  // Helper function to handle GraphQL requests
  const executeGraphQLRequest = useCallback(
    async (config: GraphQLConfig): Promise<T> => {
      const endpoint = config.endpoint || defaultGraphQLEndpoint;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { ...defaultHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: config.query,
          variables: config.variables || {},
        }),
      });

      if (!response.ok) {
        throw new ApiError(
          `HTTP Error: ${response.status} ${response.statusText}`,
          response.status.toString(),
        );
      }

      const result = await response.json();

      if (result.errors && result.errors.length > 0) {
        throw new ApiError(
          result.errors[0]?.message || 'GraphQL Error',
          'GRAPHQL_ERROR',
          result.errors,
        );
      }

      return result.data;
    },
    [defaultGraphQLEndpoint, defaultHeaders],
  );

  // Helper function to handle REST requests
  const executeRestRequest = useCallback(
    async (config: RestConfig): Promise<T> => {
      const url = buildUrl(config.url, config.params);
      const method = config.method || 'GET';

      const requestOptions: RequestInit = {
        method,
        headers: { ...defaultHeaders, ...config.headers },
      };

      if (config.body && method !== 'GET') {
        requestOptions.body =
          typeof config.body === 'string' ? config.body : JSON.stringify(config.body);
      }

      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        throw new ApiError(
          `HTTP Error: ${response.status} ${response.statusText}`,
          response.status.toString(),
        );
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      return (await response.text()) as unknown as T;
    },
    [defaultHeaders],
  );

  // Helper function to determine if an error is retryable
  const isRetryableError = (error: unknown): boolean => {
    if (error instanceof ApiError && error.code) {
      // Retry on 5xx server errors and some 4xx errors
      const statusCode = parseInt(error.code);
      return statusCode >= 500 || statusCode === 429 || statusCode === 408;
    }
    return false;
  };

  // Main execution function with retry logic
  const executeWithRetry = useCallback(
    async (requestConfig: RequestConfig, attempt = 0): Promise<T> => {
      try {
        if (requestConfig.type === 'graphql') {
          return await executeGraphQLRequest(requestConfig.config);
        } else {
          return await executeRestRequest(requestConfig.config);
        }
      } catch (error) {
        // Enhanced error handling for specific error types
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
          console.error('Network error (possibly CORS or connection issue):', error);
          throw new ApiError(
            'Network connection failed. Please check your internet connection or try again later.',
            'NETWORK_ERROR',
          );
        }

        if (error instanceof Error && error.name === 'AbortError') {
          console.error('Request was aborted:', error);
          throw new ApiError('Request was cancelled.', 'ABORT_ERROR');
        }

        // Retry logic for recoverable errors
        if (attempt < retryAttempts && isRetryableError(error)) {
          console.log(`Retrying request (attempt ${attempt + 1}/${retryAttempts})...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt)));
          return executeWithRetry(requestConfig, attempt + 1);
        }

        throw error;
      }
    },
    [executeGraphQLRequest, executeRestRequest, retryAttempts, retryDelay],
  );

  // Main fetch function
  const execute = useCallback(
    async (requestConfig: RequestConfig): Promise<T | null> => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const data = await executeWithRetry(requestConfig);

        setState(prev => ({ ...prev, data, loading: false, error: null }));

        if (onSuccess) {
          onSuccess(data);
        }

        return data;
      } catch (error) {
        const apiError: ApiError =
          error instanceof ApiError
            ? error
            : error instanceof Error
              ? { message: error.message, name: 'ApiError', details: error }
              : { message: 'Unknown error occurred', name: 'ApiError', details: error };

        setState(prev => ({ ...prev, data: null, loading: false, error: apiError }));

        if (onError) {
          onError(apiError);
        }

        return null;
      }
    },
    [executeWithRetry, onSuccess, onError],
  );

  // Convenience methods
  const graphql = useCallback(
    (config: GraphQLConfig) => {
      return execute({ type: 'graphql', config });
    },
    [execute],
  );

  const rest = useCallback(
    (config: RestConfig) => {
      return execute({ type: 'rest', config });
    },
    [execute],
  );

  // HTTP method shortcuts for REST
  const get = useCallback(
    (url: string, params?: Record<string, string>, headers?: Record<string, string>) => {
      return rest({ url, method: 'GET', params, headers });
    },
    [rest],
  );

  const post = useCallback(
    (url: string, body?: unknown, headers?: Record<string, string>) => {
      return rest({ url, method: 'POST', body, headers });
    },
    [rest],
  );

  const put = useCallback(
    (url: string, body?: unknown, headers?: Record<string, string>) => {
      return rest({ url, method: 'PUT', body, headers });
    },
    [rest],
  );

  const del = useCallback(
    (url: string, headers?: Record<string, string>) => {
      return rest({ url, method: 'DELETE', headers });
    },
    [rest],
  );

  const patch = useCallback(
    (url: string, body?: unknown, headers?: Record<string, string>) => {
      return rest({ url, method: 'PATCH', body, headers });
    },
    [rest],
  );

  // Reset function
  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    graphql,
    rest,
    get,
    post,
    put,
    delete: del,
    patch,
    reset,
  };
};

// Export types for external use
export type { DataState, GraphQLConfig, RequestConfig, RestConfig, UseDataFetcherOptions };

// Export the ApiError class
export { ApiError };
