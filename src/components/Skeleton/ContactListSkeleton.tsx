import React from 'react';
import Skeleton from './index';

interface ContactListSkeletonProps {
  rows?: number;
}

/**
 * Skeleton loader for the Contact List component
 */
const ContactListSkeleton: React.FC<ContactListSkeletonProps> = ({ rows = 5 }) => {
  return (
    <div className="contact-list-page">
      {/* Page Header Skeleton */}
      <div className="page-header">
        <div className="header-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Skeleton width="2rem" height="2rem" variant="circular" />
            <Skeleton height="2.5rem" width="300px" />
          </div>
          <div className="header-stats">
            <div className="stat-card">
              <Skeleton height="1.75rem" width="60px" />
              <Skeleton height="0.875rem" width="80px" />
            </div>
            <div className="stat-card">
              <Skeleton height="1.75rem" width="40px" />
              <Skeleton height="0.875rem" width="60px" />
            </div>
          </div>
        </div>
      </div>

      <div className="page-content">
        {/* Filters Section Skeleton */}
        <div className="skeleton-filters">
          <div className="filters-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Skeleton width="1.25rem" height="1.25rem" variant="circular" />
              <Skeleton height="1.25rem" width="150px" />
            </div>
            <Skeleton height="2rem" width="120px" borderRadius="8px" />
          </div>

          <div className="skeleton-filters-grid">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="skeleton-filter-group">
                <Skeleton height="0.875rem" width="80px" />
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Skeleton
                    width="1rem"
                    height="1rem"
                    variant="circular"
                    style={{ position: 'absolute', left: '0.75rem', zIndex: 1 }}
                  />
                  <Skeleton height="2.5rem" width="100%" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls Section Skeleton */}
        <div className="skeleton-controls">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Skeleton width="1rem" height="1rem" variant="circular" />
            <Skeleton height="0.875rem" width="60px" />
            <Skeleton height="2rem" width="120px" />
            <Skeleton height="2rem" width="80px" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Skeleton width="1rem" height="1rem" variant="circular" />
            <Skeleton height="0.875rem" width="100px" />
            <Skeleton height="2rem" width="100px" />
          </div>
        </div>

        {/* Results Info Skeleton */}
        <div className="results-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Skeleton width="1rem" height="1rem" variant="circular" />
            <Skeleton height="0.875rem" width="200px" />
          </div>
          <Skeleton height="0.875rem" width="100px" />
        </div>

        {/* Table Skeleton */}
        <div className="table-container">
          <div className="table-wrapper">
            <table className="contacts-table">
              {/* Table Header Skeleton */}
              <thead>
                <tr>
                  {['Name', 'Email', 'Phone', 'Subject', 'Message', 'Consent', 'Actions'].map(
                    (header, index) => (
                      <th key={index} style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Skeleton width="1rem" height="1rem" variant="circular" />
                          <Skeleton height="1rem" width={`${header.length * 8}px`} />
                        </div>
                      </th>
                    ),
                  )}
                </tr>
              </thead>

              {/* Table Body Skeleton */}
              <tbody>
                {Array.from({ length: rows }).map((_, rowIndex) => (
                  <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'even' : 'odd'}>
                    {/* Name Cell */}
                    <td className="skeleton-contact-cell">
                      <Skeleton height="1rem" width="120px" />
                    </td>

                    {/* Email Cell */}
                    <td className="skeleton-contact-cell">
                      <Skeleton height="1rem" width="180px" />
                    </td>

                    {/* Phone Cell */}
                    <td className="skeleton-contact-cell">
                      <Skeleton height="1rem" width="100px" />
                    </td>

                    {/* Subject Cell */}
                    <td className="skeleton-contact-cell">
                      <Skeleton height="1rem" width="150px" />
                    </td>

                    {/* Message Cell */}
                    <td className="skeleton-contact-cell">
                      <Skeleton height="1rem" width="100px" />
                    </td>

                    {/* Consent Cell */}
                    <td className="skeleton-contact-cell">
                      <Skeleton height="1.5rem" width="60px" borderRadius="20px" />
                    </td>

                    {/* Actions Cell */}
                    <td className="skeleton-contact-cell">
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Skeleton height="1.8rem" width="60px" borderRadius="6px" />
                        <Skeleton height="1.8rem" width="70px" borderRadius="6px" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Skeleton */}
        <div className="pagination-container">
          <div className="pagination-info">
            <Skeleton width="1rem" height="1rem" variant="circular" />
            <Skeleton height="0.875rem" width="100px" />
          </div>
          <div className="pagination">
            <Skeleton height="2rem" width="60px" borderRadius="6px" />
            <Skeleton height="2rem" width="80px" borderRadius="6px" />
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} height="2rem" width="2rem" borderRadius="6px" />
            ))}
            <Skeleton height="2rem" width="60px" borderRadius="6px" />
            <Skeleton height="2rem" width="50px" borderRadius="6px" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactListSkeleton;
