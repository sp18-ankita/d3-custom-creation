// GraphQL endpoint
const GRAPHQL_URL = 'http://localhost:4001/graphql';

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

async function graphqlRequest<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
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

  const data = await graphqlRequest<{ contacts: ContactsResponse }>(query, variables);
  return data.contacts;
};

// Keep backward compatibility
export const getAllContacts = async (): Promise<Contact[]> => {
  const response = await getContacts();
  return response.contacts;
};

export const getContactById = async (id: string): Promise<Contact | undefined> => {
  const query = `query ($id: ID!) { contact(id: $id) { id name email phone subject message consent } }`;
  const data = await graphqlRequest<{ contact: Contact | null }>(query, { id });
  return data.contact || undefined;
};

export const addContact = async (input: ContactInput): Promise<Contact | null> => {
  const mutation = `mutation ($input: ContactInput!) { addContact(input: $input) { id name email phone subject message consent } }`;
  try {
    const data = await graphqlRequest<{ addContact: Contact }>(mutation, { input });
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
    const data = await graphqlRequest<{ updateContact: Contact }>(mutation, { id, input });
    return data.updateContact;
  } catch (e: unknown) {
    const error = e as Error;
    if (error.message.includes('Another contact with this email already exists')) return null;
    throw e;
  }
};

export const deleteContact = async (id: string): Promise<boolean> => {
  const mutation = `mutation ($id: ID!) { deleteContact(id: $id) }`;
  const data = await graphqlRequest<{ deleteContact: boolean }>(mutation, { id });
  return data.deleteContact;
};
