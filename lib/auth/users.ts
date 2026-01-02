/**
 * IVYAR User Management
 * In production: Replace with PostgreSQL queries
 */

import { UserRole, UserCategory } from './jwt';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  category: UserCategory;
  createdAt: Date;
}

// Mock users database (replace with PostgreSQL in production)
// Passwords: admin123, employer123, attorney123, client123
const mockUsers: User[] = [
  {
    id: 'usr-admin-001',
    email: 'admin@ivyar.org',
    passwordHash: '$2b$10$rQZ8K3Z8K3Z8K3Z8K3Z8K.admin123hash', // admin123
    role: 'admin',
    category: 'Institutional',
    createdAt: new Date('2025-01-01'),
  },
  {
    id: 'usr-employer-001',
    email: 'employer@ivyar.org',
    passwordHash: '$2b$10$rQZ8K3Z8K3Z8K3Z8K3Z8K.employer123hash', // employer123
    role: 'employer',
    category: 'Employer',
    createdAt: new Date('2025-01-01'),
  },
  {
    id: 'usr-attorney-001',
    email: 'attorney@ivyar.org',
    passwordHash: '$2b$10$rQZ8K3Z8K3Z8K3Z8K3Z8K.attorney123hash', // attorney123
    role: 'attorney',
    category: 'Legal',
    createdAt: new Date('2025-01-01'),
  },
  {
    id: 'usr-client-001',
    email: 'client@ivyar.org',
    passwordHash: '$2b$10$rQZ8K3Z8K3Z8K3Z8K3Z8K.client123hash', // client123
    role: 'client',
    category: 'Worker',
    createdAt: new Date('2025-01-01'),
  },
];

/**
 * Find user by email
 */
export function findUserByEmail(email: string): User | null {
  return mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

/**
 * Find user by ID
 */
export function findUserById(id: string): User | null {
  return mockUsers.find((u) => u.id === id) || null;
}

/**
 * Verify password (simplified for demo - use bcrypt in production)
 */
export function verifyPassword(inputPassword: string, user: User): boolean {
  // Demo passwords - in production use bcrypt.compare()
  const demoPasswords: Record<string, string> = {
    'admin@ivyar.org': 'admin123',
    'employer@ivyar.org': 'employer123',
    'attorney@ivyar.org': 'attorney123',
    'client@ivyar.org': 'client123',
  };
  return demoPasswords[user.email] === inputPassword;
}

/**
 * Get all users (admin only)
 */
export function getAllUsers(): Omit<User, 'passwordHash'>[] {
  return mockUsers.map(({ passwordHash, ...user }) => user);
}

/**
 * Create new user
 */
export function createUser(data: {
  email: string;
  password: string;
  role: UserRole;
  category: UserCategory;
}): User {
  const newUser: User = {
    id: `usr-${Date.now()}`,
    email: data.email,
    passwordHash: `$2b$10$hash_${data.password}`, // In production: use bcrypt.hash()
    role: data.role,
    category: data.category,
    createdAt: new Date(),
  };
  mockUsers.push(newUser);
  return newUser;
}

export default {
  findByEmail: findUserByEmail,
  findById: findUserById,
  verifyPassword,
  getAll: getAllUsers,
  create: createUser,
};