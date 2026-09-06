import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('sfl_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('sfl_token');
      if (storedToken) {
        try {
          const userData = await api.getCurrentUser();
          setUser(userData);
        } catch (err) {
          console.error("Token verification failed, logging out:", err);
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (username, password) => {
    const data = await api.login(username, password);
    localStorage.setItem('sfl_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const quickDemoLogin = async (role) => {
    let credentials = { username: 'student', password: 'student123' };
    if (role === 'faculty') {
      credentials = { username: 'faculty', password: 'faculty123' };
    } else if (role === 'admin') {
      credentials = { username: 'admin', password: 'admin123' };
    }
    return login(credentials.username, credentials.password);
  };

  const logout = () => {
    localStorage.removeItem('sfl_token');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const userData = await api.getCurrentUser();
      setUser(userData);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, quickDemoLogin, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
