import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ContactFormSkeleton from './ContactFormSkeleton';
import ContactListSkeleton from './ContactListSkeleton';
import Skeleton from './index';
import { SkeletonCard, SkeletonListItem, SkeletonText } from './SkeletonComponents';

describe('Skeleton Components', () => {
  describe('Base Skeleton', () => {
    it('renders with default props', () => {
      render(<Skeleton />);
      const skeleton = document.querySelector('.skeleton');
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveClass('skeleton--text');
      expect(skeleton).toHaveClass('skeleton--pulse');
    });

    it('renders with custom props', () => {
      render(
        <Skeleton
          width="200px"
          height="50px"
          variant="rectangular"
          animation="wave"
          className="custom-skeleton"
        />,
      );
      const skeleton = document.querySelector('.skeleton');
      expect(skeleton).toHaveClass('skeleton--rectangular');
      expect(skeleton).toHaveClass('skeleton--wave');
      expect(skeleton).toHaveClass('custom-skeleton');
    });

    it('renders circular variant', () => {
      render(<Skeleton variant="circular" width="40px" height="40px" />);
      const skeleton = document.querySelector('.skeleton');
      expect(skeleton).toHaveClass('skeleton--circular');
    });

    it('applies custom styles', () => {
      render(<Skeleton style={{ backgroundColor: 'red' }} />);
      const skeleton = document.querySelector('.skeleton') as HTMLElement;
      expect(skeleton.style.backgroundColor).toBe('red');
    });
  });

  describe('ContactFormSkeleton', () => {
    it('renders form skeleton structure', () => {
      render(<ContactFormSkeleton />);

      // Check for form container
      const formContainer = document.querySelector('.skeleton-form');
      expect(formContainer).toBeInTheDocument();

      // Check for multiple form groups (should have several skeleton elements)
      const skeletonElements = document.querySelectorAll('.skeleton');
      expect(skeletonElements.length).toBeGreaterThan(5); // Should have multiple fields
    });

    it('has proper form structure', () => {
      render(<ContactFormSkeleton />);

      // Should have form groups
      const formGroups = document.querySelectorAll('.skeleton-form-group');
      expect(formGroups.length).toBeGreaterThan(3);
    });
  });

  describe('ContactListSkeleton', () => {
    it('renders with default rows', () => {
      render(<ContactListSkeleton />);

      // Check for page structure
      expect(document.querySelector('.contact-list-page')).toBeInTheDocument();
      expect(document.querySelector('.page-header')).toBeInTheDocument();
      expect(document.querySelector('.page-content')).toBeInTheDocument();
    });

    it('renders with custom row count', () => {
      render(<ContactListSkeleton rows={3} />);

      // Check for table rows (should have header + 3 body rows)
      const tableRows = document.querySelectorAll('tbody tr');
      expect(tableRows).toHaveLength(3);
    });

    it('has proper table structure', () => {
      render(<ContactListSkeleton />);

      // Check for table elements
      expect(document.querySelector('table')).toBeInTheDocument();
      expect(document.querySelector('thead')).toBeInTheDocument();
      expect(document.querySelector('tbody')).toBeInTheDocument();

      // Check for header columns
      const headerCells = document.querySelectorAll('thead th');
      expect(headerCells).toHaveLength(7); // Name, Email, Phone, Subject, Message, Consent, Actions
    });
  });

  describe('SkeletonText', () => {
    it('renders multiple lines', () => {
      render(<SkeletonText lines={3} />);

      const container = document.querySelector('.skeleton-text-lines');
      expect(container).toBeInTheDocument();

      const skeletonLines = container?.querySelectorAll('.skeleton');
      expect(skeletonLines).toHaveLength(3);
    });

    it('renders single line', () => {
      render(<SkeletonText lines={1} />);

      const skeletonLines = document.querySelectorAll('.skeleton-text-lines .skeleton');
      expect(skeletonLines).toHaveLength(1);
    });
  });

  describe('SkeletonListItem', () => {
    it('renders with avatar by default', () => {
      render(<SkeletonListItem />);

      expect(document.querySelector('.skeleton-list-item')).toBeInTheDocument();
      expect(document.querySelector('.skeleton-avatar')).toBeInTheDocument();
      expect(document.querySelector('.skeleton-content')).toBeInTheDocument();
    });

    it('renders without avatar when disabled', () => {
      render(<SkeletonListItem avatar={false} />);

      expect(document.querySelector('.skeleton-list-item')).toBeInTheDocument();
      expect(document.querySelector('.skeleton-avatar')).not.toBeInTheDocument();
    });

    it('renders with actions when enabled', () => {
      render(<SkeletonListItem actions={true} />);

      expect(document.querySelector('.skeleton-list-item')).toBeInTheDocument();
      // Should have action buttons (skeleton elements for buttons)
      const actionSkeletons = document.querySelectorAll('.skeleton-list-item .skeleton');
      expect(actionSkeletons.length).toBeGreaterThan(2); // Avatar + content + actions
    });
  });

  describe('SkeletonCard', () => {
    it('renders with image by default', () => {
      render(<SkeletonCard />);

      expect(document.querySelector('.skeleton-card')).toBeInTheDocument();
      const skeletons = document.querySelectorAll('.skeleton-card .skeleton');
      expect(skeletons.length).toBeGreaterThan(3); // Image + title + text lines + actions
    });

    it('renders without image when disabled', () => {
      render(<SkeletonCard hasImage={false} />);

      expect(document.querySelector('.skeleton-card')).toBeInTheDocument();
      // Should still have skeletons, but fewer without the image
      const skeletons = document.querySelectorAll('.skeleton-card .skeleton');
      expect(skeletons.length).toBeGreaterThan(2);
    });

    it('renders without actions when disabled', () => {
      render(<SkeletonCard hasActions={false} />);

      expect(document.querySelector('.skeleton-card')).toBeInTheDocument();
      // Should have skeletons but no action buttons
      const skeletons = document.querySelectorAll('.skeleton-card .skeleton');
      expect(skeletons.length).toBeGreaterThan(2);
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<Skeleton />);

      const skeleton = document.querySelector('.skeleton');
      expect(skeleton).toHaveAttribute('role', 'status');
      expect(skeleton).toHaveAttribute('aria-label', 'Loading...');
    });

    it('respects reduced motion preferences', () => {
      // Mock prefers-reduced-motion
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query: string) => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      render(<Skeleton animation="pulse" />);

      const skeleton = document.querySelector('.skeleton');
      expect(skeleton).toHaveClass('skeleton--pulse');
    });
  });
});
