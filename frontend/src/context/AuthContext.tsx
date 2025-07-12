import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type AuthContextType = {
  token: string | null;
  login: (payload: { email: string; password: string }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  login: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const baseUrl = import.meta.env.VITE_API_URL;

  const login = async ({ email, password }: { email: string; password: string }) => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      setToken(data.token);
      localStorage.setItem('token', data.token);
    } else {
      throw new Error(data.error || 'Login failed');
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);