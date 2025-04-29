// Simulated user service with mock data

// Type definitions
export interface User {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  balance: number;
  isBlocked: boolean;
  lastActive: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'payment';
  amount: number;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  recipient?: string;
  sender?: string;
}

// Mock users data
const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Mohammed Alami',
    phoneNumber: '0612345678',
    email: 'mohammed.alami@gmail.com',
    balance: 2500.50,
    isBlocked: false,
    lastActive: '2023-06-15T10:30:00Z',
    createdAt: '2023-01-10T14:22:00Z',
  },
  {
    id: 'u2',
    name: 'Sara Bennani',
    phoneNumber: '0698765432',
    email: 'sara.bennani@outlook.com',
    balance: 750.25,
    isBlocked: true,
    lastActive: '2023-06-02T17:45:00Z',
    createdAt: '2023-02-05T09:15:00Z',
  },
  {
    id: 'u3',
    name: 'Youssef Kadiri',
    phoneNumber: '0661122334',
    email: 'youssef.k@gmail.com',
    balance: 5000.00,
    isBlocked: false,
    lastActive: '2023-06-14T20:10:00Z',
    createdAt: '2022-11-20T11:30:00Z',
  },
  {
    id: 'u4',
    name: 'Fatima Zahra',
    phoneNumber: '0655443322',
    email: 'fzahra@yahoo.com',
    balance: 120.75,
    isBlocked: false,
    lastActive: '2023-06-10T08:20:00Z',
    createdAt: '2023-03-15T16:45:00Z',
  },
  {
    id: 'u5',
    name: 'Karim Tazi',
    phoneNumber: '0677889900',
    email: 'karim.tazi@gmail.com',
    balance: 0.00,
    isBlocked: true,
    lastActive: '2023-05-30T14:50:00Z',
    createdAt: '2023-04-02T10:10:00Z',
  },
];

// Mock transactions data
const generateMockTransactions = (): Transaction[] => {
  const transactions: Transaction[] = [];
  
  // Generate 50 random transactions
  for (let i = 1; i <= 50; i++) {
    const userId = `u${Math.ceil(Math.random() * 5)}`;
    const type = ['deposit', 'withdrawal', 'transfer', 'payment'][Math.floor(Math.random() * 4)] as 'deposit' | 'withdrawal' | 'transfer' | 'payment';
    const amount = parseFloat((Math.random() * 2000).toFixed(2));
    const status = ['completed', 'pending', 'failed'][Math.floor(Math.random() * 3)] as 'completed' | 'pending' | 'failed';
    
    // Generate a date within the last 30 days
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    let description = '';
    let recipient = '';
    let sender = '';
    
    switch (type) {
      case 'deposit':
        description = 'Account deposit';
        break;
      case 'withdrawal':
        description = 'ATM withdrawal';
        break;
      case 'transfer':
        recipient = `u${Math.ceil(Math.random() * 5)}`;
        description = `Transfer to ${MOCK_USERS.find(u => u.id === recipient)?.name || 'Unknown'}`;
        break;
      case 'payment':
        const merchants = ['Carrefour', 'Marjane', 'BIM', 'Aswak Assalam', 'Jumia', 'Glovo'];
        const merchant = merchants[Math.floor(Math.random() * merchants.length)];
        description = `Payment to ${merchant}`;
        break;
    }
    
    transactions.push({
      id: `t${i}`,
      userId,
      type,
      amount,
      description,
      status,
      date: date.toISOString(),
      recipient: recipient || undefined,
      sender: sender || undefined,
    });
  }
  
  return transactions;
};

const MOCK_TRANSACTIONS = generateMockTransactions();

// API functions
export const searchUsersByPhone = async (phoneNumber: string): Promise<User[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (!phoneNumber) return [];
  
  return MOCK_USERS.filter(user => 
    user.phoneNumber.includes(phoneNumber)
  );
};

export const getUserById = async (userId: string): Promise<User | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const user = MOCK_USERS.find(user => user.id === userId);
  return user || null;
};

export const getUserTransactions = async (userId: string): Promise<Transaction[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return MOCK_TRANSACTIONS.filter(tx => tx.userId === userId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const blockUser = async (userId: string): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  const userIndex = MOCK_USERS.findIndex(user => user.id === userId);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }
  
  // Create a new user object with updated isBlocked status
  const updatedUser = {
    ...MOCK_USERS[userIndex],
    isBlocked: true
  };
  
  // Update the mock data
  MOCK_USERS[userIndex] = updatedUser;
  
  return updatedUser;
};

export const unblockUser = async (userId: string): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  const userIndex = MOCK_USERS.findIndex(user => user.id === userId);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }
  
  // Create a new user object with updated isBlocked status
  const updatedUser = {
    ...MOCK_USERS[userIndex],
    isBlocked: false
  };
  
  // Update the mock data
  MOCK_USERS[userIndex] = updatedUser;
  
  return updatedUser;
};