import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/client';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const toRoleArray = (payload) => {
  const sources = [];

  if (Array.isArray(payload.roles)) {
    sources.push(...payload.roles);
  }
  if (Array.isArray(payload.authorities)) {
    sources.push(...payload.authorities);
  }
  if (payload.role) {
    sources.push(payload.role);
  }
  if (payload.authority) {
    sources.push(payload.authority);
  }

  return sources
    .map((entry) => {
      if (typeof entry === 'string') return entry;
      if (entry && typeof entry === 'object') return entry.name || entry.role || '';
      return '';
    })
    .map((role) => role.toUpperCase().replace(/^ROLE_/, ''))
    .filter(Boolean);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [permissionsLoading, setPermissionsLoading] = useState(false);
  const [baseUrl, setBaseUrlState] = useState(
    localStorage.getItem('baseUrl') || 'http://localhost:8080'
  );

  // Decode JWT payload on token change
  useEffect(() => {
    let active = true;

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const roles = toRoleArray(payload);

        if (!active) return;
        setUser({ email: payload.sub, ...payload, roles });

        if (roles.length > 0) {
          setIsAdmin(roles.includes('ADMIN'));
          setPermissionsLoading(false);
          return () => {
            active = false;
          };
        }

        // Fallback for tokens without role claims: probe an admin-only endpoint.
        setPermissionsLoading(true);
        api
          .get('/api/orders/all')
          .then(() => {
            if (active) setIsAdmin(true);
          })
          .catch(() => {
            if (active) setIsAdmin(false);
          })
          .finally(() => {
            if (active) setPermissionsLoading(false);
          });
      } catch {
        setUser(null);
        setIsAdmin(false);
        setPermissionsLoading(false);
      }
    } else {
      setUser(null);
      setIsAdmin(false);
      setPermissionsLoading(false);
    }

    return () => {
      active = false;
    };
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
    setIsAdmin(false);
    setPermissionsLoading(false);
    localStorage.removeItem('token');
  };

  const updateBaseUrl = (url) => {
    setBaseUrlState(url);
    localStorage.setItem('baseUrl', url);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAdmin,
        permissionsLoading,
        baseUrl,
        login,
        register,
        logout,
        updateBaseUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
