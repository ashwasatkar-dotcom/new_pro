import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('hostelhub_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('hostelhub_token') || null);
  const [loading, setLoading] = useState(false);

  const extractErrorMessage = (err, defaultFallback) => {
    if (err.response?.data) {
      const data = err.response.data;
      if (typeof data === 'string' && data.length > 0) return data;
      if (data.message) {
        // If there is validation field map, append details
        if (data.data && typeof data.data === 'object' && Object.keys(data.data).length > 0) {
          const fieldErrors = Object.entries(data.data)
            .map(([field, msg]) => `${field}: ${msg}`)
            .join(', ');
          return `${data.message} (${fieldErrors})`;
        }
        return data.message;
      }
    }
    return err.message || defaultFallback;
  };

  const login = async (username, password, roleHint) => {
    setLoading(true);
    try {
      const res = await authService.login({ username, password, role: roleHint });
      if (res.success && res.data) {
        const authData = res.data;
        setToken(authData.token);
        setUser(authData);
        localStorage.setItem('hostelhub_token', authData.token);
        localStorage.setItem('hostelhub_user', JSON.stringify(authData));
        return { success: true, user: authData };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err) {
      const msg = extractErrorMessage(err, 'Authentication failed');
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await authService.register(userData);
      if (res.success && res.data) {
        const authData = res.data;
        if (authData.token) {
          setToken(authData.token);
          setUser(authData);
          localStorage.setItem('hostelhub_token', authData.token);
          localStorage.setItem('hostelhub_user', JSON.stringify(authData));
        }
        return { success: true, user: authData };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (err) {
      const msg = extractErrorMessage(err, 'Registration failed');
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('hostelhub_token');
    localStorage.removeItem('hostelhub_user');
  };

  const isWarden = () => user?.role === 'ROLE_WARDEN' || user?.role === 'ROLE_STAFF';
  const isStudent = () => user?.role === 'ROLE_STUDENT';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!token,
        isWarden,
        isStudent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
