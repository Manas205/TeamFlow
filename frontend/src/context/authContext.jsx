
import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import axiosInstance, { setAccessToken } from '../api/axiosInstance';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const restoreSession = async () => {
      
      try {
        const refreshResponse = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        setAccessToken(refreshResponse.data.accessToken);

        const meResponse = await axiosInstance.get('/auth/me'); 
        setUser(meResponse.data.user);
      } catch (err) {
        console.log("Restore session failed:", err.response?.status, err.response?.data, err.message);
        setUser(null); 
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = (userData, accessToken) => {
    setUser(userData);
    setAccessToken(accessToken);
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (err) {
      console.error('Logout request failed:', err);
    } finally {
      setUser(null);
      setAccessToken(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
