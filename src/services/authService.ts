// This is a mock authentication service that simulates Firebase authentication

// Mock user data
const MOCK_USERS = [
  {
    id: 'agent123',
    email: 'agent@wafr.com',
    password: 'password123', // In a real app, passwords would be hashed
    name: 'Support Agent',
    role: 'agent',
  },
  {
    id: 'admin456',
    email: 'admin@wafr.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
  },
];

interface UserCredentials {
  email: string;
  password: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Simulate storing auth state in localStorage
const AUTH_STORAGE_KEY = 'wafr_auth_user';

export const loginUser = async (
  email: string,
  password: string
): Promise<UserData> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // Normalize email for comparison
  const normalizedEmail = email.toLowerCase().trim();
  
  const user = MOCK_USERS.find(
    u => u.email.toLowerCase() === normalizedEmail && u.password === password
  );

  if (!user) {
    console.log('Login attempt failed:', { 
      providedEmail: normalizedEmail,
      availableEmails: MOCK_USERS.map(u => u.email.toLowerCase())
    });
    throw new Error('Invalid email or password');
  }

  // Create user data without sensitive information
  const userData: UserData = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  // Store in localStorage to persist login state
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));

  return userData;
};

export const logoutUser = async (): Promise<void> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Clear stored auth state
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const getCurrentUser = async (): Promise<UserData | null> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
  
  if (!storedUser) {
    return null;
  }
  
  return JSON.parse(storedUser) as UserData;
};