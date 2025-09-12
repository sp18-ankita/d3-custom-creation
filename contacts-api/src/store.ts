import crypto from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';

// Simple in-memory cache
let contactsCache: Contact[] | null = null;
let contactsCacheTime = 0;
const CACHE_TTL = 10 * 1000; // 10 seconds

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

const DATA_PATH = path.resolve(process.cwd(), 'data', 'contacts.json');

async function ensureFile() {
  try {
    await fs.access(DATA_PATH);
  } catch {
    await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
    await fs.writeFile(DATA_PATH, '[]', 'utf-8');
  }
}

export async function readAll(): Promise<Contact[]> {
  const now = Date.now();
  if (contactsCache && now - contactsCacheTime < CACHE_TTL) {
    return contactsCache;
  }
  await ensureFile();
  const buf = await fs.readFile(DATA_PATH, 'utf-8');
  try {
    contactsCache = JSON.parse(buf) as Contact[];
    contactsCacheTime = now;
    return contactsCache;
  } catch {
    contactsCache = [];
    contactsCacheTime = now;
    return contactsCache;
  }
}

export async function getContactsWithFiltering(
  filter?: ContactsFilter,
  sort?: ContactsSort,
  pagination?: ContactsPagination,
): Promise<ContactsResponse> {
  let contacts = await readAll();

  // Apply filters
  if (filter) {
    contacts = contacts.filter(contact => {
      if (filter.name && !contact.name.toLowerCase().includes(filter.name.toLowerCase())) {
        return false;
      }
      if (filter.email && !contact.email.toLowerCase().includes(filter.email.toLowerCase())) {
        return false;
      }
      if (filter.phone && !contact.phone.toLowerCase().includes(filter.phone.toLowerCase())) {
        return false;
      }
      if (filter.subject && !contact.subject.toLowerCase().includes(filter.subject.toLowerCase())) {
        return false;
      }
      if (filter.message && !contact.message.toLowerCase().includes(filter.message.toLowerCase())) {
        return false;
      }
      if (filter.consent !== undefined && contact.consent !== filter.consent) {
        return false;
      }
      return true;
    });
  }

  // Apply sorting
  if (sort) {
    contacts.sort((a, b) => {
      const aValue = a[sort.field];
      const bValue = b[sort.field];

      let comparison = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.toLowerCase().localeCompare(bValue.toLowerCase());
      } else if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
        comparison = aValue === bValue ? 0 : aValue ? 1 : -1;
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sort.order === 'DESC' ? -comparison : comparison;
    });
  }

  const total = contacts.length;

  // Apply pagination
  const page = pagination?.page || 1;
  const limit = pagination?.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedContacts = contacts.slice(startIndex, endIndex);

  return {
    contacts: paginatedContacts,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

async function writeAll(contacts: Contact[]) {
  await ensureFile();
  await fs.writeFile(DATA_PATH, JSON.stringify(contacts, null, 2), 'utf-8');
}

export async function getById(id: string) {
  const items = await readAll();
  return items.find(c => c.id === id);
}

export async function add(input: Omit<Contact, 'id'>) {
  const items = await readAll();
  if (items.some(c => c.email.toLowerCase() === input.email.toLowerCase())) {
    throw new Error('Email already exists');
  }
  const newContact: Contact = {
    id: '_' + crypto.randomBytes(4).toString('hex'),
    ...input,
  };
  await writeAll([...items, newContact]);
  // Invalidate cache
  contactsCache = null;
  return newContact;
}

export async function update(id: string, input: Omit<Contact, 'id'>) {
  const items = await readAll();
  if (items.some(c => c.id !== id && c.email.toLowerCase() === input.email.toLowerCase())) {
    throw new Error('Another contact with this email already exists');
  }
  let updated: Contact | undefined;
  const next = items.map(c => {
    if (c.id === id) {
      updated = { id, ...input };
      return updated!;
    }
    return c;
  });
  if (!updated) {
    throw new Error('Contact not found');
  }
  await writeAll(next);
  // Invalidate cache
  contactsCache = null;
  return updated;
}

export async function remove(id: string) {
  const items = await readAll();
  const next = items.filter(c => c.id !== id);
  await writeAll(next);
  // Invalidate cache
  contactsCache = null;
  return next.length !== items.length;
}
