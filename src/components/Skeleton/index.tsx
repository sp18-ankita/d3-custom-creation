import type { ReactNode } from 'react';
import React from 'react';
import './Skeleton.css';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  children?: ReactNode;
  variant?: 'text' | 'rectangular' | 'circular';
  animation?: 'pulse' | 'wave' | 'none';
  style?: React.CSSProperties;
}

/**
 * Base Skeleton component for creating loading placeholders
 */
const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  borderRadius,
  className = '',
  children,
  variant = 'text',
  animation = 'pulse',
  style: customStyle = {},
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'circular':
        return {
          borderRadius: '50%',
          width: height,
        };
      case 'rectangular':
        return {
          borderRadius: borderRadius || '4px',
        };
      case 'text':
      default:
        return {
          borderRadius: borderRadius || '4px',
        };
    }
  };

  const style = {
    width,
    height,
    ...getVariantStyles(),
    ...customStyle,
  };

  const skeletonClasses = ['skeleton', `skeleton--${variant}`, `skeleton--${animation}`, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={skeletonClasses} style={style} role="status" aria-label="Loading...">
      {children}
    </div>
  );
};

export default Skeleton;
