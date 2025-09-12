// src/services/contactService.ts

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  consent: boolean;
}

const STORAGE_KEY = 'contacts';

const generateId = () => '_' + Math.random().toString(36).substring(2, 9);

const getStoredContacts = (): Contact[] => {
  try {
    const json = localStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.error('Error reading contacts from localStorage', e);
    return [];
  }
};

const saveToStorage = (contacts: Contact[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
};

export const getContacts = (): Contact[] => {
  return getStoredContacts();
};

export const getContactById = (id: string): Contact | undefined => {
  return getStoredContacts().find(c => c.id === id);
};

export const addContact = (data: Omit<Contact, 'id'>): Contact | null => {
  const contacts = getStoredContacts();
  if (contacts.some(c => c.email === data.email)) {
    console.warn('Email already exists.');
    return null;
  }
  const newContact: Contact = { id: generateId(), ...data };
  saveToStorage([...contacts, newContact]);
  return newContact;
};

export const updateContact = (id: string, updated: Omit<Contact, 'id'>): Contact | null => {
  const contacts = getStoredContacts();
  if (contacts.some(c => c.id !== id && c.email === updated.email)) {
    console.warn('Another contact with this email already exists.');
    return null;
  }

  let updatedContact: Contact | null = null;
  const updatedContacts = contacts.map(c => {
    if (c.id === id) {
      updatedContact = { id, ...updated };
      return updatedContact;
    }
    return c;
  });

  saveToStorage(updatedContacts);
  return updatedContact;
};

export const deleteContact = (id: string): void => {
  const contacts = getStoredContacts();
  saveToStorage(contacts.filter(c => c.id !== id));
};
