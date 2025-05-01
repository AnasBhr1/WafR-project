import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import DashboardLayout from '../components/DashboardLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { User } from '../services/userService';
import { Search, Download, Filter, Users, ArrowUpDown, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

// Mock users data with extended information
const mockUsers: User[] = Array.from({ length: 20 }, (_, i) => ({
  id: `u${i + 1}`,
  name: ['Mohammed Alami', 'Sara Bennani', 'Youssef Kadiri', 'Fatima Zahra', 'Karim Tazi'][Math.floor(Math.random() * 5)],
  phoneNumber: `06${Math.floor(Math.random() * 90000000 + 10000000)}`,
  email: `user${i + 1}@example.com`,
  balance: parseFloat((Math.random() * 5000).toFixed(2)),
  isBlocked: Math.random() > 0.8,
  lastActive: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
  createdAt: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString(),
  transactionCount: Math.floor(Math.random() * 100),
  totalSpent: parseFloat((Math.random() * 10000).toFixed(2)),
}));

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof User>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterBlocked, setFilterBlocked] = useState<'all' | 'blocked' | 'active'>('all');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

  // Calculate statistics
  const stats = useMemo(() => {
    const total = users.length;
    const blocked = users.filter(u => u.isBlocked).length;
    const active = total - blocked;
    const totalBalance = users.reduce((sum, u) => sum + u.balance, 0);
    
    return {
      total,
      blocked,
      active,
      totalBalance: totalBalance.toFixed(2),
      averageBalance: (totalBalance / total).toFixed(2)
    };
  }, [users]);

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    return users
      .filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.phoneNumber.includes(searchTerm) ||
                            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesFilter = filterBlocked === 'all' ||
                            (filterBlocked === 'blocked' && user.isBlocked) ||
                            (filterBlocked === 'active' && !user.isBlocked);
        
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortOrder === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        if (aValue instanceof Date && bValue instanceof Date) {
          return sortOrder === 'asc'
            ? aValue.getTime() - bValue.getTime()
            : bValue.getTime() - aValue.getTime();
        }
        
        return 0;
      });
  }, [users, searchTerm, sortField, sortOrder, filterBlocked]);

  const handleToggleBlock = async (userId: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setUsers(prev => prev.map(user => {
        if (user.id === userId) {
          return { ...user, isBlocked: !user.isBlocked };
        }
        return user;
      }));
      
      toast.success('User status updated successfully');
    } catch (error) {
      toast.error('Failed to update user status');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAction = async (action: 'block' | 'unblock') => {
    if (selectedUsers.size === 0) {
      toast.error('Please select users first');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUsers(prev => prev.map(user => {
        if (selectedUsers.has(user.id)) {
          return { ...user, isBlocked: action === 'block' };
        }
        return user;
      }));
      
      setSelectedUsers(new Set());
      toast.success(`Successfully ${action}ed ${selectedUsers.size} users`);
    } catch (error) {
      toast.error(`Failed to ${action} users`);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Phone', 'Email', 'Balance', 'Status', 'Last Active', 'Created At', 'Transactions', 'Total Spent'];
    const csvContent = [
      headers.join(','),
      ...filteredUsers.map(user => [
        user.name,
        user.phoneNumber,
        user.email,
        user.balance,
        user.isBlocked ? 'Blocked' : 'Active',
        format(new Date(user.lastActive), 'yyyy-MM-dd HH:mm:ss'),
        format(new Date(user.createdAt), 'yyyy-MM-dd HH:mm:ss'),
        user.transactionCount,
        user.totalSpent
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.success('User report downloaded successfully');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
              <p className="mt-1 text-gray-500">
                Manage user accounts and monitor their activity
              </p>
            </div>
            <div className="hidden sm:block">
              <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-primary-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Users</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.active}</p>
              </div>
              <div className="h-10 w-10 bg-success-100 rounded-full flex items-center justify-center">
                <RefreshCw className="h-5 w-5 text-success-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Blocked Users</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.blocked}</p>
              </div>
              <div className="h-10 w-10 bg-danger-100 rounded-full flex items-center justify-center">
                <Filter className="h-5 w-5 text-danger-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Average Balance</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.averageBalance} MAD</p>
              </div>
              <div className="h-10 w-10 bg-warning-100 rounded-full flex items-center justify-center">
                <ArrowUpDown className="h-5 w-5 text-warning-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex-grow">
              <Input
                placeholder="Search by name, phone, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="h-5 w-5" />}
                fullWidth
              />
            </div>
            
            <div className="flex flex-wrap gap-3">
              <select
                className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                value={filterBlocked}
                onChange={(e) => setFilterBlocked(e.target.value as 'all' | 'blocked' | 'active')}
              >
                <option value="all">All Users</option>
                <option value="active">Active Only</option>
                <option value="blocked">Blocked Only</option>
              </select>

              <select
                className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                value={`${sortField}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortField(field as keyof User);
                  setSortOrder(order as 'asc' | 'desc');
                }}
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="balance-desc">Highest Balance</option>
                <option value="balance-asc">Lowest Balance</option>
                <option value="lastActive-desc">Recently Active</option>
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
              </select>

              <Button
                variant="outline"
                leftIcon={<Download size={16} />}
                onClick={handleExportCSV}
              >
                Export CSV
              </Button>
            </div>
          </div>
        </Card>

        {/* Users Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      checked={selectedUsers.size === filteredUsers.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers(new Set(filteredUsers.map(u => u.id)));
                        } else {
                          setSelectedUsers(new Set());
                        }
                      }}
                    />
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User Info
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balance
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        checked={selectedUsers.has(user.id)}
                        onChange={(e) => {
                          const newSelected = new Set(selectedUsers);
                          if (e.target.checked) {
                            newSelected.add(user.id);
                          } else {
                            newSelected.delete(user.id);
                          }
                          setSelectedUsers(newSelected);
                        }}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">
                          {user.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">
                            Joined {format(new Date(user.createdAt), 'PP')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{user.phoneNumber}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {user.balance.toFixed(2)} MAD
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Badge
                        variant={user.isBlocked ? 'danger' : 'success'}
                      >
                        {user.isBlocked ? 'Blocked' : 'Active'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Button
                        variant={user.isBlocked ? 'success' : 'danger'}
                        size="sm"
                        onClick={() => handleToggleBlock(user.id)}
                        disabled={loading}
                      >
                        {user.isBlocked ? 'Unblock' : 'Block'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bulk Actions */}
          {selectedUsers.size > 0 && (
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">
                  {selectedUsers.size} users selected
                </span>
                <div className="flex gap-3">
                  <Button
                    variant="danger"
                    onClick={() => handleBulkAction('block')}
                    disabled={loading}
                  >
                    Block Selected
                  </Button>
                  <Button
                    variant="success"
                    onClick={() => handleBulkAction('unblock')}
                    disabled={loading}
                  >
                    Unblock Selected
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default UserManagementPage;