import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import NotFoundPage from './index';

const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('NotFoundPage', () => {
  it('renders 404 page with all elements', () => {
    renderWithRouter(<NotFoundPage />);

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    expect(screen.getByText(/Oops! The page you're looking for doesn't exist/)).toBeInTheDocument();
  });

  it('displays suggestions section', () => {
    renderWithRouter(<NotFoundPage />);

    expect(screen.getByText('Here are some suggestions:')).toBeInTheDocument();
    expect(screen.getByText('Check the URL for typos')).toBeInTheDocument();
    expect(screen.getByText('Go back to the previous page')).toBeInTheDocument();
    expect(screen.getByText('Visit our homepage')).toBeInTheDocument();
    expect(screen.getByText('Use the navigation menu')).toBeInTheDocument();
  });

  it('renders action buttons', () => {
    renderWithRouter(<NotFoundPage />);

    expect(screen.getByRole('link', { name: /go home/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /learn more/i })).toBeInTheDocument();
  });

  it('renders navigation links grid', () => {
    renderWithRouter(<NotFoundPage />);

    expect(screen.getByText('Quick Navigation')).toBeInTheDocument();

    // Use getAllByRole to handle multiple "Home" links
    const homeLinks = screen.getAllByRole('link', { name: /home/i });
    expect(homeLinks.length).toBeGreaterThan(0);

    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /contacts/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /add contact/i })).toBeInTheDocument();
  });

  it('has correct navigation links', () => {
    renderWithRouter(<NotFoundPage />);

    const homeLink = screen.getByRole('link', { name: /go home/i });
    expect(homeLink).toHaveAttribute('href', '/');

    const aboutLink = screen.getByRole('link', { name: /learn more/i });
    expect(aboutLink).toHaveAttribute('href', '/about');

    const navHomeLinks = screen.getAllByRole('link', { name: /home/i });
    const navHomeLink = navHomeLinks.find(
      link => link.getAttribute('href') === '/' && link.textContent?.includes('Home'),
    );
    expect(navHomeLink).toHaveAttribute('href', '/');

    const navAboutLink = screen.getByRole('link', { name: /about/i });
    expect(navAboutLink).toHaveAttribute('href', '/about');

    const contactsLink = screen.getByRole('link', { name: /contacts/i });
    expect(contactsLink).toHaveAttribute('href', '/contacts');

    const addContactLink = screen.getByRole('link', { name: /add contact/i });
    expect(addContactLink).toHaveAttribute('href', '/contacts/new');
  });

  it('calls window.history.back when Go Back button is clicked', () => {
    const mockBack = vi.fn();
    const originalBack = window.history.back;
    window.history.back = mockBack;

    renderWithRouter(<NotFoundPage />);

    const goBackButton = screen.getByRole('button', { name: /go back/i });
    fireEvent.click(goBackButton);

    expect(mockBack).toHaveBeenCalledTimes(1);

    window.history.back = originalBack;
  });
});
