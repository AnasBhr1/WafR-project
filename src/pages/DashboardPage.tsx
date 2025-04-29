import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import UserSearchForm from '../components/UserSearchForm';
import UsersList from '../components/UsersList';
import { User, searchUsersByPhone } from '../services/userService';
import { Users, Search, Info } from 'lucide-react';
import Card from '../components/ui/Card';

const DashboardPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = async (phoneNumber: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const results = await searchUsersByPhone(phoneNumber);
      setUsers(results);
      setSearchPerformed(true);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search for users. Please try again.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome section */}
        <section className="bg-white rounded-lg shadow-card p-6 border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Welcome to WafR Management Console</h2>
              <p className="mt-1 text-gray-500">
                Search and manage user accounts, view transaction history, and export reports.
              </p>
            </div>
            <div className="hidden sm:block">
              <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </div>
        </section>

        {/* Quick stats */}
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white rounded-lg shadow-card p-5 border border-gray-200">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">5,327</p>
              </div>
              <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-primary-600" />
              </div>
            </div>
            <p className="text-xs text-success-600 mt-2 flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 7a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L12 10.586V7z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
              </svg>
              +2.5% from last month
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-card p-5 border border-gray-200">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Users</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">4,895</p>
              </div>
              <div className="h-10 w-10 bg-success-100 rounded-full flex items-center justify-center">
                <svg className="h-5 w-5 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-success-600 mt-2 flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 7a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L12 10.586V7z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
              </svg>
              +1.2% from last month
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-card p-5 border border-gray-200">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Blocked Users</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">432</p>
              </div>
              <div className="h-10 w-10 bg-danger-100 rounded-full flex items-center justify-center">
                <svg className="h-5 w-5 text-danger-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-danger-600 mt-2 flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 7a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L12 10.586V7z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
              </svg>
              +0.8% from last month
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-card p-5 border border-gray-200">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Daily Transactions</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">12,547</p>
              </div>
              <div className="h-10 w-10 bg-warning-100 rounded-full flex items-center justify-center">
                <svg className="h-5 w-5 text-warning-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-success-600 mt-2 flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 7a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L12 10.586V7z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
              </svg>
              +4.3% from last month
            </p>
          </div>
        </section>

        {/* Search section */}
        <Card
          title="User Search"
          description="Search for users by phone number to view and manage their accounts."
          headerAction={
            <div className="flex items-center text-sm text-gray-500">
              <Info size={16} className="mr-1" />
              Demo numbers: 0612345678, 0698765432
            </div>
          }
        >
          <UserSearchForm onSearch={handleSearch} isLoading={loading} />
        </Card>

        {/* Results section */}
        <UsersList
          users={users}
          loading={loading}
          error={error}
          searchPerformed={searchPerformed}
        />
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;