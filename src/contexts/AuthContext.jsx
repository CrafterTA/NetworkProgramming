import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
import socketService from '../services/socket';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      // Check if user data exists in localStorage
      const savedUser = localStorage.getItem('user');
      const token = localStorage.getItem('accessToken');
      
      if (savedUser && token) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
        
        // Connect socket for authenticated user with delay
        setTimeout(() => {
          socketService.connect('user');
        }, 100);
        
        // Try to get fresh user data
        try {
          const response = await authService.getCurrentUser();
          if (response.success) {
            const updatedUser = response.data.user;
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
          }
        } catch (error) {
          // If getting current user fails, handle 401 specifically
          if (error.response?.status === 401) {
            console.warn('Token expired, logging out');
            await logout();
          } else {
            console.warn('Could not refresh user data:', error);
          }
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear invalid auth data
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const response = await authService.login(email, password);
      
      if (response.success) {
        const userData = response.data.user;
        setUser(userData);
        setIsAuthenticated(true);
        
        // Wait a bit for tokens to be saved, then connect socket
        setTimeout(() => {
          socketService.connect('user');
        }, 100);
        
        toast.success(`Xin chào ${userData.full_name}! Đăng nhập thành công.`);
        return response;
      }
    } catch (error) {
      const errorMessage = error.message || 'Đăng nhập thất bại';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);
      const response = await authService.register(userData);
      
      if (response.success) {
        const newUser = response.data.user;
        setUser(newUser);
        setIsAuthenticated(true);
        
        // Connect socket
        socketService.connect('user');
        
        toast.success(`Chào mừng ${newUser.full_name}! Đăng ký thành công.`);
        return response;
      }
    } catch (error) {
      const errorMessage = error.message || 'Đăng ký thất bại';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Call API logout
      await authService.logout();
      
      // Disconnect socket
      socketService.disconnect();
      
      // Clear state
      setUser(null);
      setIsAuthenticated(false);
      
      toast.info('Đã đăng xuất thành công');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API call fails, still clear local state
      setUser(null);
      setIsAuthenticated(false);
      socketService.disconnect();
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authService.updateProfile(profileData);
      
      if (response.success) {
        const updatedUser = response.data.user;
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        toast.success('Cập nhật profile thành công');
        return response;
      }
    } catch (error) {
      const errorMessage = error.message || 'Cập nhật profile thất bại';
      toast.error(errorMessage);
      throw error;
    }
  };

  const changePassword = async (passwordData) => {
    try {
      const response = await authService.changePassword(passwordData);
      
      if (response.success) {
        toast.success('Đổi mật khẩu thành công');
        return response;
      }
    } catch (error) {
      const errorMessage = error.message || 'Đổi mật khẩu thất bại';
      toast.error(errorMessage);
      throw error;
    }
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    return roles.includes(user?.role);
  };

  // Get user's full information
  const getUserInfo = () => {
    return user;
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    hasRole,
    hasAnyRole,
    getUserInfo,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
