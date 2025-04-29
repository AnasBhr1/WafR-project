import React from 'react';
import clsx from 'clsx';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className 
}) => {
  const spinnerSize = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-10 h-10 border-3',
  };

  return (
    <div className={clsx('relative', className)}>
      <div 
        className={clsx(
          'rounded-full animate-spin border-solid border-primary-600 border-t-transparent',
          spinnerSize[size]
        )} 
      />
    </div>
  );
};

export default LoadingSpinner;