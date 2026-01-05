import { beforeEach, describe, expect, test, vi } from 'vitest';
import {
  addContact,
  deleteContact,
  getContactById,
  getContacts,
  updateContact,
  type Contact,
  type ContactsFilter,
  type ContactsPagination,
  type ContactsSort,
} from './contactServices';

// Mock the fetch function
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Contact Services', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockContact: Contact = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    phone: '1234567890',
    subject: 'Test Subject',
    message: 'Test Message',
    consent: true,
  };

  describe('getContacts', () => {
    test('fetches contacts without parameters', async () => {
      const mockResponse = {
        data: {
          contacts: {
            contacts: [mockContact],
            total: 1,
            page: 1,
            limit: 10,
            totalPages: 1,
          },
        },
      };
      mockFetch.mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      const result = await getContacts();
      expect(result).toEqual(mockResponse.data.contacts);

      const fetchCall = mockFetch.mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1].body);
      expect(requestBody.variables.filter).toBeUndefined();
      expect(requestBody.variables.sort).toBeUndefined();
      expect(requestBody.variables.pagination).toBeUndefined();
    });

    test('handles empty result set', async () => {
      const mockResponse = {
        data: {
          contacts: {
            contacts: [],
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 0,
          },
        },
      };
      mockFetch.mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      const result = await getContacts();
      expect(result.contacts).toHaveLength(0);
      expect(result.totalPages).toBe(0);
    });

    test('handles filtering by all fields', async () => {
      const filter: ContactsFilter = {
        name: 'Test',
        email: '@example.com',
        phone: '123',
        subject: 'Important',
        consent: true,
      };

      const mockResponse = {
        data: {
          contacts: {
            contacts: [mockContact],
            total: 1,
            page: 1,
            limit: 10,
            totalPages: 1,
          },
        },
      };
      mockFetch.mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      await getContacts(filter);

      const fetchCall = mockFetch.mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1].body);
      expect(requestBody.variables.filter).toEqual(filter);
    });

    test('handles all sorting combinations', async () => {
      const fields = ['name', 'email', 'phone', 'subject', 'consent'] as const;
      const orders = ['ASC', 'DESC'] as const;

      for (const field of fields) {
        for (const order of orders) {
          const sort: ContactsSort = { field, order };
          const mockResponse = {
            data: {
              contacts: {
                contacts: [mockContact],
                total: 1,
                page: 1,
                limit: 10,
                totalPages: 1,
              },
            },
          };
          mockFetch.mockResolvedValueOnce({
            json: async () => mockResponse,
          });

          await getContacts(undefined, sort);

          const fetchCall = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
          const requestBody = JSON.parse(fetchCall[1].body);
          expect(requestBody.variables.sort).toEqual(sort);
        }
      }
    });

    test('handles pagination boundaries', async () => {
      const paginationCases: ContactsPagination[] = [
        { page: 1, limit: 1 }, // Minimum values
        { page: 1, limit: 100 }, // Maximum page size
        { page: 100, limit: 10 }, // High page number
        { page: 50, limit: 50 }, // Equal values
      ];

      for (const pagination of paginationCases) {
        const mockResponse = {
          data: {
            contacts: {
              contacts: [],
              total: 500,
              page: pagination.page,
              limit: pagination.limit,
              totalPages: Math.ceil(500 / pagination.limit),
            },
          },
        };
        mockFetch.mockResolvedValueOnce({
          json: async () => mockResponse,
        });

        const result = await getContacts(undefined, undefined, pagination);
        expect(result.page).toBe(pagination.page);
        expect(result.limit).toBe(pagination.limit);
      }
    });

    test('handles network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      await expect(getContacts()).rejects.toThrow();
    });

    test('handles malformed response', async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => ({
          data: null,
        }),
      });

      await expect(getContacts()).rejects.toThrow('Failed to fetch contacts');
    });
  });

  describe('getContactById', () => {
    test('fetches contact successfully', async () => {
      const mockResponse = {
        data: {
          contact: mockContact,
        },
      };
      mockFetch.mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      const result = await getContactById('1');
      expect(result).toEqual(mockContact);
    });

    test('handles non-existent contact', async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => ({
          data: {
            contact: null,
          },
        }),
      });

      await expect(getContactById('999')).rejects.toThrow('Failed to fetch contact');
    });

    test('handles GraphQL errors', async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => ({
          errors: [{ message: 'Invalid ID' }],
        }),
      });

      await expect(getContactById('invalid-id')).rejects.toThrow('GraphQL Error');
    });
  });

  describe('addContact', () => {
    test('creates contact successfully', async () => {
      const input = {
        name: mockContact.name,
        email: mockContact.email,
        phone: mockContact.phone,
        subject: mockContact.subject,
        message: mockContact.message,
        consent: mockContact.consent,
      };

      const mockResponse = {
        data: {
          addContact: mockContact,
        },
      };
      mockFetch.mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      const result = await addContact(input);
      expect(result).toEqual(mockContact);
    });

    test('handles validation errors', async () => {
      const invalidInput = {
        name: '', // Empty name
        email: 'invalid-email', // Invalid email
        phone: mockContact.phone,
        subject: mockContact.subject,
        message: mockContact.message,
        consent: mockContact.consent,
      };

      mockFetch.mockResolvedValueOnce({
        json: async () => ({
          errors: [{ message: 'Validation failed' }],
        }),
      });

      await expect(addContact(invalidInput)).rejects.toThrow('GraphQL Error');
    });

    test('handles server error', async () => {
      const input = {
        name: mockContact.name,
        email: mockContact.email,
        phone: mockContact.phone,
        subject: mockContact.subject,
        message: mockContact.message,
        consent: mockContact.consent,
      };

      mockFetch.mockResolvedValueOnce({
        json: async () => ({
          data: { addContact: null },
        }),
      });

      await expect(addContact(input)).rejects.toThrow('Failed to add contact');
    });
  });

  describe('updateContact', () => {
    test('updates contact successfully', async () => {
      const input = {
        name: 'Updated Name',
        email: mockContact.email,
        phone: mockContact.phone,
        subject: mockContact.subject,
        message: mockContact.message,
        consent: mockContact.consent,
      };

      const updatedContact = { ...mockContact, name: 'Updated Name' };
      const mockResponse = {
        data: {
          updateContact: updatedContact,
        },
      };
      mockFetch.mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      const result = await updateContact('1', input);
      expect(result).toEqual(updatedContact);
    });

    test('handles non-existent contact', async () => {
      const input = {
        name: mockContact.name,
        email: mockContact.email,
        phone: mockContact.phone,
        subject: mockContact.subject,
        message: mockContact.message,
        consent: mockContact.consent,
      };

      mockFetch.mockResolvedValueOnce({
        json: async () => ({
          data: { updateContact: null },
        }),
      });

      await expect(updateContact('999', input)).rejects.toThrow('Failed to update contact');
    });

    test('handles validation errors', async () => {
      const invalidInput = {
        name: mockContact.name,
        email: 'invalid-email',
        phone: mockContact.phone,
        subject: mockContact.subject,
        message: mockContact.message,
        consent: mockContact.consent,
      };

      mockFetch.mockResolvedValueOnce({
        json: async () => ({
          errors: [{ message: 'Invalid email format' }],
        }),
      });

      await expect(updateContact('1', invalidInput)).rejects.toThrow('GraphQL Error');
    });
  });

  describe('deleteContact', () => {
    test('deletes contact successfully', async () => {
      const mockResponse = {
        data: {
          deleteContact: true,
        },
      };
      mockFetch.mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      const result = await deleteContact('1');
      expect(result).toBe(true);
    });

    test('handles non-existent contact', async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => ({
          data: {
            deleteContact: false,
          },
        }),
      });

      const result = await deleteContact('999');
      expect(result).toBe(false);
    });

    test('handles server error', async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => ({
          errors: [{ message: 'Server error' }],
        }),
      });

      await expect(deleteContact('1')).rejects.toThrow('GraphQL Error');
    });
  });
});
