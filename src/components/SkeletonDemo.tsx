import React, { useState } from 'react';
import Skeleton from './Skeleton';
import ContactFormSkeleton from './Skeleton/ContactFormSkeleton';
import ContactListSkeleton from './Skeleton/ContactListSkeleton';
import { SkeletonCard, SkeletonListItem, SkeletonText } from './Skeleton/SkeletonComponents';

/**
 * Demo component to showcase all skeleton loaders
 * This component can be used for testing and demonstration purposes
 */
const SkeletonDemo: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<string>('basic');

  const demoStyle = {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: 'sans-serif',
  };

  const navStyle = {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap' as const,
  };

  const buttonStyle = (isActive: boolean) => ({
    padding: '0.5rem 1rem',
    border: '2px solid #667eea',
    background: isActive ? '#667eea' : 'white',
    color: isActive ? 'white' : '#667eea',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'all 0.3s ease',
  });

  const sectionStyle = {
    background: 'white',
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    marginBottom: '2rem',
  };

  const renderBasicSkeletons = () => (
    <div style={sectionStyle}>
      <h2>Basic Skeleton Components</h2>

      <h3>Text Variants</h3>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <h4>Single Line Text</h4>
          <Skeleton height="1rem" width="300px" />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <h4>Multiple Lines</h4>
          <SkeletonText lines={3} />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <h4>Different Widths</h4>
          <Skeleton height="1rem" width="100%" style={{ marginBottom: '0.5rem' }} />
          <Skeleton height="1rem" width="80%" style={{ marginBottom: '0.5rem' }} />
          <Skeleton height="1rem" width="60%" />
        </div>
      </div>

      <h3>Shape Variants</h3>
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', alignItems: 'center' }}>
        <div>
          <h4>Circular</h4>
          <Skeleton width="60px" height="60px" variant="circular" />
        </div>

        <div>
          <h4>Rectangular</h4>
          <Skeleton width="120px" height="60px" variant="rectangular" />
        </div>

        <div>
          <h4>Text (default)</h4>
          <Skeleton width="120px" height="20px" variant="text" />
        </div>
      </div>

      <h3>Animation Variants</h3>
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
        <div>
          <h4>Pulse (default)</h4>
          <Skeleton width="200px" height="40px" animation="pulse" />
        </div>

        <div>
          <h4>Wave</h4>
          <Skeleton width="200px" height="40px" animation="wave" />
        </div>

        <div>
          <h4>None</h4>
          <Skeleton width="200px" height="40px" animation="none" />
        </div>
      </div>
    </div>
  );

  const renderComponentSkeletons = () => (
    <div style={sectionStyle}>
      <h2>Component Skeletons</h2>

      <h3>List Item</h3>
      <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '2rem' }}>
        <SkeletonListItem />
        <SkeletonListItem avatar={false} />
        <SkeletonListItem actions={true} />
      </div>

      <h3>Card</h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <SkeletonCard />
        <SkeletonCard hasImage={false} />
        <SkeletonCard hasActions={false} />
      </div>
    </div>
  );

  const renderContactFormSkeleton = () => (
    <div style={sectionStyle}>
      <h2>Contact Form Skeleton</h2>
      <p>This skeleton matches the structure of the ContactUs form component:</p>
      <ContactFormSkeleton />
    </div>
  );

  const renderContactListSkeleton = () => (
    <div style={sectionStyle}>
      <h2>Contact List Skeleton</h2>
      <p>This skeleton matches the structure of the ContactList component:</p>
      <div
        style={{
          height: '600px',
          overflow: 'auto',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
        }}
      >
        <ContactListSkeleton rows={3} />
      </div>
    </div>
  );

  return (
    <div style={demoStyle}>
      <h1>Skeleton Loader Components Demo</h1>
      <p>Interactive demonstration of all available skeleton loader components</p>

      <nav style={navStyle}>
        <button style={buttonStyle(activeDemo === 'basic')} onClick={() => setActiveDemo('basic')}>
          Basic Skeletons
        </button>
        <button
          style={buttonStyle(activeDemo === 'components')}
          onClick={() => setActiveDemo('components')}
        >
          Component Skeletons
        </button>
        <button
          style={buttonStyle(activeDemo === 'contactForm')}
          onClick={() => setActiveDemo('contactForm')}
        >
          Contact Form
        </button>
        <button
          style={buttonStyle(activeDemo === 'contactList')}
          onClick={() => setActiveDemo('contactList')}
        >
          Contact List
        </button>
      </nav>

      {activeDemo === 'basic' && renderBasicSkeletons()}
      {activeDemo === 'components' && renderComponentSkeletons()}
      {activeDemo === 'contactForm' && renderContactFormSkeleton()}
      {activeDemo === 'contactList' && renderContactListSkeleton()}

      <div style={sectionStyle}>
        <h2>Usage Examples</h2>
        <pre
          style={{
            background: '#f7fafc',
            padding: '1rem',
            borderRadius: '8px',
            overflow: 'auto',
            fontSize: '0.875rem',
          }}
        >
          {`// Basic Skeleton
<Skeleton width="200px" height="20px" variant="text" />

// Contact Form Skeleton
{loading && <ContactFormSkeleton />}

// Contact List Skeleton  
{loading && <ContactListSkeleton rows={5} />}

// Custom Component Skeleton
<SkeletonListItem avatar={true} actions={true} lines={2} />

// Multiple Text Lines
<SkeletonText lines={3} width="80%" />`}
        </pre>
      </div>
    </div>
  );
};

export default SkeletonDemo;
