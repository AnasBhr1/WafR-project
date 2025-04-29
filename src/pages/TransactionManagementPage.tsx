import React, { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import DashboardLayout from '../components/DashboardLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Transaction } from '../services/userService';
import { ArrowUpRight, ArrowDownLeft, CreditCard, Send, BarChart3, Download, Filter, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

// Mock transactions data
const mockTransactions: Transaction[] = Array.from({ length: 50 }, (_, i) => ({
  id: `t${i + 1}`,
  userId: `u${Math.ceil(Math.random() * 5)}`,
  type: ['deposit', 'withdrawal', 'transfer', 'payment'][Math.floor(Math.random() * 4)] as 'deposit' | 'withdrawal' | 'transfer' | 'payment',
  amount: parseFloat((Math.random() * 2000).toFixed(2)),
  description: `Transaction ${i + 1}`,
  status: ['completed', 'pending', 'failed'][Math.floor(Math.random() * 3)] as 'completed' | 'pending' | 'failed',
  date: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
  isBlocked: Math.random() > 0.8,
}));

const TransactionManagementPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [loading, setLoading] = useState(false);
  const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(new Set());
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Calculate statistics
  const stats = useMemo(() => {
    const total = transactions.length;
    const blocked = transactions.filter(t => t.isBlocked).length;
    const completed = transactions.filter(t => t.status === 'completed').length;
    const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
    
    return {
      total,
      blocked,
      completed,
      totalAmount: totalAmount.toFixed(2),
      successRate: ((completed / total) * 100).toFixed(1)
    };
  }, [transactions]);

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(t => {
        if (filterStatus !== 'all' && t.status !== filterStatus) return false;
        if (filterType !== 'all' && t.type !== filterType) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date') {
          return sortOrder === 'desc'
            ? new Date(b.date).getTime() - new Date(a.date).getTime()
            : new Date(a.date).getTime() - new Date(b.date).getTime();
        } else {
          return sortOrder === 'desc'
            ? b.amount - a.amount
            : a.amount - b.amount;
        }
      });
  }, [transactions, filterStatus, filterType, sortBy, sortOrder]);

  const handleToggleBlock = async (transactionId: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setTransactions(prev => prev.map(t => {
        if (t.id === transactionId) {
          return { ...t, isBlocked: !t.isBlocked };
        }
        return t;
      }));
      
      toast.success('Transaction status updated successfully');
    } catch (error) {
      toast.error('Failed to update transaction status');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAction = async (action: 'block' | 'unblock') => {
    if (selectedTransactions.size === 0) {
      toast.error('Please select transactions first');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTransactions(prev => prev.map(t => {
        if (selectedTransactions.has(t.id)) {
          return { ...t, isBlocked: action === 'block' };
        }
        return t;
      }));
      
      setSelectedTransactions(new Set());
      toast.success(`Successfully ${action}ed ${selectedTransactions.size} transactions`);
    } catch (error) {
      toast.error(`Failed to ${action} transactions`);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Type', 'Amount', 'Status', 'Date', 'Blocked'];
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(t => [
        t.id,
        t.type,
        t.amount,
        t.status,
        format(new Date(t.date), 'yyyy-MM-dd HH:mm:ss'),
        t.isBlocked
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.success('Transaction report downloaded successfully');
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft size={18} className="text-success-500" />;
      case 'withdrawal':
        return <ArrowUpRight size={18} className="text-danger-500" />;
      case 'transfer':
        return <Send size={18} className="text-primary-500" />;
      case 'payment':
        return <CreditCard size={18} className="text-warning-500" />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900">Transaction Management</h1>
          <p className="mt-1 text-gray-500">
            Monitor and manage transaction statuses and analytics
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Transactions</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-primary-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Blocked Transactions</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.blocked}</p>
              </div>
              <div className="h-10 w-10 bg-danger-100 rounded-full flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-danger-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Success Rate</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.successRate}%</p>
              </div>
              <div className="h-10 w-10 bg-success-100 rounded-full flex items-center justify-center">
                <RefreshCw className="h-5 w-5 text-success-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Amount</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.totalAmount} MAD</p>
              </div>
              <div className="h-10 w-10 bg-warning-100 rounded-full flex items-center justify-center">
                <Send className="h-5 w-5 text-warning-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex flex-wrap gap-3">
              <select
                className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>

              <select
                className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="deposit">Deposit</option>
                <option value="withdrawal">Withdrawal</option>
                <option value="transfer">Transfer</option>
                <option value="payment">Payment</option>
              </select>

              <select
                className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field as 'date' | 'amount');
                  setSortOrder(order as 'asc' | 'desc');
                }}
              >
                <option value="date-desc">Latest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="amount-desc">Highest Amount</option>
                <option value="amount-asc">Lowest Amount</option>
              </select>
            </div>

            <div className="flex gap-3">
              <Button
                variant="danger"
                onClick={() => handleBulkAction('block')}
                disabled={loading || selectedTransactions.size === 0}
              >
                Block Selected
              </Button>
              <Button
                variant="success"
                onClick={() => handleBulkAction('unblock')}
                disabled={loading || selectedTransactions.size === 0}
              >
                Unblock Selected
              </Button>
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

        {/* Transactions Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      checked={selectedTransactions.size === filteredTransactions.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTransactions(new Set(filteredTransactions.map(t => t.id)));
                        } else {
                          setSelectedTransactions(new Set());
                        }
                      }}
                    />
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
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
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        checked={selectedTransactions.has(transaction.id)}
                        onChange={(e) => {
                          const newSelected = new Set(selectedTransactions);
                          if (e.target.checked) {
                            newSelected.add(transaction.id);
                          } else {
                            newSelected.delete(transaction.id);
                          }
                          setSelectedTransactions(newSelected);
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(transaction.date), 'PP')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getTransactionIcon(transaction.type)}
                        <span className="ml-2 text-sm text-gray-900 capitalize">
                          {transaction.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                      <span className={
                        transaction.type === 'deposit'
                          ? 'text-success-600'
                          : transaction.type === 'withdrawal' || transaction.type === 'payment'
                            ? 'text-danger-600'
                            : 'text-gray-900'
                      }>
                        {transaction.type === 'deposit' ? '+' : (transaction.type === 'withdrawal' || transaction.type === 'payment') ? '-' : ''}
                        {transaction.amount.toFixed(2)} MAD
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Badge
                        variant={
                          transaction.status === 'completed'
                            ? 'success'
                            : transaction.status === 'pending'
                              ? 'warning'
                              : 'danger'
                        }
                      >
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Button
                        variant={transaction.isBlocked ? 'success' : 'danger'}
                        size="sm"
                        onClick={() => handleToggleBlock(transaction.id)}
                        disabled={loading}
                      >
                        {transaction.isBlocked ? 'Unblock' : 'Block'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TransactionManagementPage;