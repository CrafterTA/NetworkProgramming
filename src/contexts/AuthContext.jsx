import React, { createContext, useContext, useState, useEffect } from 'react';

// Mock users for testing
const MOCK_USERS = [
  {
    UserID: 1,
    FullName: "Nguyễn Văn An",
    Email: "agent1@hutech.edu.vn",
    Password: "123456",
    Role: "agent",
    Avatar: null,
    Department: "Hỗ trợ kỹ thuật",
    Phone: "0901234567"
  },
  {
    UserID: 2,
    FullName: "Trần Thị Bình",
    Email: "agent2@hutech.edu.vn", 
    Password: "123456",
    Role: "agent",
    Avatar: null,
    Department: "Hỗ trợ học vụ",
    Phone: "0901234568"
  },
  {
    UserID: 3,
    FullName: "Lê Văn Cường",
    Email: "admin@hutech.edu.vn",
    Password: "admin123",
    Role: "admin",
    Avatar: null,
    Department: "Quản trị hệ thống",
    Phone: "0901234569"
  },
  {
    UserID: 4,
    FullName: "Phạm Thị Dung",
    Email: "student@hutech.edu.vn",
    Password: "123456",
    Role: "student",
    Avatar: null,
    Department: "Sinh viên",
    Phone: "0901234570"
  }
];

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

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('authToken', 'mock-jwt-token-' + userData.UserID);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  };

  const isAuthenticated = () => {
    return !!user;
  };

  // Mock login function for testing
  const mockLogin = async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundUser = MOCK_USERS.find(u => u.Email === email && u.Password === password);
        if (foundUser) {
          const { Password, ...userWithoutPassword } = foundUser;
          login(userWithoutPassword);
          resolve({
            success: true,
            user: userWithoutPassword,
            token: 'mock-jwt-token-' + foundUser.UserID
          });
        } else {
          reject({
            success: false,
            message: 'Email hoặc mật khẩu không đúng'
          });
        }
      }, 1000); // Simulate API delay
    });
  };

  // Get all mock users (for dev purposes)
  const getMockUsers = () => {
    return MOCK_USERS.map(({ Password, ...user }) => user);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    isLoading,
    mockLogin,
    getMockUsers
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
