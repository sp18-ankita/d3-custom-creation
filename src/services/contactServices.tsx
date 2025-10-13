// import axios from 'axios';
import { useDataFetcher } from '../hooks/useDataFetcher';
import { cacheService, contactsCache } from './cacheService';

// Types
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  consent: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactsFilter {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  consent?: boolean;
}

export interface ContactsSort {
  field: 'name' | 'email' | 'phone' | 'subject' | 'consent';
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

// Base API configuration (ready for future backend integration)
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4001';

// Note: API client is prepared for future use when connecting to real backend
// const api = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// Mock data for development (since we don't have a full REST API yet)
const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1-555-0123',
    subject: 'General Inquiry',
    message: 'Hello, I would like to know more about your services.',
    consent: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1-555-0456',
    subject: 'Support Request',
    message: 'I need help with my account.',
    consent: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    subject: 'Feature Request',
    message: 'Can you add a dark mode feature?',
    consent: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let contactsData = [...mockContacts];

// Helper functions
const applyFilters = (contacts: Contact[], filter: ContactsFilter): Contact[] => {
  return contacts.filter(contact => {
    if (filter.name && !contact.name.toLowerCase().includes(filter.name.toLowerCase())) {
      return false;
    }
    if (filter.email && !contact.email.toLowerCase().includes(filter.email.toLowerCase())) {
      return false;
    }
    if (filter.phone && contact.phone && !contact.phone.includes(filter.phone)) {
      return false;
    }
    if (filter.subject && !contact.subject.toLowerCase().includes(filter.subject.toLowerCase())) {
      return false;
    }
    if (filter.consent !== undefined && contact.consent !== filter.consent) {
      return false;
    }
    return true;
  });
};

const applySorting = (contacts: Contact[], sort: ContactsSort): Contact[] => {
  return contacts.sort((a, b) => {
    let aValue = a[sort.field];
    let bValue = b[sort.field];

    // Handle undefined values
    if (aValue === undefined) aValue = '';
    if (bValue === undefined) bValue = '';

    // Convert to string for comparison
    const aStr = String(aValue).toLowerCase();
    const bStr = String(bValue).toLowerCase();

    if (sort.order === 'ASC') {
      return aStr.localeCompare(bStr);
    } else {
      return bStr.localeCompare(aStr);
    }
  });
};

const applyPagination = (contacts: Contact[], pagination: ContactsPagination): Contact[] => {
  const startIndex = (pagination.page - 1) * pagination.limit;
  const endIndex = startIndex + pagination.limit;
  return contacts.slice(startIndex, endIndex);
};

// API Functions
export const getContacts = async (
  filter: ContactsFilter = {},
  sort: ContactsSort = { field: 'name', order: 'ASC' },
  pagination: ContactsPagination = { page: 1, limit: 10 },
): Promise<ContactsResponse> => {
  try {
    // Create a cache key based on parameters
    const cacheKey = cacheService.createKey(
      'contacts',
      JSON.stringify(filter),
      sort.field,
      sort.order,
      pagination.page,
      pagination.limit,
    );

    // Try to get from cache first
    const cachedResult = contactsCache.get(cacheKey) as ContactsResponse | null;
    if (cachedResult) {
      return cachedResult;
    }

    // In a real application, you would make an API call here
    // For now, we'll use mock data with client-side filtering

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Apply filters
    let filteredContacts = applyFilters(contactsData, filter);

    // Apply sorting
    filteredContacts = applySorting(filteredContacts, sort);

    // Calculate pagination
    const total = filteredContacts.length;
    const totalPages = Math.ceil(total / pagination.limit);

    // Apply pagination
    const contacts = applyPagination(filteredContacts, pagination);

    const result = {
      contacts,
      total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages,
    };

    // Cache the result
    contactsCache.set(cacheKey, result);

    return result;
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw new Error('Failed to fetch contacts');
  }
};

export const getContact = async (id: string): Promise<Contact> => {
  try {
    // Check cache first
    const cacheKey = `contact_${id}`;
    const cachedContact = contactsCache.get(cacheKey) as Contact | null;
    if (cachedContact) {
      return cachedContact;
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));

    const contact = contactsData.find(c => c.id === id);
    if (!contact) {
      throw new Error('Contact not found');
    }

    // Cache the contact
    contactsCache.set(cacheKey, contact);

    return contact;
  } catch (error) {
    console.error('Error fetching contact:', error);
    throw error;
  }
};

export const createContact = async (
  contactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<Contact> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const newContact: Contact = {
      ...contactData,
      id: Date.now().toString(), // Simple ID generation for demo
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    contactsData.push(newContact);

    // Cache the new contact
    contactsCache.set(`contact_${newContact.id}`, newContact);

    // Clear contacts list cache to force refresh
    contactsCache.clear();

    return newContact;
  } catch (error) {
    console.error('Error creating contact:', error);
    throw new Error('Failed to create contact');
  }
};

export const updateContact = async (
  id: string,
  contactData: Partial<Omit<Contact, 'id' | 'createdAt'>>,
): Promise<Contact> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));

    const contactIndex = contactsData.findIndex(c => c.id === id);
    if (contactIndex === -1) {
      throw new Error('Contact not found');
    }

    const updatedContact: Contact = {
      ...contactsData[contactIndex],
      ...contactData,
      updatedAt: new Date().toISOString(),
    };

    contactsData[contactIndex] = updatedContact;
    return updatedContact;
  } catch (error) {
    console.error('Error updating contact:', error);
    throw error;
  }
};

export const deleteContact = async (id: string): Promise<void> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const contactIndex = contactsData.findIndex(c => c.id === id);
    if (contactIndex === -1) {
      throw new Error('Contact not found');
    }

    contactsData.splice(contactIndex, 1);
  } catch (error) {
    console.error('Error deleting contact:', error);
    throw error;
  }
};

// Utility function to reset data (useful for testing)
export const resetContactsData = (): void => {
  contactsData = [...mockContacts];
};

// Aliases for backward compatibility
export const addContact = createContact;
export const getContactById = getContact;

/**
 * Hook for using contacts API with data fetching capabilities
 */
export const useContactsAPI = () => {
  const fetcher = useDataFetcher<ContactsResponse | Contact>({
    cache: true,
    cacheConfig: {
      ttl: 5 * 60 * 1000, // 5 minutes cache
      storage: 'localStorage',
    },
  });

  return {
    ...fetcher,
    getContacts: async (
      filter?: ContactsFilter,
      sort?: ContactsSort,
      pagination?: ContactsPagination,
    ) => {
      return getContacts(filter, sort, pagination);
    },
    addContact: async (contactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => {
      return createContact(contactData);
    },
    getContactById: async (id: string) => {
      return getContact(id);
    },
    updateContact: async (id: string, contactData: Partial<Omit<Contact, 'id' | 'createdAt'>>) => {
      return updateContact(id, contactData);
    },
    deleteContact: async (id: string) => {
      return deleteContact(id);
    },
  };
};

export default {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
  resetContactsData,
  // Add aliases to default export as well
  addContact,
  getContactById,
};
