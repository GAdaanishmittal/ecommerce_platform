import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/client';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [baseUrl, setBaseUrlState] = useState(
    localStorage.getItem('baseUrl') || 'http://localhost:8080'
  );

  // Decode JWT payload on token change
  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ email: payload.sub, ...payload });
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [token]);

  const login = async (email, password) => {
    // The /auth/login endpoint returns a raw JWT string
    const response = await api.post('/auth/login', { email, password }, {
      transformResponse: [(data) => data],   // keep as plain string
    });
    const newToken = typeof response.data === 'string'
      ? response.data.trim()
      : response.data;
    setToken(newToken);
    localStorage.setItem('token', newToken);
    return newToken;
  };

  const register = async (payload) => {
    const response = await api.post('/auth/register', payload);
    return response.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  const updateBaseUrl = (url) => {
    setBaseUrlState(url);
    localStorage.setItem('baseUrl', url);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, baseUrl, login, register, logout, updateBaseUrl }}
    >
      {children}
    </AuthContext.Provider>
  );
};
