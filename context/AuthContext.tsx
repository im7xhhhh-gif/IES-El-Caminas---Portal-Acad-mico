import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { useData } from './DataContext';

interface AuthContextType {
  currentUser: User | null;
  login: (username: string, pass: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { users } = useData();

  const login = async (username: string, pass: string): Promise<boolean> => {
    // Simulate network delay for realism
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find user with matching credentials
    const userMatch = users.find(u => u.username === username && u.password === pass);
    
    if (userMatch) {
      // SECURITY: Destructure to separate password from the rest of the user data
      // We explicitly create a new object without the password field
      // to ensure it is not stored in the global auth state.
      const { password, ...safeUser } = userMatch;
      
      setCurrentUser(safeUser as User);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const isAuthenticated = !!currentUser;
  const isAdmin = currentUser?.role === UserRole.ADMIN;

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};