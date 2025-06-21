// @refresh full

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (payload: RegisterPayload) => Promise<void>;
}

interface RegisterPayload {
  email: string;
  password: string;
  company_name: string;
  first_name: string;
  last_name: string;
  industry: string;
  employee_count: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    // Check if user is logged in (e.g., check localStorage or session)
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true);
      // You would typically fetch user data here
      // For now, just setting a placeholder
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ email: payload.sub });
      } catch (e) {
        console.error('Failed to decode token', e);
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('access_token');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ detail: 'Login failed with no error details.' }));
        throw new Error(errorData.detail || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('access_token', data.access_token);
      setIsAuthenticated(true);
      const payload = JSON.parse(atob(data.access_token.split('.')[1]));
      setUser({ email: payload.sub });
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setIsAuthenticated(false);
    setUser(null);
  };

  const register = async (payload: RegisterPayload) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      // Optionally, auto-login after registration
      await login(payload.email, payload.password);
    } catch (error) {
      throw new Error('Registration failed');
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, register }}>
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
