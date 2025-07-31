import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { chatService, guestService } from '../services/api';
import socketService from '../services/socket';
import { toast } from 'react-toastify';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [onlineAgents, setOnlineAgents] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [notifications, setNotifications] = useState([]);
  
  // Guest session state
  const [guestSession, setGuestSession] = useState(null);
  const [isGuestMode, setIsGuestMode] = useState(false);
  
  // Socket connection state
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  
  // Refs for cleanup
  const typingTimerRef = useRef(null);
  const messagePollingRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      initializeChat();
    } else {
      checkGuestSession();
    }
    
    return () => {
      cleanup();
    };
  }, [isAuthenticated, user]);

  useEffect(() => {
    setupSocketListeners();
    return () => {
      removeSocketListeners();
    };
  }, []);

  const initializeChat = async () => {
    try {
      setIsLoading(true);
      
      // Connect socket
      socketService.connect('user');
      
      // Load rooms based on user role
      if (user.role === 'agent' || user.role === 'admin') {
        await loadAgentRooms();
      } else {
        await loadCustomerRooms();
      }
      
    } catch (error) {
      console.error('Failed to initialize chat:', error);
      toast.error('Không thể tải dữ liệu chat');
    } finally {
      setIsLoading(false);
    }
  };

  const checkGuestSession = () => {
    const savedGuestSession = localStorage.getItem('guestSession');
    if (savedGuestSession) {
      try {
        const session = JSON.parse(savedGuestSession);
        setGuestSession(session);
        setIsGuestMode(true);
        
        // Connect socket as guest
        socketService.connect('guest');
      } catch (error) {
        localStorage.removeItem('guestSession');
        localStorage.removeItem('guestId');
      }
    }
  };

  const setupSocketListeners = () => {
    // Connection events
    socketService.on('socket_connected', () => {
      setIsSocketConnected(true);
    });

    socketService.on('socket_disconnected', () => {
      setIsSocketConnected(false);
    });

    // Message events
    socketService.on('new_message', (data) => {
      handleNewMessage(data);
    });

    socketService.on('message_sent', (data) => {
      handleMessageSent(data);
    });

    // Typing events
    socketService.on('user_typing', (data) => {
      handleUserTyping(data);
    });

    // Room events
    socketService.on('room_created', (data) => {
      handleRoomCreated(data);
    });

    socketService.on('room_updated', (data) => {
      handleRoomUpdated(data);
    });

    socketService.on('room_closed', (data) => {
      handleRoomClosed(data);
    });

    socketService.on('agent_assigned', (data) => {
      handleAgentAssigned(data);
    });

    // User events
    socketService.on('user_joined', (data) => {
      handleUserJoined(data);
    });

    socketService.on('user_left', (data) => {
      handleUserLeft(data);
    });

    // Notification events
    socketService.on('new_notification', (data) => {
      handleNewNotification(data);
    });

    // Error events
    socketService.on('socket_error', (error) => {
      console.error('Socket error:', error);
      toast.error('Lỗi kết nối realtime');
    });
  };

  const removeSocketListeners = () => {
    socketService.clearAllListeners();
  };

  const cleanup = () => {
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }
    if (messagePollingRef.current) {
      clearInterval(messagePollingRef.current);
    }
    removeSocketListeners();
  };

  // Load functions
  const loadAgentRooms = async (filters = {}) => {
    try {
      const response = await chatService.getRooms({
        page: 1,
        limit: 50,
        ...filters
      });
      
      if (response.success) {
        setRooms(response.data.rooms || []);
        
        // Join all rooms for real-time updates
        response.data.rooms?.forEach(room => {
          socketService.joinRoom(room.room_id, user.role);
        });
      }
    } catch (error) {
      console.error('Failed to load agent rooms:', error);
      toast.error('Không thể tải danh sách phòng chat');
    }
  };

  const loadCustomerRooms = async () => {
    try {
      const response = await chatService.getRooms({
        page: 1,
        limit: 20
      });
      
      if (response.success) {
        setRooms(response.data.rooms || []);
        
        // Join customer's rooms
        response.data.rooms?.forEach(room => {
          socketService.joinRoom(room.room_id, 'customer');
        });
      }
    } catch (error) {
      console.error('Failed to load customer rooms:', error);
      toast.error('Không thể tải lịch sử chat');
    }
  };

  const loadMessages = async (roomId, page = 1) => {
    try {
      setIsLoading(true);
      const response = await chatService.getMessages(roomId, page, 50);
      
      if (response.success) {
        const newMessages = response.data.messages || [];
        
        if (page === 1) {
          setMessages(newMessages);
        } else {
          setMessages(prev => [...newMessages, ...prev]);
        }
        
        // Mark messages as read
        markRoomAsRead(roomId);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
      toast.error('Không thể tải tin nhắn');
    } finally {
      setIsLoading(false);
    }
  };

  // Socket event handlers
  const handleNewMessage = useCallback((data) => {
    const { message, roomId } = data;
    
    // Add message to current room if it's active
    if (activeRoom?.room_id === roomId) {
      setMessages(prev => [...prev, message]);
      markRoomAsRead(roomId);
    } else {
      // Update unread count
      setUnreadCounts(prev => ({
        ...prev,
        [roomId]: (prev[roomId] || 0) + 1
      }));
      
      // Show notification if not focused on the room
      toast.info(`Tin nhắn mới từ ${message.sender_name}`);
    }
    
    // Update last message in room list
    setRooms(prev => prev.map(room => 
      room.room_id === roomId 
        ? { ...room, last_message: message, updated_at: message.created_at }
        : room
    ));
  }, [activeRoom]);

  const handleMessageSent = useCallback((data) => {
    const { message } = data;
    
    // Update message in current messages if it's a local message
    setMessages(prev => prev.map(msg => 
      msg.temp_id === message.temp_id 
        ? { ...message, status: 'sent' }
        : msg
    ));
  }, []);

  const handleUserTyping = useCallback((data) => {
    const { user_name, is_typing, roomId } = data;
    
    if (activeRoom?.room_id === roomId) {
      setTypingUsers(prev => {
        if (is_typing) {
          return prev.includes(user_name) ? prev : [...prev, user_name];
        } else {
          return prev.filter(name => name !== user_name);
        }
      });
    }
  }, [activeRoom]);

  const handleRoomCreated = useCallback((data) => {
    const { room } = data;
    
    setRooms(prev => [room, ...prev]);
    
    // Auto-join if user is agent/admin
    if (user?.role === 'agent' || user?.role === 'admin') {
      socketService.joinRoom(room.room_id, user.role);
      toast.info(`Phòng chat mới: ${room.subject}`);
    }
  }, [user]);

  const handleRoomUpdated = useCallback((data) => {
    const { room } = data;
    
    setRooms(prev => prev.map(r => 
      r.room_id === room.room_id ? { ...r, ...room } : r
    ));
    
    // Update active room if it's the same room
    if (activeRoom?.room_id === room.room_id) {
      setActiveRoom(prev => ({ ...prev, ...room }));
    }
  }, [activeRoom]);

  const handleRoomClosed = useCallback((data) => {
    const { roomId, reason } = data;
    
    setRooms(prev => prev.map(room => 
      room.room_id === roomId 
        ? { ...room, status: 'closed' }
        : room
    ));
    
    if (activeRoom?.room_id === roomId) {
      toast.info(`Phòng chat đã đóng: ${reason}`);
    }
  }, [activeRoom]);

  const handleAgentAssigned = useCallback((data) => {
    const { roomId, agent } = data;
    
    setRooms(prev => prev.map(room => 
      room.room_id === roomId 
        ? { ...room, assigned_agent: agent, status: 'active' }
        : room
    ));
    
    if (activeRoom?.room_id === roomId) {
      setActiveRoom(prev => ({ ...prev, assigned_agent: agent, status: 'active' }));
      toast.success(`Agent ${agent.full_name} đã được phân công`);
    }
  }, [activeRoom]);

  const handleUserJoined = useCallback((data) => {
    const { user: joinedUser, roomId } = data;
    
    if (activeRoom?.room_id === roomId) {
      toast.info(`${joinedUser.name} đã tham gia cuộc trò chuyện`);
    }
  }, [activeRoom]);

  const handleUserLeft = useCallback((data) => {
    const { user: leftUser, roomId } = data;
    
    if (activeRoom?.room_id === roomId) {
      toast.info(`${leftUser.name} đã rời cuộc trò chuyện`);
    }
  }, [activeRoom]);

  const handleNewNotification = useCallback((data) => {
    const { notification } = data;
    
    setNotifications(prev => [notification, ...prev]);
    
    // Show toast for important notifications
    if (['new_chat_room', 'high_priority_chat', 'low_rating_received'].includes(notification.type)) {
      toast.info(notification.title);
    }
  }, []);

  // Action functions
  const createRoom = async (roomData) => {
    try {
      setIsLoading(true);
      const response = await chatService.createRoom(roomData);
      
      if (response.success) {
        const newRoom = response.data.room;
        setRooms(prev => [newRoom, ...prev]);
        
        // Join the new room
        socketService.joinRoom(newRoom.room_id, user?.role || 'customer');
        
        toast.success('Tạo phòng chat thành công');
        return newRoom;
      }
    } catch (error) {
      console.error('Failed to create room:', error);
      toast.error('Không thể tạo phòng chat');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createGuestSession = async (sessionData) => {
    try {
      setIsLoading(true);
      const response = await guestService.createSession(sessionData);
      
      if (response.success) {
        const session = response.data.session;
        setGuestSession(session);
        setIsGuestMode(true);
        
        // Connect socket as guest
        socketService.connect('guest');
        
        toast.success('Tạo phiên chat thành công');
        return session;
      }
    } catch (error) {
      console.error('Failed to create guest session:', error);
      toast.error('Không thể tạo phiên chat');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const joinRoom = async (roomId) => {
    try {
      const response = await chatService.getRoomDetails(roomId);
      
      if (response.success) {
        const room = response.data.room;
        setActiveRoom(room);
        
        // Join socket room
        socketService.joinRoom(roomId, user?.role || 'customer');
        
        // Load messages
        await loadMessages(roomId);
        
        // Clear typing users
        setTypingUsers([]);
        
        return room;
      }
    } catch (error) {
      console.error('Failed to join room:', error);
      toast.error('Không thể tham gia phòng chat');
      throw error;
    }
  };

  const leaveRoom = () => {
    if (activeRoom) {
      socketService.leaveRoom(activeRoom.room_id);
      setActiveRoom(null);
      setMessages([]);
      setTypingUsers([]);
    }
  };

  const sendMessage = async (content, messageType = 'text') => {
    if (!activeRoom) return;

    const tempId = `temp_${Date.now()}`;
    const tempMessage = {
      temp_id: tempId,
      content,
      message_type: messageType,
      sender_name: user?.full_name || guestSession?.customerName || 'Guest',
      sender_type: user ? (user.role === 'agent' ? 'agent' : 'customer') : 'guest',
      created_at: new Date().toISOString(),
      status: 'sending'
    };

    // Add temp message to UI
    setMessages(prev => [...prev, tempMessage]);

    try {
      let response;
      
      if (isGuestMode && guestSession) {
        // Send as guest
        response = await guestService.sendMessage(guestSession.id, {
          content,
          messageType
        });
      } else {
        // Send as authenticated user
        response = await chatService.sendMessage(activeRoom.room_id, {
          content,
          message_type: messageType
        });
      }

      if (response.success) {
        const sentMessage = response.data.message;
        
        // Replace temp message with real message
        setMessages(prev => prev.map(msg => 
          msg.temp_id === tempId ? { ...sentMessage, status: 'sent' } : msg
        ));

        // Send via socket for real-time updates
        if (isGuestMode) {
          socketService.sendGuestMessage(guestSession.id, activeRoom.room_id, content);
        } else {
          socketService.sendMessage(activeRoom.room_id, content, messageType);
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      
      // Mark message as failed
      setMessages(prev => prev.map(msg => 
        msg.temp_id === tempId ? { ...msg, status: 'failed' } : msg
      ));
      
      toast.error('Không thể gửi tin nhắn');
    }
  };

  const startTyping = () => {
    if (activeRoom) {
      socketService.startTyping(activeRoom.room_id);
      
      // Auto stop typing after 3 seconds
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
      
      typingTimerRef.current = setTimeout(() => {
        stopTyping();
      }, 3000);
    }
  };

  const stopTyping = () => {
    if (activeRoom) {
      socketService.stopTyping(activeRoom.room_id);
    }
    
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
      typingTimerRef.current = null;
    }
  };

  const assignAgent = async (roomId, agentId) => {
    try {
      const response = await chatService.updateRoomStatus(roomId, {
        status: 'active',
        assignedAgentId: agentId
      });
      
      if (response.success) {
        toast.success('Phân công agent thành công');
        
        // Emit socket event
        socketService.assignAgent(roomId, agentId);
        
        return response.data.room;
      }
    } catch (error) {
      console.error('Failed to assign agent:', error);
      toast.error('Không thể phân công agent');
      throw error;
    }
  };

  const closeRoom = async (roomId, reason = '') => {
    try {
      const response = await chatService.closeRoom(roomId, reason);
      
      if (response.success) {
        toast.success('Đóng phòng chat thành công');
        
        // Emit socket event
        socketService.closeRoom(roomId, reason);
        
        // If it's the active room, leave it
        if (activeRoom?.room_id === roomId) {
          setActiveRoom(null);
          setMessages([]);
        }
        
        return response.data.room;
      }
    } catch (error) {
      console.error('Failed to close room:', error);
      toast.error('Không thể đóng phòng chat');
      throw error;
    }
  };

  const markRoomAsRead = (roomId) => {
    setUnreadCounts(prev => ({
      ...prev,
      [roomId]: 0
    }));
  };

  const refreshRooms = async () => {
    if (user?.role === 'agent' || user?.role === 'admin') {
      await loadAgentRooms();
    } else {
      await loadCustomerRooms();
    }
  };

  const endGuestSession = async () => {
    if (guestSession) {
      try {
        await guestService.endSession(guestSession.id);
        setGuestSession(null);
        setIsGuestMode(false);
        socketService.disconnect();
        toast.info('Đã kết thúc phiên chat');
      } catch (error) {
        console.error('Failed to end guest session:', error);
      }
    }
  };

  // Context value
  const value = {
    // State
    rooms,
    activeRoom,
    messages,
    isLoading,
    onlineAgents,
    typingUsers,
    unreadCounts,
    notifications,
    guestSession,
    isGuestMode,
    isSocketConnected,
    
    // Actions
    createRoom,
    createGuestSession,
    joinRoom,
    leaveRoom,
    sendMessage,
    startTyping,
    stopTyping,
    assignAgent,
    closeRoom,
    markRoomAsRead,
    refreshRooms,
    loadMessages,
    endGuestSession,
    
    // Utilities
    setActiveRoom,
    setMessages,
    setRooms
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
