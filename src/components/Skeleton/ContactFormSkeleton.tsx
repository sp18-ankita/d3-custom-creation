import React from 'react';
import Skeleton from './index';

/**
 * Skeleton loader for the Contact Form component
 */
const ContactFormSkeleton: React.FC = () => {
  return (
    <div className="skeleton-form">
      {/* Form Title */}
      <div className="skeleton-form-group">
        <Skeleton height="2rem" width="200px" className="skeleton-form-title" />
      </div>

      {/* Full Name Field */}
      <div className="skeleton-form-group">
        <Skeleton height="1rem" width="80px" className="skeleton-form-label" />
        <Skeleton height="2.5rem" className="skeleton-form-input" />
      </div>

      {/* Email Field */}
      <div className="skeleton-form-group">
        <Skeleton height="1rem" width="60px" className="skeleton-form-label" />
        <Skeleton height="2.5rem" className="skeleton-form-input" />
      </div>

      {/* Phone Field */}
      <div className="skeleton-form-group">
        <Skeleton height="1rem" width="120px" className="skeleton-form-label" />
        <Skeleton height="2.5rem" className="skeleton-form-input" />
      </div>

      {/* Subject Field */}
      <div className="skeleton-form-group">
        <Skeleton height="1rem" width="70px" className="skeleton-form-label" />
        <Skeleton height="2.5rem" className="skeleton-form-input" />
      </div>

      {/* Message Field */}
      <div className="skeleton-form-group">
        <Skeleton height="1rem" width="80px" className="skeleton-form-label" />
        <Skeleton height="6rem" className="skeleton-form-textarea" />
      </div>

      {/* Consent Checkbox */}
      <div className="skeleton-form-group">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Skeleton width="1rem" height="1rem" variant="rectangular" />
          <Skeleton height="1rem" width="150px" />
        </div>
      </div>

      {/* Submit Button */}
      <div className="skeleton-form-group">
        <Skeleton height="3rem" width="150px" className="skeleton-form-button" />
      </div>
    </div>
  );
};

export default ContactFormSkeleton;
