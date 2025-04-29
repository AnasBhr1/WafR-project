import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import Input from './ui/Input';
import Button from './ui/Button';

interface UserSearchFormProps {
  onSearch: (phoneNumber: string) => void;
  isLoading: boolean;
}

const UserSearchForm: React.FC<UserSearchFormProps> = ({ onSearch, isLoading }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!phoneNumber.trim()) {
      setError('Please enter a phone number');
      return;
    }
    
    // Clear any previous errors
    setError(null);
    
    // Call the onSearch callback with the phone number
    onSearch(phoneNumber.trim());
  };

  const handleClear = () => {
    setPhoneNumber('');
    setError(null);
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex-grow">
          <Input
            label="Search User by Phone Number"
            placeholder="Enter phone number (e.g., 0612345678)"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            error={error || undefined}
            leftIcon={<Search size={18} />}
            rightIcon={phoneNumber ? <X size={18} className="cursor-pointer" onClick={handleClear} /> : undefined}
            fullWidth
            aria-label="Phone number search"
          />
        </div>
        <div className="flex space-x-3">
          <Button
            type="submit"
            variant="primary"
            loading={isLoading}
            disabled={isLoading}
            className="md:whitespace-nowrap"
          >
            Search User
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleClear}
            className="md:whitespace-nowrap"
          >
            Clear
          </Button>
        </div>
      </div>
    </form>
  );
};

export default UserSearchForm;