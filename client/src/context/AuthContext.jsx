import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Validate existing token on load
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const { data } = await api.get('/auth/me');
          if (data.success) {
            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
          }
        } catch (error) {
          console.error('Session expired:', error.message);
          logout(false);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        toast.success(`Welcome back, ${data.user.name}!`);
        return { success: true };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Please check credentials.';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        toast.success(`Account created! Welcome, ${data.user.name}!`);
        return { success: true };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed.';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  const logout = (notify = true) => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    if (notify) {
      toast.success('Logged out successfully');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
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

