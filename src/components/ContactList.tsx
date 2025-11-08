import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/conatctList.css'; // Make sure to import the styles
import {
  deleteContact,
  getContacts,
  type ContactsFilter,
  type ContactsPagination,
  type ContactsResponse,
  type ContactsSort,
} from '../services/contactServices';

const ContactList: React.FC = () => {
  const [contactsData, setContactsData] = useState<ContactsResponse>({
    contacts: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [filter, setFilter] = useState<ContactsFilter>({});
  const [sort, setSort] = useState<ContactsSort>({ field: 'name', order: 'ASC' });
  const [pagination, setPagination] = useState<ContactsPagination>({ page: 1, limit: 10 });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const loadContacts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getContacts(filter, sort, pagination);
      setContactsData(data);
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setLoading(false);
    }
  }, [filter, sort, pagination]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      await deleteContact(id);
      await loadContacts();
      alert('Contact deleted successfully.');
    }
  };

  const handleFilterChange = (field: keyof ContactsFilter, value: string | boolean) => {
    const newFilter = { ...filter };
    if (value === '' || value === undefined) {
      delete newFilter[field];
    } else {
      newFilter[field] = value as never;
    }
    setFilter(newFilter);
    setPagination({ ...pagination, page: 1 }); // Reset to first page when filtering
  };

  const handleSortChange = (field: ContactsSort['field']) => {
    const newOrder = sort.field === field && sort.order === 'ASC' ? 'DESC' : 'ASC';
    setSort({ field, order: newOrder });
  };

  const handlePageChange = (newPage: number) => {
    setPagination({ ...pagination, page: newPage });
  };

  const handleLimitChange = (newLimit: number) => {
    setPagination({ page: 1, limit: newLimit });
  };

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const renderPagination = () => {
    const { page, totalPages } = contactsData;
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pages.push(
        <button key={1} onClick={() => handlePageChange(1)} className="pagination-btn">
          1
        </button>,
      );
      if (startPage > 2) {
        pages.push(
          <span key="ellipsis1" className="pagination-ellipsis">
            ...
          </span>,
        );
      }
    }

    // Add visible page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`pagination-btn ${page === i ? 'active' : ''}`}
        >
          {i}
        </button>,
      );
    }

    // Add last page and ellipsis if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="ellipsis2" className="pagination-ellipsis">
            ...
          </span>,
        );
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="pagination-btn"
        >
          {totalPages}
        </button>,
      );
    }

    return (
      <div className="pagination-container">
        <div className="pagination-info">
          <span className="icon">📄</span>
          Page {page} of {totalPages}
        </div>
        <div className="pagination">
          <button
            onClick={() => handlePageChange(1)}
            disabled={page === 1}
            className="pagination-btn nav-btn"
            title="First page"
          >
            <span className="icon">⏮</span>
            First
          </button>
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="pagination-btn nav-btn"
            title="Previous page"
          >
            <span className="icon">◀</span>
            Previous
          </button>
          {pages}
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="pagination-btn nav-btn"
            title="Next page"
          >
            Next
            <span className="icon">▶</span>
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={page === totalPages}
            className="pagination-btn nav-btn"
            title="Last page"
          >
            Last
            <span className="icon">⏭</span>
          </button>
        </div>
      </div>
    );
  };

  const clearAllFilters = () => {
    setFilter({});
    setPagination({ page: 1, limit: pagination.limit });
  };

  const hasActiveFilters = Object.keys(filter).length > 0;

  return (
    <div className="contact-list-page">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            <span className="title-icon">�</span>
            Contact Management
          </h1>
          <div className="header-stats">
            <div className="stat-card">
              <span className="stat-number">{contactsData.total}</span>
              <span className="stat-label">Total Contacts</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{contactsData.contacts.length}</span>
              <span className="stat-label">Showing</span>
            </div>
          </div>
        </div>
      </div>

      <div className="page-content">
        {/* Enhanced Filters Section */}
        <div className="filters-section">
          <div className="filters-header">
            <h3 className="filters-title">
              <span className="icon">🔍</span>
              Search & Filter
            </h3>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="clear-filters-btn"
                title="Clear all filters"
              >
                <span className="icon">✖</span>
                Clear Filters
              </button>
            )}
          </div>

          <div className="filters-grid">
            <div className="filter-group">
              <label className="filter-label">Name</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={filter.name || ''}
                  onChange={e => handleFilterChange('name', e.target.value)}
                  className="filter-input"
                />
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-label">Email</label>
              <div className="input-wrapper">
                <span className="input-icon">📧</span>
                <input
                  type="text"
                  placeholder="Search by email..."
                  value={filter.email || ''}
                  onChange={e => handleFilterChange('email', e.target.value)}
                  className="filter-input"
                />
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-label">Phone</label>
              <div className="input-wrapper">
                <span className="input-icon">📱</span>
                <input
                  type="text"
                  placeholder="Search by phone..."
                  value={filter.phone || ''}
                  onChange={e => handleFilterChange('phone', e.target.value)}
                  className="filter-input"
                />
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-label">Subject</label>
              <div className="input-wrapper">
                <span className="input-icon">📝</span>
                <input
                  type="text"
                  placeholder="Search by subject..."
                  value={filter.subject || ''}
                  onChange={e => handleFilterChange('subject', e.target.value)}
                  className="filter-input"
                />
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-label">Consent Status</label>
              <div className="select-wrapper">
                <span className="input-icon">✅</span>
                <select
                  value={filter.consent !== undefined ? filter.consent.toString() : ''}
                  onChange={e => {
                    const value = e.target.value;
                    if (value === '') {
                      handleFilterChange('consent', '');
                    } else {
                      handleFilterChange('consent', value === 'true');
                    }
                  }}
                  className="filter-select"
                >
                  <option value="">All Statuses</option>
                  <option value="true">✓ Consented</option>
                  <option value="false">✗ Not Consented</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Controls Section */}
        <div className="controls-section">
          <div className="sort-controls">
            <div className="control-group">
              <label className="control-label">
                <span className="icon">🔄</span>
                Sort by
              </label>
              <div className="sort-wrapper">
                <select
                  value={sort.field}
                  onChange={e => handleSortChange(e.target.value as ContactsSort['field'])}
                  className="sort-select"
                >
                  <option value="name">Name</option>
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="subject">Subject</option>
                  <option value="consent">Consent</option>
                </select>
                <button
                  onClick={() => setSort({ ...sort, order: sort.order === 'ASC' ? 'DESC' : 'ASC' })}
                  className="sort-order-btn"
                  title={`Sort ${sort.order === 'ASC' ? 'Descending' : 'Ascending'}`}
                >
                  {sort.order === 'ASC' ? (
                    <span className="sort-icon">↗️ A-Z</span>
                  ) : (
                    <span className="sort-icon">↙️ Z-A</span>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="pagination-controls">
            <div className="control-group">
              <label className="control-label">
                <span className="icon">📄</span>
                Items per page
              </label>
              <select
                value={pagination.limit}
                onChange={e => handleLimitChange(Number(e.target.value))}
                className="limit-select"
              >
                <option value={5}>5 items</option>
                <option value={10}>10 items</option>
                <option value={20}>20 items</option>
                <option value={50}>50 items</option>
              </select>
            </div>
          </div>
        </div>

        {/* Enhanced Results Info */}
        <div className="results-info">
          <div className="results-text">
            <span className="icon">📊</span>
            Showing <strong>{contactsData.contacts.length}</strong> of{' '}
            <strong>{contactsData.total}</strong> contacts
            {hasActiveFilters && <span className="filtered-badge">Filtered</span>}
          </div>
          <div className="page-info">
            Page <strong>{contactsData.page}</strong> of <strong>{contactsData.totalPages}</strong>
          </div>
        </div>

        {/* Contacts Table */}
        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <span>Loading contacts...</span>
          </div>
        ) : contactsData.contacts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No contacts found</h3>
            <p>
              {hasActiveFilters
                ? 'Try adjusting your filters to see more results.'
                : "You haven't added any contacts yet."}
            </p>
            {hasActiveFilters && (
              <button onClick={clearAllFilters} className="btn-secondary">
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="table-container">
            <div className="table-wrapper">
              <table className="contacts-table">
                <thead>
                  <tr>
                    <th
                      className={`sortable ${sort.field === 'name' ? 'active' : ''}`}
                      onClick={() => handleSortChange('name')}
                    >
                      <span className="header-content">
                        <span className="header-icon">👤</span>
                        Name
                        {sort.field === 'name' && (
                          <span className="sort-indicator">{sort.order === 'ASC' ? '↑' : '↓'}</span>
                        )}
                      </span>
                    </th>
                    <th
                      className={`sortable ${sort.field === 'email' ? 'active' : ''}`}
                      onClick={() => handleSortChange('email')}
                    >
                      <span className="header-content">
                        <span className="header-icon">📧</span>
                        Email
                        {sort.field === 'email' && (
                          <span className="sort-indicator">{sort.order === 'ASC' ? '↑' : '↓'}</span>
                        )}
                      </span>
                    </th>
                    <th
                      className={`sortable ${sort.field === 'phone' ? 'active' : ''}`}
                      onClick={() => handleSortChange('phone')}
                    >
                      <span className="header-content">
                        <span className="header-icon">📱</span>
                        Phone
                        {sort.field === 'phone' && (
                          <span className="sort-indicator">{sort.order === 'ASC' ? '↑' : '↓'}</span>
                        )}
                      </span>
                    </th>
                    <th
                      className={`sortable ${sort.field === 'subject' ? 'active' : ''}`}
                      onClick={() => handleSortChange('subject')}
                    >
                      <span className="header-content">
                        <span className="header-icon">�</span>
                        Subject
                        {sort.field === 'subject' && (
                          <span className="sort-indicator">{sort.order === 'ASC' ? '↑' : '↓'}</span>
                        )}
                      </span>
                    </th>
                    <th className="message-header">
                      <span className="header-content">
                        <span className="header-icon">💬</span>
                        Message
                      </span>
                    </th>
                    <th
                      className={`sortable ${sort.field === 'consent' ? 'active' : ''}`}
                      onClick={() => handleSortChange('consent')}
                    >
                      <span className="header-content">
                        <span className="header-icon">✅</span>
                        Consent
                        {sort.field === 'consent' && (
                          <span className="sort-indicator">{sort.order === 'ASC' ? '↑' : '↓'}</span>
                        )}
                      </span>
                    </th>
                    <th className="actions-header">
                      <span className="header-content">
                        <span className="header-icon">⚙️</span>
                        Actions
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {contactsData.contacts.map((contact, index) => (
                    <tr key={contact.id} className={index % 2 === 0 ? 'even' : 'odd'}>
                      <td className="name-cell">
                        <div className="cell-content">
                          <strong>{contact.name}</strong>
                        </div>
                      </td>
                      <td className="email-cell">
                        <div className="cell-content">
                          <a href={`mailto:${contact.email}`} className="email-link">
                            {contact.email}
                          </a>
                        </div>
                      </td>
                      <td className="phone-cell">
                        <div className="cell-content">
                          {contact.phone ? (
                            <a href={`tel:${contact.phone}`} className="phone-link">
                              {contact.phone}
                            </a>
                          ) : (
                            <span className="no-data">N/A</span>
                          )}
                        </div>
                      </td>
                      <td className="subject-cell">
                        <div className="cell-content" title={contact.subject}>
                          {contact.subject}
                        </div>
                      </td>
                      <td className="message-cell">
                        <div className="cell-content message-content" title={contact.message}>
                          {contact.message}
                        </div>
                      </td>
                      <td className="consent-cell">
                        <div className="cell-content">
                          <span
                            className={`consent-badge ${contact.consent ? 'consented' : 'not-consented'}`}
                          >
                            {contact.consent ? (
                              <>
                                <span className="consent-icon">✓</span>
                                Yes
                              </>
                            ) : (
                              <>
                                <span className="consent-icon">✗</span>
                                No
                              </>
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="actions-cell">
                        <div className="action-buttons">
                          <button
                            onClick={() => navigate(`/contacts/${contact.id}`)}
                            className="btn btn-edit"
                            title="Edit contact"
                          >
                            <span className="btn-icon">✏️</span>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(contact.id)}
                            className="btn btn-delete"
                            title="Delete contact"
                          >
                            <span className="btn-icon">🗑️</span>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Enhanced Pagination */}
        {renderPagination()}
      </div>
    </div>
  );
};

export default ContactList;
