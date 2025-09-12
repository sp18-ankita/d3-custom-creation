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
test('adds a contact', async () => {
  const added = await addContact(contact);
  expect(added).toBeDefined();
  expect(added?.id).toBeDefined();
  expect(added?.name).toBe('John Doe');
});

test('prevents duplicate email on add', async () => {
  await addContact(contact);
  const result = await addContact(contact);
  expect(result).toBeNull();
});

test('gets contact by ID', async () => {
  const added = await addContact(contact);
  expect(added).toBeDefined();
  const found = await getContactById(added!.id);
  expect(found?.name).toBe('John Doe');
});

test('updates a contact', async () => {
  const added = await addContact(contact);
  expect(added).toBeDefined();
  const updated = await updateContact(added!.id, { ...contact, name: 'Updated' });
  expect(updated?.name).toBe('Updated');
});

test('deletes a contact', async () => {
  const added = await addContact(contact);
  expect(added).toBeDefined();
  await deleteContact(added!.id);
  const contacts = await getContacts();
  expect(contacts.contacts).toHaveLength(0);
});
