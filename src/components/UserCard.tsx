import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { User } from '../services/userService';
import Card from './ui/Card';
import Button from './ui/Button';
import Badge from './ui/Badge';
import { CalendarDays, CreditCard, Clock, ExternalLink } from 'lucide-react';

interface UserCardProps {
  user: User;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
            <Badge variant={user.isBlocked ? 'danger' : 'success'}>
              {user.isBlocked ? 'Blocked' : 'Active'}
            </Badge>
          </div>
          
          <p className="text-gray-500 mt-1">{user.phoneNumber}</p>
          <p className="text-gray-500 text-sm">{user.email}</p>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-3">
            <div className="flex items-center">
              <CreditCard size={16} className="text-gray-400 mr-1" />
              <span className="text-sm font-medium">{user.balance.toFixed(2)} MAD</span>
            </div>
            <div className="flex items-center">
              <CalendarDays size={16} className="text-gray-400 mr-1" />
              <span className="text-sm text-gray-500">
                Joined: {format(new Date(user.createdAt), 'PP')}
              </span>
            </div>
            <div className="flex items-center">
              <Clock size={16} className="text-gray-400 mr-1" />
              <span className="text-sm text-gray-500">
                Last active: {format(new Date(user.lastActive), 'PP')}
              </span>
            </div>
          </div>
        </div>
        
        <Link to={`/users/${user.id}`}>
          <Button
            variant="primary"
            rightIcon={<ExternalLink size={16} />}
          >
            View Details
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default UserCard;