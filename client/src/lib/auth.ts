export type UserRole = 'admin' | 'demarcheur';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  status: 'active' | 'pending' | 'blocked';
}

// Mock users
export const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'admin@locagram.bj',
    role: 'admin',
    name: 'Administrateur',
    status: 'active'
  },
  {
    id: '2',
    email: 'demarcheur@locagram.bj',
    role: 'demarcheur',
    name: 'Démarcheur Test',
    status: 'active'
  }
];

// Mock authentication
export const authenticateUser = (email: string, password: string): User | null => {
  // Simuler une vérification des identifiants
  if (email === 'admin@locagram.bj' && password === 'Admin@2024') {
    return MOCK_USERS[0];
  }
  if (email === 'demarcheur@locagram.bj' && password === 'Demo@2024') {
    return MOCK_USERS[1];
  }
  return null;
}; 