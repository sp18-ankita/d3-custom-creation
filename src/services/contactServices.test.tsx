// __tests__/contactService.test.ts
import { beforeEach, expect, test } from 'vitest';
import {
  addContact,
  deleteContact,
  getContactById,
  getContacts,
  updateContact,
} from '../services/contactServices';

beforeEach(() => localStorage.clear());

const contact = {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  subject: 'Test',
  message: 'This is a test message',
  consent: true,
};
test('adds a contact', () => {
  const added = addContact(contact);
  expect(added).toBeDefined();
  expect(added?.id).toBeDefined();
  expect(added?.name).toBe('John Doe');
});
test('prevents duplicate email on add', () => {
  addContact(contact);
  const result = addContact(contact);
  expect(result).toBeNull();
});

test('gets contact by ID', () => {
  const added = addContact(contact)!;
  const found = getContactById(added.id);
  expect(found?.name).toBe('John Doe');
});

test('updates a contact', () => {
  const added = addContact(contact)!;
  const updated = updateContact(added.id, { ...contact, name: 'Updated' })!;
  expect(updated.name).toBe('Updated');
});

test('deletes a contact', () => {
  const added = addContact(contact)!;
  deleteContact(added.id);
  expect(getContacts()).toHaveLength(0);
});
