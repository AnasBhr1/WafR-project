import React from 'react';
import { format } from 'date-fns';
import { Transaction } from '../services/userService';
import Badge from './ui/Badge';
import { ArrowUpRight, ArrowDownLeft, CreditCard, Send } from 'lucide-react';

interface TransactionTableProps {
  transactions: Transaction[];
  loading: boolean;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <div className="animate-pulse space-y-4 w-full">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="h-16 bg-gray-200 rounded w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-10">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions</h3>
        <p className="mt-1 text-sm text-gray-500">This user doesn't have any transaction history yet.</p>
      </div>
    );
  }

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'failed':
        return <Badge variant="danger">Failed</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
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
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-gray-50">
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
                <span className={transaction.type === 'deposit' ? 'text-success-600' : transaction.type === 'withdrawal' || transaction.type === 'payment' ? 'text-danger-600' : 'text-gray-900'}>
                  {transaction.type === 'deposit' ? '+' : (transaction.type === 'withdrawal' || transaction.type === 'payment') ? '-' : ''}
                  {transaction.amount.toFixed(2)} MAD
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                {getStatusBadge(transaction.status)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;