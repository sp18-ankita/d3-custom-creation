import '@testing-library/jest-dom';

import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, expect, test, vi } from 'vitest';
import ContactList from '../components/ContactList';
import * as contactService from '../services/contactServices';

vi.mock('../services/contactServices');

const mockedService = vi.mocked(contactService);

beforeEach(() => {
  vi.clearAllMocks();
});

test('shows empty state when no contacts', async () => {
  mockedService.getContacts.mockResolvedValue({
    contacts: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  render(
    <MemoryRouter>
      <ContactList />
    </MemoryRouter>,
  );
  expect(await screen.findByText(/No contacts found/i)).toBeInTheDocument();
});

test('renders contact list and triggers delete', async () => {
  mockedService.getContacts.mockResolvedValue({
    contacts: [
      {
        id: '1',
        name: 'John',
        email: 'john@example.com',
        phone: '123456',
        subject: 'Test',
        message: 'Hello',
        consent: true,
      },
    ],
    total: 1,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  mockedService.deleteContact.mockResolvedValue(undefined);

  // Mock window.confirm to return true
  window.confirm = vi.fn().mockReturnValue(true);
  // Mock window.alert
  window.alert = vi.fn();

  render(
    <MemoryRouter>
      <ContactList />
    </MemoryRouter>,
  );

  expect(await screen.findByText('John')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /delete/i }));
  expect(mockedService.deleteContact).toHaveBeenCalledWith('1');
});
