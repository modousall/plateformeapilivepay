'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

export type UserRole = 'admin' | 'merchant' | 'user';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isMerchant: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Super Admin credentials
const SUPER_ADMIN_EMAIL = 'modousall1@gmail.com';
const SUPER_ADMIN_PASSWORD = 'Passer123@';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('livepay_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser({
          ...parsed,
          createdAt: new Date(parsed.createdAt),
        });
        document.cookie = `livepay_user=${storedUser}; path=/; max-age=${60 * 60 * 24 * 7}`;
      } catch {
        localStorage.removeItem('livepay_user');
        document.cookie = 'livepay_user=; path=/; max-age=0';
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check Super Admin credentials
    if (email === SUPER_ADMIN_EMAIL && password === SUPER_ADMIN_PASSWORD) {
      const adminUser: User = {
        id: 'admin_1',
        email: email,
        name: 'Mr Modou SALL',
        role: 'admin',
        createdAt: new Date(),
      };
      setUser(adminUser);
      const userData = JSON.stringify(adminUser);
      localStorage.setItem('livepay_user', userData);
      document.cookie = `livepay_user=${userData}; path=/; max-age=${60 * 60 * 24 * 7}`;
      router.push('/dashboard');
    } else if (email && password) {
      // Create a regular merchant user
      const merchantUser: User = {
        id: `user_${Date.now()}`,
        email: email,
        name: email.split('@')[0],
        role: 'merchant',
        createdAt: new Date(),
      };
      setUser(merchantUser);
      const userData = JSON.stringify(merchantUser);
      localStorage.setItem('livepay_user', userData);
      document.cookie = `livepay_user=${userData}; path=/; max-age=${60 * 60 * 24 * 7}`;
      router.push('/dashboard');
    } else {
      throw new Error('Identifiants invalides');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if trying to register as admin
    if (email === SUPER_ADMIN_EMAIL) {
      throw new Error('Cet email est réservé à l\'administrateur');
    }
    
    // Create a regular merchant user
    const newUser: User = {
      id: `user_${Date.now()}`,
      email: email,
      name: name,
      role: 'merchant', // Default role for new users
      createdAt: new Date(),
    };
    
    setUser(newUser);
    const userData = JSON.stringify(newUser);
    localStorage.setItem('livepay_user', userData);
    document.cookie = `livepay_user=${userData}; path=/; max-age=${60 * 60 * 24 * 7}`;
    router.push('/dashboard');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('livepay_user');
    document.cookie = 'livepay_user=; path=/; max-age=0';
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      register,
      logout,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      isMerchant: user?.role === 'merchant' || user?.role === 'admin',
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
