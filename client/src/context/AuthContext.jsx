import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('orchardsathi_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('orchardsathi_token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verify and hydrate current user on initial load
  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('orchardsathi_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('[Auth] Token validation failed:', err.message);
          // If token is invalid, clear local auth
          if (err.response && err.response.status === 401) {
            logout();
          }
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    setError(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem('orchardsathi_token', res.data.token);
        localStorage.setItem('orchardsathi_user', JSON.stringify(res.data.user));
        return { success: true, user: res.data.user };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      const msg = err.response?.data?.message || (err.message === 'Network Error' ? 'Cannot reach OrchardSathi AI backend at http://localhost:5000. Is the server running?' : 'Login failed');
      setError(msg);
      return { success: false, message: msg };
    }
  };

  // Register handler
  const register = async (userData) => {
    setError(null);
    try {
      const res = await api.post('/auth/register', userData);
      if (res.data.success) {
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem('orchardsathi_token', res.data.token);
        localStorage.setItem('orchardsathi_user', JSON.stringify(res.data.user));
        return { success: true, user: res.data.user };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      const msg = err.response?.data?.message || (err.message === 'Network Error' ? 'Cannot reach OrchardSathi AI backend. Please verify the server is running.' : 'Registration failed');
      setError(msg);
      return { success: false, message: msg };
    }
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('orchardsathi_token');
    localStorage.removeItem('orchardsathi_user');
  };

  // Quick Demo Login (for review evaluation presentation)
  const quickLoginAs = async (role) => {
    let email = '';
    let name = '';
    let roleData = {};

    if (role === 'farmer') {
      email = 'farmer.kashmir@orchardsathi.ai';
      name = 'Bashir Ahmad Wani';
      roleData = {
        district: 'Shopian',
        orchardName: 'Zainapora Apple Estate',
        acreage: 5.5,
        primaryVarieties: 'Kashmiri Delicious, Royal Delicious, Maharaji',
      };
    } else if (role === 'customer') {
      email = 'trader.delhi@orchardsathi.ai';
      name = 'Sunil Kumar (Wholesale Buyer)';
      roleData = { district: 'Azadpur Terminal Market' };
    } else if (role === 'expert') {
      email = 'expert.altaf@orchardsathi.ai';
      name = 'Dr. Altaf Hussain';
      roleData = {
        specialization: 'Apple Scab & Temperate Pomology',
        institution: 'SKUAST-Kashmir (Shalimar)',
      };
    }

    // Try logging in, if account doesn't exist yet, automatically register it!
    const loginRes = await login(email, 'Orchard@123');
    if (loginRes.success) {
      return loginRes;
    }

    // Register on the fly
    const regRes = await register({
      name,
      email,
      password: 'Orchard@123',
      role,
      ...roleData,
    });
    return regRes;
  };

  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('orchardsathi_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        error,
        login,
        register,
        logout,
        quickLoginAs,
        updateUser,
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
