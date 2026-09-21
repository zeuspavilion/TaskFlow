import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient, { TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from '../api/client';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (
    email: string,
    password: string,
    name?: string
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadStoredSession();
  }, []);

  const loadStoredSession = async () => {
    try {
      const storedToken = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
      const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        // Verify with server in background
        refreshProfile();
      }
    } catch (e) {
      console.warn('Failed to load auth session:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      const { token: jwtToken, user: userData } = res.data.data;

      setToken(jwtToken);
      setUser(userData);

      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, jwtToken);
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));

      return { success: true };
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Login failed. Please check network/credentials.';
      return { success: false, message: msg };
    }
  };

  const register = async (
    email: string,
    password: string,
    name?: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await apiClient.post('/auth/register', { email, password, name });
      const { token: jwtToken, user: userData } = res.data.data;

      setToken(jwtToken);
      setUser(userData);

      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, jwtToken);
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));

      return { success: true };
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Registration failed.';
      return { success: false, message: msg };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove([TOKEN_STORAGE_KEY, USER_STORAGE_KEY]);
      setToken(null);
      setUser(null);
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  const refreshProfile = async () => {
    try {
      const res = await apiClient.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.data);
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.data.data));
      }
    } catch (e) {
      console.warn('Profile refresh skipped or offline');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
