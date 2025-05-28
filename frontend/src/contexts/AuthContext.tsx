// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin, User } from '@/api/auth';
import { fetchCurrentUser } from '@/api/users';

interface TokenPayload {
  exp: number; 
  sub: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      fetchCurrentUser()
        .then(setUser)
        .catch(() => {
          setToken(null);
          setUser(null);
        });
    } else {
      localStorage.removeItem('token');
      setUser(null);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    let payload: TokenPayload;
    try {
      payload = jwtDecode<TokenPayload>(token);
    } catch {
      setToken(null);
      return;
    }
    const expiresAt = payload.exp * 1000; // ms
    const now = Date.now();
    const msLeft = expiresAt - now;

    if (msLeft <= 0) {
      setToken(null);
      return;
    }

    const timer = setTimeout(() => {
      setToken(null);
      navigate('/login', { replace: true });
    }, msLeft);

    return () => clearTimeout(timer);
  }, [token, navigate]);

  const login = async (email: string, password: string) => {
    const resp = await apiLogin({ email, password });
    setToken(resp.access_token);
  };

  const logout = () => {
    setToken(null);
    navigate('/login', { replace: true });
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
