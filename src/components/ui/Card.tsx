import React from 'react';
import clsx from 'clsx';

interface CardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  children,
  footer,
  className,
  headerAction,
}) => {
  return (
    <div className={clsx(
      'bg-white rounded-lg border border-gray-200 shadow-card overflow-hidden',
      className
    )}>
      {(title || description) && (
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
              {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
            </div>
            {headerAction && (
              <div>{headerAction}</div>
            )}
          </div>
        </div>
      )}
      <div className="px-6 py-5">{children}</div>
      {footer && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;