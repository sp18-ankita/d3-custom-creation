import '@testing-library/jest-dom';

import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import * as contactService from '../services/contactServices';
import ContactForm from './ContactUs';

vi.mock('../services/contactServices');

const mockedService = vi.mocked(contactService);

beforeEach(() => {
  vi.clearAllMocks();
});

const renderForm = (id?: string) => {
  return render(
    <MemoryRouter initialEntries={[id ? `/contacts/${id}` : '/contacts/new']}>
      <Routes>
        <Route path="/contacts/new" element={<ContactForm />} />
        <Route path="/contacts/:id" element={<ContactForm />} />
      </Routes>
    </MemoryRouter>,
  );
};

describe('ContactForm', () => {
  test('renders empty form in create mode', () => {
    renderForm();

    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toHaveValue('');
    expect(screen.getByLabelText(/Phone/i)).toHaveValue('');
    expect(screen.getByLabelText(/Subject/i)).toHaveValue('');
    expect(screen.getByLabelText(/Message/i)).toHaveValue('');
  });

  test('shows validation errors on submit', async () => {
    renderForm();

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(await screen.findByText(/Full name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Subject is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Message is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Consent is required/i)).toBeInTheDocument();
  });

  test('submits form and shows thank you message', async () => {
    mockedService.addContact.mockResolvedValue({
      id: '1',
      name: 'Jane',
      email: 'jane@example.com',
      phone: '',
      subject: 'Help',
      message: 'This is a message',
      consent: true,
    });

    renderForm();

    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/Subject/i), { target: { value: 'Help' } });
    fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: 'This is a message' } });
    fireEvent.click(screen.getByTestId('consent'));

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(await screen.findByText(/Thank you for contacting us!/i)).toBeInTheDocument();
    expect(mockedService.addContact).toHaveBeenCalled();
  });

  test('shows error if email already exists', async () => {
    mockedService.addContact.mockRejectedValue(new Error('Email already exists')); // simulate duplicate

    renderForm();

    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/Subject/i), { target: { value: 'Help' } });
    fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: 'This is a message' } });
    fireEvent.click(screen.getByTestId('consent'));
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(await screen.findByText(/Email must be unique/i)).toBeInTheDocument();
  });

  test('loads existing contact in edit mode and updates', async () => {
    mockedService.getContactById.mockResolvedValue({
      id: '1',
      name: 'John',
      email: 'john@example.com',
      phone: '',
      subject: 'Support',
      message: 'Edit this message',
      consent: true,
    });

    mockedService.updateContact.mockResolvedValue({
      id: '1',
      name: 'John',
      email: 'john@example.com',
      phone: '',
      subject: 'Support',
      message: 'Edit this message',
      consent: true,
    });

    renderForm('1');

    expect(await screen.findByDisplayValue('John')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Message/i), {
      target: { value: 'Edited message content' },
    });

    fireEvent.click(screen.getByRole('button', { name: /update contact/i }));

    expect(await screen.findByText(/Contact updated/i)).toBeInTheDocument();
    expect(mockedService.updateContact).toHaveBeenCalledWith(
      '1',
      expect.objectContaining({
        message: 'Edited message content',
      }),
    );
  });

  test('checkbox toggles correctly', () => {
    renderForm();

    const checkbox = screen.getByTestId('consent') as HTMLInputElement;

    expect(checkbox.checked).toBe(false);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(false);
  });
});
