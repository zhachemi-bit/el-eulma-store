import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User, UserRole, LoginCredentials, SignUpData, AuthContextType } from '@/types/auth';
import { api } from '@/lib/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem('eleulma_token');
      if (token) {
        try {
          const userData = await api.getMe();
          setUser(userData);
          setIsAuthenticated(true);
          localStorage.setItem('eleulma_user', JSON.stringify(userData));
        } catch (error) {
          console.error('Auth verification failed:', error);
          localStorage.removeItem('eleulma_token');
          localStorage.removeItem('eleulma_user');
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    }
    checkAuth();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true);
    try {
      const { user: newUser, token } = await api.login(credentials);
      localStorage.setItem('eleulma_token', token);
      localStorage.setItem('eleulma_user', JSON.stringify(newUser));
      setUser(newUser);
      setIsAuthenticated(true);
    } catch (error: any) {
      console.error('Login error:', error);
      throw error.response?.data?.error || error.message || 'Login failed';
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (data: SignUpData): Promise<void> => {
    setIsLoading(true);
    try {
      const { user: newUser, token } = await api.signup(data);
      
      // If vendor, don't log in automatically (pending approval)
      if (data.role === 'vendor') {
        return;
      }

      localStorage.setItem('eleulma_token', token);
      localStorage.setItem('eleulma_user', JSON.stringify(newUser));
      setUser(newUser);
      setIsAuthenticated(true);
    } catch (error: any) {
      console.error('Signup error:', error);
      throw error.response?.data?.error || error.message || 'Failed to create account';
    } finally {
      setIsLoading(false);
    }
  }, []);

  const adminLogin = useCallback(async (password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const { user: adminUser, token } = await api.login({
        email: 'admin@eleulmastore.dz',
        password,
        role: 'admin'
      });
      localStorage.setItem('eleulma_token', token);
      localStorage.setItem('eleulma_user', JSON.stringify(adminUser));
      setUser(adminUser);
      setIsAuthenticated(true);
    } catch (error: any) {
      console.error('Admin login error:', error);
      throw error.response?.data?.error || error.message || 'Admin login failed';
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('eleulma_user');
    localStorage.removeItem('eleulma_token');
    // Dispatch logout event so cart and other contexts can clear themselves
    window.dispatchEvent(new CustomEvent('user-logout'));
  }, []);

  const hasRole = useCallback((role: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role as UserRole);
    }
    return user.role === role;
  }, [user]);

  const updateUser = useCallback((newUser: User) => {
    setUser(newUser);
    localStorage.setItem('eleulma_user', JSON.stringify(newUser));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        signup,
        adminLogin,
        logout,
        hasRole,
        updateUser,
      }}
    >
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
