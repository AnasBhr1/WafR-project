import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Home } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="text-center">
        <p className="text-6xl font-bold text-primary-600">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">Page not found</h1>
        <p className="mt-2 text-base text-gray-500">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link to="/dashboard">
            <Button variant="primary" leftIcon={<Home size={18} />}>
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;