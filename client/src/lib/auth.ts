export type UserRole = 'admin' | 'demarcheur';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

// Mock users
export const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'admin@locagram.bj',
    name: 'Administrateur',
    role: 'admin'
  },
  {
    id: '2',
    email: 'demarcheur@locagram.bj',
    name: 'Démarcheur Test',
    role: 'demarcheur'
  }
];

// Simulation d'authentification
export const authenticateUser = (email: string, password: string): User | null => {
  // Simulation d'une vérification des identifiants
  if (email === 'admin@locagram.bj' && password === 'Admin@2024') {
    return {
      id: '1',
      email: 'admin@locagram.bj',
      name: 'Administrateur',
      role: 'admin'
    };
  }
  if (email === 'demarcheur@locagram.bj' && password === 'Demarcheur@2024') {
    return {
      id: '2',
      email: 'demarcheur@locagram.bj',
      name: 'Démarcheur Test',
      role: 'demarcheur'
    };
  }
  return null;
}; 