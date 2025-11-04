import type { Mock } from 'vitest';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import {
  addContact,
  deleteContact,
  getContactById,
  getContacts,
  updateContact,
  type Contact,
  type ContactsResponse,
} from './contactServices';

// Define the structure of our mock data and responses
interface MockGraphQLResponse {
  data?: {
    contacts?: ContactsResponse;
    contact?: Contact | null;
    addContact?: Contact;
    updateContact?: Contact;
    deleteContact?: boolean;
  };
}

// Helper type for our mocked function
type MockGraphQLFn = {
  (): Promise<MockGraphQLResponse | null>;
  mockResolvedValueOnce: (value: MockGraphQLResponse | null) => MockGraphQLFn;
  mockImplementationOnce: (fn: () => Promise<MockGraphQLResponse | null>) => MockGraphQLFn;
};

// Type for mock implementation function
type MockImplementation = () => Promise<MockGraphQLResponse | null>;

// Create a properly typed mock
const mockGraphQL = vi.fn() as unknown as MockGraphQLFn;
mockGraphQL.mockResolvedValueOnce = (value: MockGraphQLResponse | null) => {
  (
    mockGraphQL as { mockImplementationOnce: (fn: MockImplementation) => MockGraphQLFn }
  ).mockImplementationOnce(() => Promise.resolve(value));
  return mockGraphQL;
};

// Mock the module with proper typing
vi.mock('../hooks/useDataFetcher', () => ({
  useDataFetcher: () => ({
    graphql: mockGraphQL,
  }),
}));
type GraphQLMock = Mock & {
  mockResolvedValueOnce: (value: MockGraphQLResponse | null) => GraphQLMock;
};

// Helper to create a properly typed mock
const createGraphQLMock = (): GraphQLMock => {
  const mock = vi.fn() as GraphQLMock;
  mock.mockResolvedValueOnce = value => {
    mock.mockImplementationOnce(() => Promise.resolve(value));
    return mock;
  };
  return mock;
};

// Define our mock hook return type
interface MockDataFetcher {
  graphql: GraphQLMock;
}

// Mock the module with our typed implementation
vi.mock('../hooks/useDataFetcher', () => ({
  useDataFetcher: () =>
    ({
      graphql: createGraphQLMock(),
    }) as MockDataFetcher,
}));

describe('Contact Service Tests', () => {
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

  describe('Basic CRUD Operations', () => {
    test('getContacts fetches contacts successfully', async () => {
      const mockResponse: MockGraphQLResponse = {
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

      const { useDataFetcher } = await import('../hooks/useDataFetcher');
      const fetcher = useDataFetcher() as MockFetcher;
      fetcher.graphql.mockResolvedValueOnce(mockResponse);

      const result = await getContacts();
      expect(result).toBeDefined();
      expect(result?.contacts).toHaveLength(1);
      expect(result?.contacts[0]).toEqual(mockContact);
    });

    test('getContactById fetches a single contact', async () => {
      const mockResponse: MockGraphQLResponse = {
        data: { contact: mockContact },
      };
      const { useDataFetcher } = await import('../hooks/useDataFetcher');
      const fetcher = useDataFetcher() as MockFetcher;
      fetcher.graphql.mockResolvedValueOnce(mockResponse);

      const result = await getContactById('1');
      expect(result).toEqual(mockContact);
    });

    test('addContact creates a new contact', async () => {
      const mockResponse: MockGraphQLResponse = {
        data: { addContact: mockContact },
      };
      const { useDataFetcher } = await import('../hooks/useDataFetcher');
      const fetcher = useDataFetcher() as MockFetcher;
      fetcher.graphql.mockResolvedValueOnce(mockResponse);

      const { ...input } = mockContact;
      const result = await addContact(input);
      expect(result).toEqual(mockContact);
    });

    test('updateContact modifies an existing contact', async () => {
      const mockResponse: MockGraphQLResponse = {
        data: { updateContact: mockContact },
      };
      const { useDataFetcher } = await import('../hooks/useDataFetcher');
      const fetcher = useDataFetcher() as MockFetcher;
      fetcher.graphql.mockResolvedValueOnce(mockResponse);

      const { ...input } = mockContact;
      const result = await updateContact('1', input);
      expect(result).toEqual(mockContact);
    });

    test('deleteContact removes a contact', async () => {
      const mockResponse: MockGraphQLResponse = {
        data: { deleteContact: true },
      };
      const { useDataFetcher } = await import('../hooks/useDataFetcher');
      const fetcher = useDataFetcher() as MockFetcher;
      fetcher.graphql.mockResolvedValueOnce(mockResponse);

      const result = await deleteContact('1');
      expect(result).toBe(true);
    });
  });

  // Filter Combination Tests
  describe('Filter Combinations', () => {
    test('filters by name and consent', async () => {
      const mockResponse: MockGraphQLResponse = {
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

      const { useDataFetcher } = await import('../hooks/useDataFetcher');
      const fetcher = useDataFetcher() as MockFetcher;
      fetcher.graphql.mockResolvedValueOnce(mockResponse);

      const result = await getContacts({
        name: 'Test',
        consent: true,
      });

      expect(result).toBeDefined();
      expect(result?.contacts).toHaveLength(1);
      const graphqlCalls = fetcher.graphql.mock.calls;
      expect(graphqlCalls[0][0].variables.filter).toEqual({
        name: 'Test',
        consent: true,
      });
    });

    test('filters by email pattern', async () => {
      const mockResponse: MockGraphQLResponse = {
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

      const { useDataFetcher } = await import('../hooks/useDataFetcher');
      const fetcher = useDataFetcher() as MockFetcher;
      fetcher.graphql.mockResolvedValueOnce(mockResponse);

      const result = await getContacts({
        email: '@example.com',
      });

      expect(result).toBeDefined();
      const graphqlCalls = fetcher.graphql.mock.calls;
      expect(graphqlCalls[0][0].variables.filter).toEqual({
        email: '@example.com',
      });
    });
  });

  // Pagination Boundary Tests
  describe('Pagination Boundaries', () => {
    test('handles first page with limit 1', async () => {
      const mockResponse: MockGraphQLResponse = {
        data: {
          contacts: {
            contacts: [mockContact],
            total: 3,
            page: 1,
            limit: 1,
            totalPages: 3,
          },
        },
      };

      const { useDataFetcher } = await import('../hooks/useDataFetcher');
      const fetcher = useDataFetcher() as MockFetcher;
      fetcher.graphql.mockResolvedValueOnce(mockResponse);

      const result = await getContacts(undefined, undefined, {
        page: 1,
        limit: 1,
      });

      expect(result).toBeDefined();
      expect(result?.contacts).toHaveLength(1);
      expect(result?.totalPages).toBe(3);
    });

    test('handles empty result set', async () => {
      const mockResponse: MockGraphQLResponse = {
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

      const { useDataFetcher } = await import('../hooks/useDataFetcher');
      const fetcher = useDataFetcher() as MockFetcher;
      fetcher.graphql.mockResolvedValueOnce(mockResponse);

      const result = await getContacts({
        name: 'NonExistentName',
      });

      expect(result).toBeDefined();
      expect(result?.contacts).toHaveLength(0);
      expect(result?.totalPages).toBe(0);
    });

    test('handles last page', async () => {
      const mockResponse: MockGraphQLResponse = {
        data: {
          contacts: {
            contacts: [mockContact],
            total: 11,
            page: 2,
            limit: 10,
            totalPages: 2,
          },
        },
      };

      const { useDataFetcher } = await import('../hooks/useDataFetcher');
      const fetcher = useDataFetcher() as MockFetcher;
      fetcher.graphql.mockResolvedValueOnce(mockResponse);

      const result = await getContacts(undefined, undefined, {
        page: 2,
        limit: 10,
      });

      expect(result).toBeDefined();
      expect(result?.contacts).toHaveLength(1);
      expect(result?.page).toBe(2);
      expect(result?.totalPages).toBe(2);
    });
  });

  // Error Handling Tests
  describe('Error Handling', () => {
    test('handles invalid GraphQL response', async () => {
      const { useDataFetcher } = await import('../hooks/useDataFetcher');
      const fetcher = useDataFetcher() as MockFetcher;
      fetcher.graphql.mockResolvedValueOnce(null);

      const result = await getContacts();
      expect(result).toBeNull();
    });

    test('handles GraphQL errors in contact deletion', async () => {
      const mockResponse: MockGraphQLResponse = {
        data: { deleteContact: false },
      };
      const { useDataFetcher } = await import('../hooks/useDataFetcher');
      const fetcher = useDataFetcher() as MockFetcher;
      fetcher.graphql.mockResolvedValueOnce(mockResponse);

      const result = await deleteContact('1');
      expect(result).toBe(false);
    });

    test('handles empty GraphQL response in contact fetch', async () => {
      const mockResponse: MockGraphQLResponse = {
        data: { contact: null },
      };
      const { useDataFetcher } = await import('../hooks/useDataFetcher');
      const fetcher = useDataFetcher() as MockFetcher;
      fetcher.graphql.mockResolvedValueOnce(mockResponse);

      const result = await getContactById('1');
      expect(result).toBeNull();
    });
  });
});
