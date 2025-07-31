import axios from 'axios';
import Cookies from 'js-cookie';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('accessToken') || localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = Cookies.get('refreshToken') || localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken: refreshToken
          });
          
          const { accessToken } = response.data.data.tokens;
          Cookies.set('accessToken', accessToken, { expires: 1 }); // 1 day
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('token', accessToken); // Backward compatibility
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        authService.logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth Service
export const authService = {
  async register(userData) {
    try {
      const response = await api.post('/auth/register', {
        full_name: userData.fullName,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        role: userData.role || 'customer',
        department: userData.department
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      console.log('Login response:', response.data); // Debug log
      
      const { user, tokens } = response.data.data;
      const { accessToken, refreshToken } = tokens;
      
      console.log('Tokens:', { accessToken, refreshToken }); // Debug log
      
      // Store tokens
      Cookies.set('accessToken', accessToken, { expires: 1 }); // 1 day
      Cookies.set('refreshToken', refreshToken, { expires: 7 }); // 7 days
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('token', accessToken); // Backward compatibility
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async logout() {
    try {
      const refreshToken = Cookies.get('refreshToken') || localStorage.getItem('refreshToken');
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken: refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all stored data
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async refreshToken() {
    try {
      const refreshToken = Cookies.get('refreshToken') || localStorage.getItem('refreshToken');
      const response = await api.post('/auth/refresh', { refresh_token: refreshToken });
      const { access_token } = response.data.data;
      
      Cookies.set('accessToken', access_token, { expires: 1 });
      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('token', access_token); // Backward compatibility
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  handleError(error) {
    const message = error.response?.data?.message || error.message || 'Có lỗi xảy ra';
    const status = error.response?.status;
    return { message, status, originalError: error };
  }
};

// User Service
export const userService = {
  async getProfile() {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      throw authService.handleError(error);
    }
  },

  async updateProfile(userData) {
    try {
      const response = await api.put('/users/profile', userData);
      return response.data;
    } catch (error) {
      throw authService.handleError(error);
    }
  },

  async changePassword(passwordData) {
    try {
      const response = await api.put('/users/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw authService.handleError(error);
    }
  },

  async getAgents(filters = {}) {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/users/agents?${params}`);
      return response.data;
    } catch (error) {
      throw authService.handleError(error);
    }
  }
};

// Chat Service
export const chatService = {
  async getRooms(filters = {}) {
    try {
      const params = new URLSearchParams(filters).toString();
      // Use different endpoints based on user role
      console.log('🔄 Getting current user...');
      const userResponse = await authService.getCurrentUser();
      console.log('📦 Full user response:', userResponse);
      
      const user = userResponse.data?.user || userResponse.user || userResponse; // Handle response format
      console.log('� Extracted user:', user);
      console.log('🎯 User role:', user?.role);
      
      const endpoint = user?.role === 'student' ? '/chat/my-rooms' : '/chat/rooms';
      console.log('🛣️ Using endpoint:', endpoint);
      console.log('🔐 Current token:', localStorage.getItem('accessToken')?.substring(0, 50) + '...');
      
      const response = await api.get(`${endpoint}?${params}`);
      return response.data;
    } catch (error) {
      console.error('❌ getRooms error:', error);
      throw authService.handleError(error);
    }
  },

  async getMyRooms() {
    try {
      const response = await api.get('/chat/my-rooms');
      return response.data;
    } catch (error) {
      console.error('❌ getMyRooms error:', error);
      throw authService.handleError(error);
    }
  },

  async createRoom(roomData) {
    try {
      // Check if this is a guest session
      const guestSession = localStorage.getItem('guestSession');
      const guestId = localStorage.getItem('guestId');
      
      let config = {};
      
      if (guestSession && guestId) {
        // Guest session - add guest header instead of auth token
        console.log('� Creating room as guest:', guestId);
        config.headers = {
          'X-Guest-Session': guestId
        };
      } else {
        // Authenticated user  
      }
      
      const response = await api.post('/chat/rooms', roomData, config);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to create room:', error.response?.data || error.message);
      throw authService.handleError(error);
    }
  },

  async getRoomDetails(roomId) {
    try {
      // Check if this is a guest session
      const guestSession = localStorage.getItem('guestSession');
      const guestId = localStorage.getItem('guestId');
      
      let config = {};
      
      if (guestSession && guestId) {
        // Guest session - add guest header
        config.headers = {
          'X-Guest-Session': guestId
        };
      }
      
      const response = await api.get(`/chat/rooms/${roomId}`, config);
      return response.data;
    } catch (error) {
      throw authService.handleError(error);
    }
  },

  async updateRoomStatus(roomId, statusData) {
    try {
      const response = await api.put(`/chat/rooms/${roomId}/status`, statusData);
      return response.data;
    } catch (error) {
      throw authService.handleError(error);
    }
  },

  async getMessages(roomId, page = 1, limit = 50) {
    try {
      // Check if this is a guest session
      const guestSession = localStorage.getItem('guestSession');
      const guestId = localStorage.getItem('guestId');
      
      let config = {};
      
      if (guestSession && guestId) {
        // Guest session - add guest header
        config.headers = {
          'X-Guest-Session': guestId
        };
      }
      
      const response = await api.get(`/chat/rooms/${roomId}/messages?page=${page}&limit=${limit}`, config);
      return response.data;
    } catch (error) {
      throw authService.handleError(error);
    }
  },

  async sendMessage(roomId, messageData) {
    try {
      // Check if this is a guest session
      const guestSession = localStorage.getItem('guestSession');
      const guestId = localStorage.getItem('guestId');
      
      let config = {};
      
      if (guestSession && guestId) {
        // Guest session - add guest header
        config.headers = {
          'X-Guest-Session': guestId
        };
      }
      
      const response = await api.post(`/chat/rooms/${roomId}/messages`, messageData, config);
      return response.data;
    } catch (error) {
      throw authService.handleError(error);
    }
  },

  async closeRoom(roomId, reason = '') {
    try {
      const response = await api.put(`/chat/rooms/${roomId}/close`, { reason });
      return response.data;
    } catch (error) {
      throw authService.handleError(error);
    }
  },

  async customerCloseRoom(roomId, { reason = '', rating = null, comment = '' } = {}) {
    try {
      const response = await api.put(`/chat/rooms/${roomId}/customer-close`, { 
        reason, 
        rating, 
        comment 
      });
      return response.data;
    } catch (error) {
      throw authService.handleError(error);
    }
  }
};

// Guest Service
export const guestService = {
  async createSession(sessionData) {
    try {
      // Map frontend field names to backend API field names
      const mappedData = {
        customerName: sessionData.fullName || sessionData.customerName,
        customerEmail: sessionData.email || sessionData.customerEmail,
        subject: sessionData.subject || 'General Support'
      };
      
      console.log('🔄 Mapping guest session data:', sessionData, '→', mappedData);
      
      const response = await axios.post(`${API_BASE_URL}/guest/session`, mappedData);
      const { session } = response.data.data;
      
      // Store guest session
      localStorage.setItem('guestSession', JSON.stringify(session));
      localStorage.setItem('guestId', session.id);
      
      return response.data;
    } catch (error) {
      throw authService.handleError(error);
    }
  },

  async getSession(sessionId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/guest/session/${sessionId}`);
      return response.data;
    } catch (error) {
      throw authService.handleError(error);
    }
  },

  async updateActivity(sessionId) {
    try {
      const response = await axios.put(`${API_BASE_URL}/guest/session/${sessionId}/activity`);
      return response.data;
    } catch (error) {
      throw authService.handleError(error);
    }
  },

  async endSession(sessionId, reason = 'manual_disconnect') {
    try {
      const response = await axios.delete(`${API_BASE_URL}/guest/session/${sessionId}`, {
        data: { reason }
      });
      
      // Clear guest session data
      localStorage.removeItem('guestSession');
      localStorage.removeItem('guestId');
      
      return response.data;
    } catch (error) {
      throw authService.handleError(error);
    }
  },

  async sendMessage(sessionId, messageData) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/guest/session/${sessionId}/messages`,
        messageData,
        {
          headers: {
            'X-Guest-Session': sessionId
          }
        }
      );
      return response.data;
    } catch (error) {
      throw authService.handleError(error);
    }
  },

  async getMessages(sessionId, page = 1, limit = 50) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/guest/session/${sessionId}/messages?page=${page}&limit=${limit}`,
        {
          headers: {
            'X-Guest-Session': sessionId
          }
        }
      );
      return response.data;
    } catch (error) {
      throw authService.handleError(error);
    }
  }
};

// Rating Service
export const ratingService = {
  async submitRating(ratingData) {
    try {
      const response = await api.post('/ratings/submit', ratingData);
      return response.data;
    } catch (error) {
      throw authService.handleError(error);
    }
  },

  async getRoomRatings(roomId) {
    try {
      const response = await api.get(`/ratings/room/${roomId}`);
      return response.data;
    } catch (error) {
      throw authService.handleError(error);
    }
  },

  async getAgentStats(agentId) {
    try {
      const response = await api.get(`/ratings/agent/${agentId}/stats`);
      return response.data;
    } catch (error) {
      throw authService.handleError(error);
    }
  },

  async getOverallStats() {
    try {
      const response = await api.get('/ratings/stats');
      return response.data;
    } catch (error) {
      throw authService.handleError(error);
    }
  }
};

// Notification Service
export const notificationService = {
  async getNotifications(filters = {}) {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/notifications?${params}`);
      return response.data;
    } catch (error) {
      throw authService.handleError(error);
    }
  },

  async markAsRead(notificationId) {
    try {
      const response = await api.put(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      throw authService.handleError(error);
    }
  },

  async markAllAsRead() {
    try {
      const response = await api.put('/notifications/mark-all-read');
      return response.data;
    } catch (error) {
      throw authService.handleError(error);
    }
  },

  async deleteNotification(notificationId) {
    try {
      const response = await api.delete(`/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      throw authService.handleError(error);
    }
  },

  async sendBulkNotification(notificationData) {
    try {
      const response = await api.post('/notifications/send', notificationData);
      return response.data;
    } catch (error) {
      throw authService.handleError(error);
    }
  }
};

// Analytics Service
export const analyticsService = {
  async getDashboard() {
    try {
      const response = await api.get('/analytics/dashboard');
      return response.data;
    } catch (error) {
      throw authService.handleError(error);
    }
  },

  async getAgentPerformance(agentId) {
    try {
      const response = await api.get(`/analytics/agent/${agentId}/performance`);
      return response.data;
    } catch (error) {
      throw authService.handleError(error);
    }
  },

  async getCustomerSatisfaction(filters = {}) {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/analytics/customer-satisfaction?${params}`);
      return response.data;
    } catch (error) {
      throw authService.handleError(error);
    }
  },

  async exportData(type, filters = {}) {
    try {
      const params = new URLSearchParams({ type, ...filters }).toString();
      const response = await api.get(`/analytics/export/csv?${params}`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}-export-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return { success: true, message: 'Export completed successfully' };
    } catch (error) {
      throw authService.handleError(error);
    }
  }
};

// File Service
export const fileService = {
  async uploadFile(roomId, file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post(`/files/upload/${roomId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      throw authService.handleError(error);
    }
  },

  async downloadFile(fileId) {
    try {
      const response = await api.get(`/files/download/${fileId}`, {
        responseType: 'blob', // Important for file downloads
      });

      return response;
    } catch (error) {
      throw authService.handleError(error);
    }
  },

  // Helper function to get file download URL
  getFileDownloadUrl(fileId) {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    return `${API_BASE_URL}/files/download/${fileId}?token=${token}`;
  },

  // Helper function to format file size
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Helper function to get file icon based on mime type
  getFileIcon(mimeType) {
    if (mimeType.startsWith('image/')) {
      return 'ri-image-line';
    } else if (mimeType === 'application/pdf') {
      return 'ri-file-pdf-line';
    } else if (mimeType.includes('word')) {
      return 'ri-file-word-line';
    } else if (mimeType === 'text/plain') {
      return 'ri-file-text-line';
    } else {
      return 'ri-file-line';
    }
  }
};

export default api;
