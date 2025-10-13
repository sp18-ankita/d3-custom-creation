import React from 'react';
import Skeleton from './index';

interface SkeletonTextProps {
  lines?: number;
  width?: string | number;
  className?: string;
}

/**
 * Skeleton component for text content with multiple lines
 */
export const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 3,
  width = '100%',
  className = '',
}) => {
  return (
    <div className={`skeleton-text-lines ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          height="1rem"
          width={index === lines - 1 ? '60%' : width}
          variant="text"
          style={{ marginBottom: index < lines - 1 ? '0.5rem' : 0 }}
        />
      ))}
    </div>
  );
};

interface SkeletonListItemProps {
  avatar?: boolean;
  lines?: number;
  actions?: boolean;
  className?: string;
}

/**
 * Skeleton component for list items with optional avatar and actions
 */
export const SkeletonListItem: React.FC<SkeletonListItemProps> = ({
  avatar = true,
  lines = 2,
  actions = false,
  className = '',
}) => {
  return (
    <div className={`skeleton-list-item ${className}`}>
      {avatar && (
        <Skeleton width="3rem" height="3rem" variant="circular" className="skeleton-avatar" />
      )}
      <div className="skeleton-content">
        <SkeletonText lines={lines} />
      </div>
      {actions && (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Skeleton width="4rem" height="2rem" borderRadius="4px" />
          <Skeleton width="4rem" height="2rem" borderRadius="4px" />
        </div>
      )}
    </div>
  );
};

interface SkeletonCardProps {
  hasImage?: boolean;
  hasActions?: boolean;
  lines?: number;
  className?: string;
}

/**
 * Skeleton component for card layouts
 */
export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  hasImage = true,
  hasActions = true,
  lines = 3,
  className = '',
}) => {
  return (
    <div
      className={`skeleton-card ${className}`}
      style={{
        padding: '1rem',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        background: 'white',
      }}
    >
      {hasImage && (
        <Skeleton
          height="200px"
          width="100%"
          variant="rectangular"
          style={{ marginBottom: '1rem' }}
        />
      )}
      <Skeleton height="1.5rem" width="80%" style={{ marginBottom: '0.5rem' }} />
      <SkeletonText lines={lines} />
      {hasActions && (
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            marginTop: '1rem',
            justifyContent: 'flex-end',
          }}
        >
          <Skeleton width="5rem" height="2rem" borderRadius="4px" />
          <Skeleton width="5rem" height="2rem" borderRadius="4px" />
        </div>
      )}
    </div>
  );
};

export default Skeleton;
