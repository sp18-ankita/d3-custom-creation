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

test('shows empty state when no contacts', () => {
  mockedService.getContacts.mockReturnValue([]);
  render(
    <MemoryRouter>
      <ContactList />
    </MemoryRouter>,
  );
  expect(screen.getByText(/No contacts submitted yet/i)).toBeInTheDocument();
});

test('renders contact list and triggers delete', () => {
  mockedService.getContacts.mockReturnValue([
    {
      id: '1',
      name: 'John',
      email: 'john@example.com',
      phone: '123456',
      subject: 'Test',
      message: 'Hello',
      consent: true,
    },
  ]);
  render(
    <MemoryRouter>
      <ContactList />
    </MemoryRouter>,
  );

  expect(screen.getByText('John')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /delete/i }));
  expect(mockedService.deleteContact).toHaveBeenCalledWith('1');
});
