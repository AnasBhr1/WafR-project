import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import DashboardLayout from '../components/DashboardLayout';
import TransactionTable from '../components/TransactionTable';
import UserStatusToggle from '../components/UserStatusToggle';
import { User, Transaction, getUserById, getUserTransactions, blockUser, unblockUser } from '../services/userService';
import { downloadTransactionsPDF } from '../services/pdfService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { ArrowLeft, Download, CreditCard, CalendarDays, Clock, AtSign, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

const UserDetailPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      
      try {
        setLoadingUser(true);
        setError(null);
        
        const userData = await getUserById(userId);
        if (userData) {
          setUser(userData);
        } else {
          setError('User not found');
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Failed to load user data');
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUserData();
  }, [userId]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!userId) return;
      
      try {
        setLoadingTransactions(true);
        
        const transactionData = await getUserTransactions(userId);
        setTransactions(transactionData);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        // We don't set the main error state here to still show user info if available
      } finally {
        setLoadingTransactions(false);
      }
    };

    fetchTransactions();
  }, [userId]);

  const handleExportPDF = async () => {
    if (!user) return;
    
    try {
      setExportingPdf(true);
      // Add a small delay to show loading state for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      downloadTransactionsPDF(user, transactions);
      toast.success('Transaction report downloaded successfully');
    } catch (err) {
      console.error('Error generating PDF:', err);
      toast.error('Failed to generate transaction report');
    } finally {
      setExportingPdf(false);
    }
  };

  const handleStatusChange = async (updatedUser: User) => {
    try {
      // Call the appropriate API method based on the new status
      const result = updatedUser.isBlocked
        ? await blockUser(updatedUser.id)
        : await unblockUser(updatedUser.id);
      
      // Update the local state with the result
      setUser(result);
    } catch (err) {
      console.error('Error updating user status:', err);
      toast.error('Failed to update user status');
    }
  };

  if (loadingUser) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-500">Loading user information...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !user) {
    return (
      <DashboardLayout>
        <div className="bg-danger-50 border border-danger-200 rounded-lg p-6 text-center">
          <h2 className="text-lg font-medium text-danger-800">Error Loading User</h2>
          <p className="mt-2 text-danger-600">{error || 'User not found'}</p>
          <Link to="/dashboard">
            <Button variant="primary" className="mt-4" leftIcon={<ArrowLeft size={16} />}>
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back to dashboard link */}
        <Link to="/dashboard" className="inline-flex items-center text-primary-600 hover:text-primary-700">
          <ArrowLeft size={16} className="mr-1" />
          <span>Back to Dashboard</span>
        </Link>

        {/* User profile card */}
        <Card>
          <div className="flex flex-col md:flex-row justify-between gap-6">
            {/* User info */}
            <div>
              <div className="flex items-center mb-4 gap-3">
                <div className="h-14 w-14 rounded-full bg-primary-600 flex items-center justify-center text-white text-xl font-semibold">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                    <Badge variant={user.isBlocked ? 'danger' : 'success'} size="md">
                      {user.isBlocked ? 'Blocked' : 'Active'}
                    </Badge>
                  </div>
                  <p className="text-gray-500 flex items-center">
                    <AtSign size={14} className="mr-1" />
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mt-4">
                <div>
                  <p className="text-sm text-gray-500 flex items-center">
                    <Phone size={14} className="mr-1" />
                    Phone Number
                  </p>
                  <p className="text-base font-medium text-gray-900">{user.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 flex items-center">
                    <CreditCard size={14} className="mr-1" />
                    Balance
                  </p>
                  <p className="text-base font-medium text-gray-900">{user.balance.toFixed(2)} MAD</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 flex items-center">
                    <CalendarDays size={14} className="mr-1" />
                    Account Created
                  </p>
                  <p className="text-base font-medium text-gray-900">
                    {format(new Date(user.createdAt), 'PPP')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 flex items-center">
                    <Clock size={14} className="mr-1" />
                    Last Active
                  </p>
                  <p className="text-base font-medium text-gray-900">
                    {format(new Date(user.lastActive), 'PPP')}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <UserStatusToggle user={user} onStatusChange={handleStatusChange} />
              <Button
                variant="outline"
                leftIcon={<Download size={16} />}
                onClick={handleExportPDF}
                loading={exportingPdf}
                disabled={exportingPdf || loadingTransactions}
              >
                Export Transactions
              </Button>
            </div>
          </div>
        </Card>

        {/* Transactions card */}
        <Card
          title="Transaction History"
          description="Recent account transactions and payment history"
        >
          <TransactionTable
            transactions={transactions}
            loading={loadingTransactions}
          />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default UserDetailPage;