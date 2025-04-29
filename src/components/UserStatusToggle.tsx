import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck } from 'lucide-react';
import Button from './ui/Button';
import { User } from '../services/userService';
import toast from 'react-hot-toast';

interface UserStatusToggleProps {
  user: User;
  onStatusChange: (updatedUser: User) => void;
}

const UserStatusToggle: React.FC<UserStatusToggleProps> = ({ user, onStatusChange }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleStatus = async () => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Create a copy of the user with the toggled status
      const updatedUser = {
        ...user,
        isBlocked: !user.isBlocked
      };
      
      // Notify the parent component about the status change
      onStatusChange(updatedUser);
      
      // Show a toast notification
      toast.success(
        user.isBlocked 
          ? `${user.name} has been unblocked` 
          : `${user.name} has been blocked`
      );
    } catch (error) {
      console.error('Failed to toggle user status:', error);
      toast.error('Failed to update user status. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={user.isBlocked ? 'success' : 'danger'}
      leftIcon={user.isBlocked ? <ShieldCheck size={18} /> : <ShieldAlert size={18} />}
      onClick={handleToggleStatus}
      loading={isLoading}
      disabled={isLoading}
    >
      {user.isBlocked ? 'Unblock User' : 'Block User'}
    </Button>
  );
};

export default UserStatusToggle;