import { useDataFetcher } from '../hooks/useDataFetcher';

// Re-export types for backward compatibility
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  consent: boolean;
}

export interface ContactsFilter {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  consent?: boolean;
}

export interface ContactsSort {
  field: 'name' | 'email' | 'phone' | 'subject' | 'message' | 'consent';
  order: 'ASC' | 'DESC';
}

export interface ContactsPagination {
  page: number;
  limit: number;
}

export interface ContactsResponse {
  contacts: Contact[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

type ContactInput = Omit<Contact, 'id'>;

/**
 * Hook for managing contact data operations using GraphQL
 */
export const useContactsAPI = () => {
  const fetcher = useDataFetcher();

  const getContacts = async (
    filter?: ContactsFilter,
    sort?: ContactsSort,
    pagination?: ContactsPagination,
  ): Promise<ContactsResponse | null> => {
    const query = `
      query GetContacts($filter: ContactsFilter, $sort: ContactsSort, $pagination: ContactsPagination) {
        contacts(filter: $filter, sort: $sort, pagination: $pagination) {
          contacts {
            id
            name
            email
            phone
            subject
            message
            consent
          }
          total
          page
          limit
          totalPages
        }
      }
    `;

    const variables: Record<string, unknown> = {};
    if (filter) variables.filter = filter;
    if (sort) variables.sort = sort;
    if (pagination) variables.pagination = pagination;

    const result = await fetcher.graphql({ query, variables });
    return result ? (result as unknown as { contacts: ContactsResponse }).contacts : null;
  };

  const getContactById = async (id: string): Promise<Contact | null> => {
    const query = `query ($id: ID!) { contact(id: $id) { id name email phone subject message consent } }`;
    const result = await fetcher.graphql({ query, variables: { id } });
    return result ? (result as unknown as { contact: Contact | null }).contact : null;
  };

  const addContact = async (input: ContactInput): Promise<Contact | null> => {
    const mutation = `mutation ($input: ContactInput!) { addContact(input: $input) { id name email phone subject message consent } }`;
    const result = await fetcher.graphql({ query: mutation, variables: { input } });
    return result ? (result as unknown as { addContact: Contact }).addContact : null;
  };

  const updateContact = async (id: string, input: ContactInput): Promise<Contact | null> => {
    const mutation = `mutation ($id: ID!, $input: ContactInput!) { updateContact(id: $id, input: $input) { id name email phone subject message consent } }`;
    const result = await fetcher.graphql({ query: mutation, variables: { id, input } });
    return result ? (result as unknown as { updateContact: Contact }).updateContact : null;
  };

  const deleteContact = async (id: string): Promise<boolean> => {
    const mutation = `mutation ($id: ID!) { deleteContact(id: $id) }`;
    const result = await fetcher.graphql({ query: mutation, variables: { id } });
    return result ? (result as unknown as { deleteContact: boolean }).deleteContact : false;
  };

  // Backward compatibility function
  const getAllContacts = async (): Promise<Contact[]> => {
    const response = await getContacts();
    return response ? response.contacts : [];
  };

  return {
    // API methods
    getContacts,
    getAllContacts,
    getContactById,
    addContact,
    updateContact,
    deleteContact,

    // State from useDataFetcher
    data: fetcher.data,
    loading: fetcher.loading,
    error: fetcher.error,
    reset: fetcher.reset,
  };
};

// Legacy functions for backward compatibility (using direct fetch)
const GRAPHQL_URL = 'http://localhost:4001/graphql';

async function legacyGraphqlRequest<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0]?.message || 'GraphQL error');
  return json.data;
}

export const getContacts = async (
  filter?: ContactsFilter,
  sort?: ContactsSort,
  pagination?: ContactsPagination,
): Promise<ContactsResponse> => {
  const query = `
    query GetContacts($filter: ContactsFilter, $sort: ContactsSort, $pagination: ContactsPagination) {
      contacts(filter: $filter, sort: $sort, pagination: $pagination) {
        contacts {
          id
          name
          email
          phone
          subject
          message
          consent
        }
        total
        page
        limit
        totalPages
      }
    }
  `;

  const variables: Record<string, unknown> = {};
  if (filter) variables.filter = filter;
  if (sort) variables.sort = sort;
  if (pagination) variables.pagination = pagination;

  const data = await legacyGraphqlRequest<{ contacts: ContactsResponse }>(query, variables);
  return data.contacts;
};

export const getAllContacts = async (): Promise<Contact[]> => {
  const response = await getContacts();
  return response.contacts;
};

export const getContactById = async (id: string): Promise<Contact | undefined> => {
  const query = `query ($id: ID!) { contact(id: $id) { id name email phone subject message consent } }`;
  const data = await legacyGraphqlRequest<{ contact: Contact | null }>(query, { id });
  return data.contact || undefined;
};

export const addContact = async (input: ContactInput): Promise<Contact | null> => {
  const mutation = `mutation ($input: ContactInput!) { addContact(input: $input) { id name email phone subject message consent } }`;
  try {
    const data = await legacyGraphqlRequest<{ addContact: Contact }>(mutation, { input });
    return data.addContact;
  } catch (e: unknown) {
    const error = e as Error;
    if (error.message.includes('Email already exists')) return null;
    throw e;
  }
};

export const updateContact = async (id: string, input: ContactInput): Promise<Contact | null> => {
  const mutation = `mutation ($id: ID!, $input: ContactInput!) { updateContact(id: $id, input: $input) { id name email phone subject message consent } }`;
  try {
    const data = await legacyGraphqlRequest<{ updateContact: Contact }>(mutation, { id, input });
    return data.updateContact;
  } catch (e: unknown) {
    const error = e as Error;
    if (error.message.includes('Another contact with this email already exists')) return null;
    throw e;
  }
};

export const deleteContact = async (id: string): Promise<boolean> => {
  const mutation = `mutation ($id: ID!) { deleteContact(id: $id) }`;
  const data = await legacyGraphqlRequest<{ deleteContact: boolean }>(mutation, { id });
  return data.deleteContact;
};
