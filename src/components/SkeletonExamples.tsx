import React, { useState } from 'react';
import ContactFormSkeleton from './Skeleton/ContactFormSkeleton';
import ContactListSkeleton from './Skeleton/ContactListSkeleton';
import SkeletonDemo from './SkeletonDemo';

/**
 * Example component showing how to use skeleton loaders in practice
 * This component demonstrates the loading states for contact-related operations
 */
const SkeletonExamples: React.FC = () => {
  const [formLoading, setFormLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);

  const simulateFormLoad = () => {
    setFormLoading(true);
    setTimeout(() => setFormLoading(false), 2000);
  };

  const simulateListLoad = () => {
    setListLoading(true);
    setTimeout(() => setListLoading(false), 3000);
  };

  const containerStyle = {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: 'sans-serif',
  };

  const sectionStyle = {
    background: 'white',
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    marginBottom: '2rem',
  };

  const buttonStyle = {
    background: '#667eea',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    marginRight: '1rem',
    marginBottom: '1rem',
  };

  return (
    <div style={containerStyle}>
      <h1>Skeleton Loader Examples</h1>
      <p>Examples of skeleton loaders in action for contact management features.</p>

      {/* Contact Form Example */}
      <div style={sectionStyle}>
        <h2>Contact Form Loading Example</h2>
        <p>Click the button to simulate loading a contact form (2 seconds):</p>
        <button style={buttonStyle} onClick={simulateFormLoad} disabled={formLoading}>
          {formLoading ? 'Loading...' : 'Load Contact Form'}
        </button>

        {formLoading ? (
          <ContactFormSkeleton />
        ) : (
          <div
            style={{
              padding: '2rem',
              border: '2px dashed #e2e8f0',
              borderRadius: '8px',
              textAlign: 'center',
              color: '#718096',
            }}
          >
            Contact form would appear here when loaded
          </div>
        )}
      </div>

      {/* Contact List Example */}
      <div style={sectionStyle}>
        <h2>Contact List Loading Example</h2>
        <p>Click the button to simulate loading a contact list (3 seconds):</p>
        <button style={buttonStyle} onClick={simulateListLoad} disabled={listLoading}>
          {listLoading ? 'Loading...' : 'Load Contact List'}
        </button>

        <div
          style={{
            height: '600px',
            overflow: 'auto',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
          }}
        >
          {listLoading ? (
            <ContactListSkeleton rows={5} />
          ) : (
            <div
              style={{
                padding: '4rem 2rem',
                textAlign: 'center',
                color: '#718096',
                background: '#f7fafc',
              }}
            >
              Contact list table would appear here when loaded
            </div>
          )}
        </div>
      </div>

      {/* Integration Code Examples */}
      <div style={sectionStyle}>
        <h2>Code Examples</h2>
        <h3>Contact Form Integration</h3>
        <pre
          style={{
            background: '#f7fafc',
            padding: '1rem',
            borderRadius: '8px',
            overflow: 'auto',
            fontSize: '0.875rem',
            marginBottom: '1.5rem',
          }}
        >
          {`// In ContactUs.tsx
import ContactFormSkeleton from './Skeleton/ContactFormSkeleton';

const ContactForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  
  if (loading) {
    return <ContactFormSkeleton />;
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};`}
        </pre>

        <h3>Contact List Integration</h3>
        <pre
          style={{
            background: '#f7fafc',
            padding: '1rem',
            borderRadius: '8px',
            overflow: 'auto',
            fontSize: '0.875rem',
          }}
        >
          {`// In ContactList.tsx
import ContactListSkeleton from './Skeleton/ContactListSkeleton';

const ContactList: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  
  // Show full skeleton on initial load
  if (initialLoad && loading) {
    return <ContactListSkeleton rows={10} />;
  }
  
  return (
    <div className="contact-list-page">
      {/* Page content */}
      {loading && (
        <div className="loading">
          <div className="loading-spinner"></div>
          <span>Loading contacts...</span>
        </div>
      )}
    </div>
  );
};`}
        </pre>
      </div>

      {/* Full Demo Component */}
      <div style={sectionStyle}>
        <h2>Complete Skeleton Demo</h2>
        <p>Explore all available skeleton components and variations:</p>
        <SkeletonDemo />
      </div>
    </div>
  );
};

export default SkeletonExamples;
