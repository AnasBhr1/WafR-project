import React from 'react';
import { User } from '../services/userService';
import UserCard from './UserCard';
import LoadingSpinner from './ui/LoadingSpinner';

interface UsersListProps {
  users: User[];
  loading: boolean;
  error: string | null;
  searchPerformed: boolean;
}

const UsersList: React.FC<UsersListProps> = ({
  users,
  loading,
  error,
  searchPerformed
}) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-500">Searching for users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-danger-50 p-4 mt-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-danger-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-danger-800">Error</h3>
            <div className="mt-2 text-sm text-danger-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (users.length === 0 && searchPerformed) {
    return (
      <div className="rounded-lg bg-gray-50 p-8 mt-6 text-center">
        <div className="mx-auto">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.5 15.5l5 5M19 10.5a8.5 8.5 0 11-17 0 8.5 8.5 0 0117 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No users found</h3>
          <p className="mt-1 text-gray-500">
            We couldn't find any users with the provided phone number. Please try a different search.
          </p>
        </div>
      </div>
    );
  }

  if (users.length === 0 && !searchPerformed) {
    return (
      <div className="rounded-lg bg-gray-50 p-8 mt-6 text-center">
        <div className="mx-auto">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.5 15.5l5 5M19 10.5a8.5 8.5 0 11-17 0 8.5 8.5 0 0117 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Search for users</h3>
          <p className="mt-1 text-gray-500">
            Use the search bar above to find users by their phone number.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4 animate-fade-in">
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
};

export default UsersList;