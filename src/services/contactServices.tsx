const ContactFragment = `
  fragment ContactFields on Contact {
    id
    name
    email
    phone
    subject
    message
    consent
  }
`;

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  consent: boolean;
}

interface ContactsFilter {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  consent?: boolean;
}

interface ContactsSort {
  field: 'name' | 'email' | 'phone' | 'subject' | 'message' | 'consent';
  order: 'ASC' | 'DESC';
}

interface ContactsPagination {
  page: number;
  limit: number;
}

interface ContactsResponse {
  contacts: Contact[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

import { useDataFetcher } from '../hooks/useDataFetcher';

const getContactsQuery = `
  ${ContactFragment}
  query GetContacts($filter: ContactsFilter, $sort: ContactsSort, $pagination: ContactsPagination) {
    contacts(filter: $filter, sort: $sort, pagination: $pagination) {
      contacts {
        ...ContactFields
      }
      total
      page
      limit
      totalPages
    }
  }
`;

const getContactByIdQuery = `
  ${ContactFragment}
  query GetContact($id: ID!) {
    contact(id: $id) {
      ...ContactFields
    }
  }
`;

const addContactMutation = `
  ${ContactFragment}
  mutation AddContact($input: ContactInput!) {
    addContact(input: $input) {
      ...ContactFields
    }
  }
`;

const updateContactMutation = `
  ${ContactFragment}
  mutation UpdateContact($id: ID!, $input: ContactInput!) {
    updateContact(id: $id, input: $input) {
      ...ContactFields
    }
  }
`;

const deleteContactMutation = `
  mutation DeleteContact($id: ID!) {
    deleteContact(id: $id)
  }
`;

export function useGetContacts() {
  const fetcher = useDataFetcher<{ contacts: ContactsResponse }>();

  const execute = async (
    filter?: ContactsFilter,
    sort?: ContactsSort,
    pagination?: ContactsPagination,
  ): Promise<ContactsResponse | null> => {
    const result = await fetcher.graphql({
      query: getContactsQuery,
      variables: { filter, sort, pagination },
    });
    return result?.contacts ?? null;
  };

  return {
    ...fetcher,
    execute,
  };
}

export function useGetContactById() {
  const fetcher = useDataFetcher<{ contact: Contact }>();

  const execute = async (id: string): Promise<Contact | null> => {
    const result = await fetcher.graphql({
      query: getContactByIdQuery,
      variables: { id },
    });
    return result?.contact ?? null;
  };

  return {
    ...fetcher,
    execute,
  };
}

export function useAddContact() {
  const fetcher = useDataFetcher<{ addContact: Contact }>();

  const execute = async (input: Omit<Contact, 'id'>): Promise<Contact | null> => {
    const result = await fetcher.graphql({
      query: addContactMutation,
      variables: { input },
    });
    return result?.addContact ?? null;
  };

  return {
    ...fetcher,
    execute,
  };
}

export function useUpdateContact() {
  const fetcher = useDataFetcher<{ updateContact: Contact }>();

  const execute = async (id: string, input: Omit<Contact, 'id'>): Promise<Contact | null> => {
    const result = await fetcher.graphql({
      query: updateContactMutation,
      variables: { id, input },
    });
    return result?.updateContact ?? null;
  };

  return {
    ...fetcher,
    execute,
  };
}

export function useDeleteContact() {
  const fetcher = useDataFetcher<{ deleteContact: boolean }>();

  const execute = async (id: string): Promise<boolean> => {
    const result = await fetcher.graphql({
      query: deleteContactMutation,
      variables: { id },
    });
    return result?.deleteContact ?? false;
  };

  return {
    ...fetcher,
    execute,
  };
}

export type { Contact, ContactsFilter, ContactsPagination, ContactsResponse, ContactsSort };

const GRAPHQL_ENDPOINT = 'http://localhost:4001/graphql';

interface GraphQLVariables {
  id?: string;
  input?: Omit<Contact, 'id'>;
  filter?: ContactsFilter;
  sort?: ContactsSort;
  pagination?: ContactsPagination;
}

const dataFetcher = (query: string, variables?: GraphQLVariables) => {
  return fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  }).then(async res => {
    const data = await res.json();
    if (data.errors) {
      throw new Error(data.errors[0]?.message || 'GraphQL Error');
    }
    return data;
  });
};

export const getContacts = async (
  filter?: ContactsFilter,
  sort?: ContactsSort,
  pagination?: ContactsPagination,
): Promise<ContactsResponse> => {
  const result = await dataFetcher(getContactsQuery, { filter, sort, pagination });
  if (!result.data?.contacts) {
    throw new Error('Failed to fetch contacts');
  }
  return result.data.contacts;
};

export const getContactById = async (id: string): Promise<Contact> => {
  const result = await dataFetcher(getContactByIdQuery, { id });
  if (!result.data?.contact) {
    throw new Error('Failed to fetch contact');
  }
  return result.data.contact;
};

export const addContact = async (input: Omit<Contact, 'id'>): Promise<Contact> => {
  const result = await dataFetcher(addContactMutation, { input });
  if (!result.data?.addContact) {
    throw new Error('Failed to add contact');
  }
  return result.data.addContact;
};

export const updateContact = async (id: string, input: Omit<Contact, 'id'>): Promise<Contact> => {
  const result = await dataFetcher(updateContactMutation, { id, input });
  if (!result.data?.updateContact) {
    throw new Error('Failed to update contact');
  }
  return result.data.updateContact;
};

export const deleteContact = async (id: string): Promise<boolean> => {
  const result = await dataFetcher(deleteContactMutation, { id });
  return result.data?.deleteContact ?? false;
};
