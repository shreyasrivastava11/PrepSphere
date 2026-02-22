import React, { createContext, useContext, useMemo, useState } from 'react';
import { apiRequest, setAuthToken } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async ({ email, password }) => {
    try {
      const credentials = {
        email: email.trim().toLowerCase(),
        password: password.trim(),
      };
      const data = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      const sessionUser = { id: data.userId, name: data.name, email: data.email };
      setAuthToken(data.token);
      setUser(sessionUser);
      return { ok: true };
    } catch (error) {
      if (error.message === 'Invalid email or password') {
        return {
          ok: false,
          message: 'Invalid email or password. Please check your credentials or create a new account from Register.',
        };
      }
      return { ok: false, message: error.message };
    }
  };

  const register = async ({ name, email, password }) => {
    try {
      const body = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim(),
      };

      const data = await apiRequest('/api/auth/register-user', {
        method: 'POST',
        body: JSON.stringify(body),
      });

      const sessionUser = { id: data.userId, name: data.name, email: data.email };
      setAuthToken(data.token);
      setUser(sessionUser);
      return { ok: true };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const profile = await apiRequest('/api/users/me');
      setUser({ id: profile.id, name: profile.name, email: profile.email });
      return true;
    } catch (error) {
      return false;
    }
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      refreshUser,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
