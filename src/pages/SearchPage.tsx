import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { User, searchUsersByPhone } from '../services/userService';
import { Search, Users } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const SearchPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber.trim()) {
      setError('Please enter a phone number');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const results = await searchUsersByPhone(phoneNumber);
      setUsers(results);
      setSearchPerformed(true);
    } catch (err) {
      setError('Failed to search for users. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">User Search</h1>
              <p className="mt-1 text-gray-500">
                Search for users by their phone number to view their details
              </p>
            </div>
            <div className="hidden sm:block">
              <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search Form */}
        <Card>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-grow">
                <Input
                  label="Phone Number"
                  placeholder="Enter phone number (e.g., 0612345678)"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  leftIcon={<Search className="h-5 w-5" />}
                  error={error}
                  fullWidth
                />
              </div>
              <div className="flex items-end">
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  className="w-full sm:w-auto"
                >
                  Search Users
                </Button>
              </div>
            </div>
          </form>
        </Card>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : searchPerformed ? (
          <div className="space-y-4">
            {users.length > 0 ? (
              users.map((user) => (
                <Card key={user.id} className="hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {user.name}
                      </h3>
                      <p className="text-gray-500">{user.phoneNumber}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <div>
                      <Button
                        variant="outline"
                        onClick={() => {/* Handle view details */}}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card>
                <div className="text-center py-6">
                  <p className="text-gray-500">No users found for this phone number</p>
                </div>
              </Card>
            )}
          </div>
        ) : null}
      </div>
    </DashboardLayout>
  );
};

export default SearchPage;