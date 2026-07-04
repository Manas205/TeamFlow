
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
          'http://localhost:5000/api/auth/refresh',
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

  const logout = () => {
    setUser(null);
    setAccessToken(null);
  };

  if (loading) return <div>Loading...</div>; 

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);