
import React from 'react';
import { cn } from '../../lib/utils';

const LoadingSpinner = ({ className, size = 'md' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={cn('flex justify-center items-center', className)}>
      <div
        className={cn(
          'border-4 border-t-tripmates-blue border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin',
          sizes[size]
        )}
      />
    </div>
  );
};

export default LoadingSpinner;
