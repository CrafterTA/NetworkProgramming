import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { chatService, guestService, fileService } from '../services/api';
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
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());
  
  // Refs for cleanup and realtime access
  const typingTimerRef = useRef(null);
  const messagePollingRef = useRef(null);
  const activeRoomRef = useRef(null);

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

  // Keep activeRoomRef in sync with activeRoom state
  useEffect(() => {
    activeRoomRef.current = activeRoom;
  }, [activeRoom]);

  useEffect(() => {
    // Setup all socket listeners once on mount
    console.log('🔧 Setting up all socket listeners once on mount...');
    removeSocketListeners();
    setupSocketListeners();
    
    return () => {
      console.log('🧹 Cleaning up socket listeners on unmount');
      removeSocketListeners();
    };
  }, []); // Empty dependency array - will setup once

  const initializeChat = async () => {
    try {
      setIsLoading(true);
      
      // Clear guest session when user authenticates
      setGuestSession(null);
      setIsGuestMode(false);
      localStorage.removeItem('guestSession');
      localStorage.removeItem('guestId');
      
      // Connect socket and wait for actual connection
      console.log('🔌 Connecting socket for user:', user.role);
      socketService.connect('user');
      
      // Wait for socket to actually connect
      let attempts = 0;
      while (!socketService.socket?.connected && attempts < 20) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
      
      if (!socketService.socket?.connected) {
        console.warn('⚠️ Socket connection timeout, proceeding anyway');
      } else {
        console.log('✅ Socket connected successfully');
      }
      
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
    const savedGuestId = localStorage.getItem('guestId');
    
    if (savedGuestSession && savedGuestId) {
      try {
        const session = JSON.parse(savedGuestSession);
        setGuestSession(session);
        setIsGuestMode(true);
        
        // Chỉ connect socket khi thực sự cần chat, không connect ngay
        console.log('🎯 Guest session found, ready to connect when needed');
      } catch (error) {
        console.error('Invalid guest session data:', error);
        localStorage.removeItem('guestSession');
        localStorage.removeItem('guestId');
      }
    }
  };

  const setupSocketListeners = () => {
    console.log('🔧 Setting up socket listeners...');
    
    // Connection events
    socketService.on('socket_connected', () => {
      console.log('🟢 ChatContext - Socket connected');
      setIsSocketConnected(true);
    });

    socketService.on('socket_disconnected', () => {
      console.log('🔴 ChatContext - Socket disconnected');
      setIsSocketConnected(false);
    });

    // Message events - direct function calls (will use latest closure)
    socketService.on('new_message', (data) => {
      console.log('🎯 new_message listener called in ChatContext with data:', data);
      console.log('🎯 Message type:', data?.message?.message_type);
      
      // Special logging for file messages
      if (data?.message?.message_type === 'file') {
        console.log('📁 FILE MESSAGE DETECTED via new_message event!');
        console.log('📁 File details:', data.message.file);
      }
      
      handleNewMessage(data);
    });

    socketService.on('message_sent', (data) => {
      handleMessageSent(data);
    });

    // File upload events
    socketService.on('file_uploaded', (data) => {
      console.log('📁 File uploaded event received, reloading messages for room:', data.roomId);
      if (activeRoomRef.current?.room_id === data.roomId) {
        loadMessages(data.roomId, 1);
      }
    });

    // Other events
    socketService.on('user_typing', handleUserTyping);
    socketService.on('room_created', handleRoomCreated);
    socketService.on('new_room_created', handleNewRoomCreated);
    socketService.on('room_updated', handleRoomUpdated);
    socketService.on('room_closed', handleRoomClosed);
    socketService.on('agent_assigned', handleAgentAssigned);
    socketService.on('user_joined', handleUserJoined);
    socketService.on('user_left', handleUserLeft);
    socketService.on('new_notification', handleNewNotification);

    // Error events
    socketService.on('socket_error', (error) => {
      console.error('Socket error:', error);
      toast.error('Lỗi kết nối realtime');
    });
    
    console.log('✅ All socket listeners setup completed');
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
      // Use student-specific endpoint
      const response = await chatService.getMyRooms();
      
      if (response.success) {
        const customerRooms = response.data.rooms || [];
        setRooms(customerRooms);
        
        console.log('📚 Loaded', customerRooms.length, 'customer rooms:', customerRooms);
        
        // If customer has active room, set it as activeRoom
        const activeCustomerRoom = customerRooms.find(room => room.status !== 'closed');
        if (activeCustomerRoom) {
          setActiveRoom(activeCustomerRoom);
          console.log('🎯 Setting existing room as active:', activeCustomerRoom.room_id);
          
          // Join the room via socket
          socketService.joinRoom(activeCustomerRoom.room_id, 'customer');
          
          // Load messages for the active room
          await loadMessages(activeCustomerRoom.room_id);
        }
        
        // Join all customer's rooms for notifications
        customerRooms.forEach(room => {
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
      console.log('📨 Loading messages for room:', roomId, 'page:', page);
      setIsLoading(true);
      const response = await chatService.getMessages(roomId, page, 50);
      
      console.log('📨 Messages API response:', response);
      
      if (response.success) {
        const newMessages = response.data.messages || [];
        console.log('📨 Loaded', newMessages.length, 'messages');
        
        // Sort messages by timestamp (oldest first)
        const sortedMessages = newMessages.sort((a, b) => 
          new Date(a.created_at || a.timestamp) - new Date(b.created_at || b.timestamp)
        );
        
        if (page === 1) {
          setMessages(sortedMessages);
        } else {
          setMessages(prev => {
            const combined = [...sortedMessages, ...prev];
            return combined.sort((a, b) => 
              new Date(a.created_at || a.timestamp) - new Date(b.created_at || b.timestamp)
            );
          });
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

  // Helper functions
  const markRoomAsRead = useCallback((roomId) => {
    setUnreadCounts(prev => ({
      ...prev,
      [roomId]: 0
    }));
  }, []);

  // Socket event handlers - update ref when they change
  const handleNewMessage = useCallback((data) => {
    console.log('🔔 handleNewMessage received:', data);
    console.log('🔔 Current user role:', user?.role);
    console.log('🔔 Active room from ref:', activeRoomRef.current?.room_id);
    const { message, roomId } = data;
    
    // Add message to current room if it's active
    if (activeRoomRef.current?.room_id === roomId) {
      console.log('📨 Adding message to active room:', roomId, message);
      
      // Remove any temp message from same sender if exists
      setMessages(prev => {
        console.log('📊 Current messages before update:', prev.length);
        console.log('📊 Last 3 messages:', prev.slice(-3).map(m => ({ id: m.id || m.message_id, content: m.content.substring(0, 20), sender: m.sender_type })));
        console.log('📊 New message details:', { id: message.id || message.message_id, content: message.content, sender: message.sender_type });
        
        // Check if message already exists (prevent duplicates)
        const existingMessage = prev.find(msg => {
          // Compare by message_id or id
          const msgId = msg.id || msg.message_id;
          const newMsgId = message.id || message.message_id;
          
          if (msgId && newMsgId && msgId === newMsgId) {
            return true;
          }
          
          // Fallback: compare by content + sender + time (within 1 second)
          if (msg.content === message.content && 
              msg.sender_id?.toString() === message.sender_id?.toString() &&
              Math.abs(new Date(msg.created_at || msg.timestamp) - new Date(message.created_at || message.timestamp)) < 1000) {
            return true;
          }
          
          return false;
        });
        
        if (existingMessage) {
          console.log('🔄 Message already exists, skipping:', message.id || message.message_id);
          return prev;
        }
        
        const filteredMessages = prev.filter(msg => {
          // Remove temp messages that match this real message
          if (msg.status === 'sending' && 
              msg.sender_id?.toString() === message.sender_id?.toString() &&
              msg.content === message.content) {
            console.log('🗑️ Removing temp message:', msg.temp_id);
            return false;
          }
          return true;
        });
        
        // Add new message and sort by timestamp (oldest first)
        const newMessages = [...filteredMessages, message];
        console.log('🔄 Updating messages state with new message count:', newMessages.length);
        console.log('🔄 New message details:', { id: message.id, content: message.content.substring(0, 30), sender: message.sender_type });
        return newMessages.sort((a, b) => new Date(a.created_at || a.timestamp) - new Date(b.created_at || b.timestamp));
      });
      
      markRoomAsRead(roomId);
    } else {
      console.log('📨 Message for different room:', roomId, 'current room:', activeRoomRef.current?.room_id);
      // Update unread count
      setUnreadCounts(prev => ({
        ...prev,
        [roomId]: (prev[roomId] || 0) + 1
      }));
      
      // Show notification for agents - always show notification for new messages
      if (user?.role === 'agent' || user?.role === 'admin') {
        console.log('🔔 Showing notification for agent');
        toast.info(`💬 Tin nhắn mới từ ${message.sender_name || 'Khách hàng'} - Room: ${roomId.slice(0, 8)}...`);
      } else {
        toast.info(`Tin nhắn mới từ ${message.sender_name || 'Unknown'}`);
      }
    }
    
    // Update last message in room list
    setRooms(prev => prev.map(room => 
      room.room_id === roomId 
        ? { ...room, last_message: message, updated_at: message.created_at }
        : room
    ));
    
    // Force re-render by updating a timestamp
    setLastUpdateTime(Date.now());
  }, [user, markRoomAsRead]);

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

  const handleNewRoomCreated = useCallback((data) => {
    const { room } = data;
    
    // Only agents/admins should see notification for new rooms
    if (user?.role === 'agent' || user?.role === 'admin') {
      console.log('🔔 New room created for agent:', room);
      setRooms(prev => [room, ...prev]);
      toast.success(`Phòng chat mới từ ${room.customer_name}: ${room.subject}`);
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
      // Clear active room when it's closed via socket
      setActiveRoom(null);
      setMessages([]);
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
    // Socket data structure: {userId, userType, userName, timestamp, roomId}
    const { userName, userId, roomId } = data;
    
    if (activeRoom?.room_id === roomId) {
      toast.info(`${userName || userId || 'User'} đã tham gia cuộc trò chuyện`);
    }
  }, [activeRoom]);

  const handleUserLeft = useCallback((data) => {
    // Socket data structure: {userId, userType, userName, timestamp, roomId}  
    const { userName, userId, roomId } = data;
    
    if (activeRoom?.room_id === roomId) {
      toast.info(`${userName || userId || 'User'} đã rời cuộc trò chuyện`);
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
      console.log('🎯 Creating room - User authenticated:', isAuthenticated);
      console.log('👤 User data:', user);
      console.log('📝 Room data:', roomData);
      
      const response = await chatService.createRoom(roomData);
      
      if (response.success) {
        const newRoom = response.data.room;
        setRooms(prev => [newRoom, ...prev]);
        
        // Set as current room immediately
        setActiveRoom(newRoom);
        
        // Join the new room
        socketService.joinRoom(newRoom.room_id, user?.role || 'customer');
        
        toast.success('Tạo phòng chat thành công');
        return newRoom;
      }
    } catch (error) {
      console.error('Failed to create room:', error);
      const errorMsg = error.message || 'Không thể tạo phòng chat';
      toast.error(errorMsg);
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
        
        // Force enable socket connection state immediately
        console.log('🔌 Creating guest session and enabling chat immediately');
        setIsSocketConnected(true);
        
        // Connect socket as guest (async, don't wait)
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
      console.log('🎯 joinRoom called:', roomId);
      
      // Ensure socket is connected
      if (!socketService.socket?.connected) {
        console.log('🔌 Socket not connected, reconnecting...');
        if (user) {
          socketService.connect('user');
        } else if (isGuestMode) {
          socketService.connect('guest');
        }
        
        // Wait for connection with more attempts
        let attempts = 0;
        while (!socketService.socket?.connected && attempts < 50) {
          await new Promise(resolve => setTimeout(resolve, 200));
          attempts++;
          console.log(`🔄 Waiting for socket connection... attempt ${attempts}/50`);
        }
      }
      
      if (!socketService.socket?.connected) {
        console.error('❌ Socket connection failed for joinRoom after 50 attempts');
        // Don't throw error, just warn - continue without socket for now
        console.warn('⚠️ Continuing without socket connection');
      }
      
      const response = await chatService.getRoomDetails(roomId);
      
      if (response.success) {
        const room = response.data.room;
        setActiveRoom(room);
        console.log('✅ Set active room:', room.room_id);
        
        // Join socket room
        console.log('🚪 Attempting to join room via socket:', roomId);
        
        // Wait a bit more for socket to be fully ready
        let socketReady = false;
        let attempts = 0;
        while (!socketReady && attempts < 10) {
          // Check socket.connected directly instead of socketService.isConnected
          if (socketService.socket?.connected) {
            socketReady = true;
            break;
          }
          await new Promise(resolve => setTimeout(resolve, 200));
          attempts++;
          console.log(`🔄 Waiting for socket to be ready... attempt ${attempts}/10`);
        }
        
        if (socketReady) {
          socketService.joinRoom(roomId, user?.role || 'customer');
          console.log('✅ Successfully joined socket room:', roomId);
          
          // Test socket connection after joining
          setTimeout(async () => {
            if (socketService.testConnection) {
              const pingResult = await socketService.testConnection();
              console.log('🏓 Post-join ping test result:', pingResult);
            }
          }, 1000);
        } else {
          console.warn('⚠️ Socket not ready, will retry joining room later');
          // Retry joining room after a short delay
          setTimeout(() => {
            if (socketService.socket?.connected) {
              console.log('🔄 Retrying to join room:', roomId);
              socketService.joinRoom(roomId, user?.role || 'customer');
            }
          }, 2000);
        }
        
        // Load messages
        await loadMessages(roomId);
        
        // Clear typing users
        setTypingUsers([]);
        
        console.log('✅ Successfully joined room:', roomId);
        return room;
      }
    } catch (error) {
      console.error('❌ Failed to join room:', error);
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
    // Guest can send messages without activeRoom, but needs to create room first
    if (!activeRoom && !isGuestMode) return;

    console.log('📤 sendMessage called:', { content, activeRoom: activeRoom?.room_id, isGuestMode });

    // Ensure socket is connected before sending
    if (!socketService.socket?.connected) {
      console.log('🔌 Socket not connected, connecting...');
      if (user) {
        socketService.connect('user');
      } else if (isGuestMode) {
        socketService.connect('guest');
      }
      
      // Wait for connection
      let attempts = 0;
      while (!socketService.socket?.connected && attempts < 30) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
      
      if (!socketService.socket?.connected) {
        console.error('❌ Failed to connect socket');
        toast.error('Không thể kết nối. Vui lòng thử lại!');
        return;
      }
    }

    const tempId = `temp_${Date.now()}`;
    const tempMessage = {
      temp_id: tempId,
      content,
      message_type: messageType,
      sender_name: user?.full_name || guestSession?.customerName || 'Guest',
      sender_type: user ? 'user' : 'guest',
      sender_id: user?.user_id?.toString() || 'guest',
      created_at: new Date().toISOString(),
      timestamp: new Date().toISOString(),
      status: 'sending'
    };

    console.log('📝 Creating temp message:', tempMessage);

    // Add temp message to UI
    setMessages(prev => [...prev, tempMessage]);
    console.log('📤 Sending message:', { content, isGuestMode, guestSession: guestSession?.id, activeRoom: activeRoom?.room_id });

    try {
      let response;
      
      if (isGuestMode && guestSession) {
        // For guest: Connect socket if not connected
        if (!socketService.socket?.connected) {
          console.log('🔌 Connecting guest socket...');
          socketService.connect('guest');
          
          // Wait for socket connection
          let attempts = 0;
          while (!socketService.socket?.connected && attempts < 20) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
          }
          
          if (!socketService.socket?.connected) {
            console.warn('⚠️ Guest socket connection timeout');
          } else {
            console.log('✅ Guest socket connected successfully');
          }
        }
        
        // For guest: Create chat room first if doesn't exist
        if (!activeRoom) {
          console.log('🏗️ Guest creating chat room...');
          const roomResponse = await chatService.createRoom({
            customerName: guestSession.customerName,
            customerEmail: guestSession.customerEmail,
            subject: guestSession.subject || 'Guest Support Request',
            customerType: 'guest',
            priority: 'normal'
          });
          
          if (roomResponse.success) {
            const newRoom = roomResponse.data.room;
            setActiveRoom(newRoom);
            console.log('✅ Guest chat room created:', newRoom.room_id);
            
            // Join the room via socket
            if (socketService.socket?.connected) {
              socketService.joinRoom(newRoom.room_id);
            }
          }
        }
        
        // Now send message to the chat room via socket
        if (activeRoom && socketService.socket?.connected) {
          console.log('📤 Guest sending message via socket to room:', activeRoom.room_id);
          socketService.sendMessage(activeRoom.room_id, content, messageType);
          
          // Mark temp message as sent immediately
          setMessages(prev => prev.map(msg => 
            msg.temp_id === tempId ? { ...msg, status: 'sent' } : msg
          ));
        } else if (activeRoom) {
          console.warn('⚠️ Guest socket not connected, falling back to API');
          response = await chatService.sendMessage(activeRoom.room_id, {
            content,
            message_type: messageType
          });
        }
      } else if (activeRoom) {
        // Send as authenticated user via socket
        console.log('📤 Sending message via socket to room:', activeRoom.room_id);
        console.log('🔌 Socket connected?', socketService.socket?.connected);
        
        // Ensure user is in the room
        socketService.joinRoom(activeRoom.room_id, user?.role || 'customer');
        
        if (socketService.socket?.connected) {
          socketService.sendMessage(activeRoom.room_id, content, messageType);
          console.log('✅ Message sent via socket');
          
          // Mark temp message as sent immediately (will be replaced by real message from socket)
          setMessages(prev => prev.map(msg => 
            msg.temp_id === tempId ? { ...msg, status: 'sent' } : msg
          ));
        } else {
          console.warn('⚠️ Socket not connected, falling back to API');
          response = await chatService.sendMessage(activeRoom.room_id, {
            content,
            message_type: messageType
          });
        }
      }

      if (response && response.success) {
        const sentMessage = response.data.message;
        
        // Replace temp message with real message (only for API responses)
        setMessages(prev => prev.map(msg => 
          msg.temp_id === tempId ? { ...sentMessage, status: 'sent' } : msg
        ));

        console.log('✅ Message sent successfully via API, backend will emit socket event');
      } else if (!response) {
        // Message was sent via socket, will be handled by socket event
        console.log('✅ Message sent via socket, waiting for socket confirmation');
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

  const customerCloseRoom = async (roomId, options = {}) => {
    try {
      console.log('🎯 Customer closing room:', roomId, 'with options:', options);
      
      // Check authentication status
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
      console.log('🔐 Current token exists:', !!token);
      console.log('🔐 User authenticated:', !!user);
      console.log('🔐 Guest mode:', isGuestMode);
      
      const response = await chatService.customerCloseRoom(roomId, options);
      
      if (response.success) {
        toast.success('Đã kết thúc phiên chat');
        
        // Don't emit socket event here - let the backend handle it to avoid race conditions
        // socketService.closeRoom(roomId, options.reason || '');
        
        // If it's the active room, leave it
        if (activeRoom?.room_id === roomId || activeRoom?.id === roomId) {
          setActiveRoom(null);
          setMessages([]);
        }
        
        // Refresh rooms to update status
        await refreshRooms();
        
        return response.data;
      }
    } catch (error) {
      console.error('❌ Failed to close room as customer. Full error details:');
      console.error('❌ Error object:', error);
      console.error('❌ Error message:', error?.message);
      console.error('❌ Error response:', error?.response);
      console.error('❌ Error response data:', error?.response?.data);
      console.error('❌ Error status:', error?.response?.status);
      
      // Check if it's a "room already closed" error
      if (error?.message?.includes('already closed') || 
          error?.response?.data?.message?.includes('already closed') ||
          error?.originalError?.response?.data?.message?.includes('already closed') ||
          (error?.status === 400 && error?.message?.includes('already closed'))) {
        console.log('📝 Room already closed, treating as success');
        toast.info('Phiên chat đã được kết thúc');
        
        // Still clean up the UI
        if (activeRoom?.room_id === roomId || activeRoom?.id === roomId) {
          setActiveRoom(null);
          setMessages([]);
        }
        
        await refreshRooms();
        return { roomId, status: 'closed' };
      }
      
      // For other errors, still show a message but don't fail completely
      const errorMessage = error?.message || 
                          error?.response?.data?.message || 
                          error?.originalError?.response?.data?.message || 
                          'Unknown error';
      console.log('🔧 Error is not "already closed", message:', errorMessage);
      toast.error(`Có lỗi xảy ra: ${errorMessage}`);
      throw error;
    }
  };

  const refreshRooms = useCallback(async () => {
    if (user?.role === 'agent' || user?.role === 'admin') {
      await loadAgentRooms();
    } else {
      await loadCustomerRooms();
    }
  }, [user?.role]); // 🔧 Memoized to prevent infinite re-renders

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

  const connectGuestSocket = () => {
    if (isGuestMode && guestSession && !isSocketConnected) {
      console.log('🔌 Connecting guest socket...', { guestSession: guestSession.id });
      socketService.connect('guest');
    } else {
      console.log('🔌 Guest socket already connected or not ready:', { 
        isGuestMode, 
        hasGuestSession: !!guestSession, 
        isSocketConnected 
      });
    }
  };

  const uploadFile = async (roomId, file) => {
    try {
      setIsLoading(true);
      
      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error('File quá lớn. Kích thước tối đa là 10MB.');
      }

      // Validate file type
      const allowedTypes = [
        'image/jpeg',
        'image/png', 
        'image/gif',
        'image/webp',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];

      if (!allowedTypes.includes(file.type)) {
        throw new Error('Loại file không được hỗ trợ.');
      }

      // Upload file
      const response = await fileService.uploadFile(roomId, file);
      
      if (response.success) {
        console.log('✅ File upload response received:', {
          success: response.success,
          fileName: response.data?.file?.original_name,
          messageId: response.data?.message?.message_id,
          roomId: roomId
        });
        
        // Ensure we are still in the room for real-time updates
        if (activeRoom?.room_id === roomId) {
          console.log('🔄 Ensuring socket connection for real-time updates...');
          
          // Check and reconnect socket if needed
          if (!socketService.socket?.connected) {
            console.log('🔌 Reconnecting socket for real-time updates...');
            if (user) {
              socketService.connect('user');
            } else if (isGuestMode) {
              socketService.connect('guest');
            }
            
            // Wait a bit for connection
            setTimeout(() => {
              if (socketService.socket?.connected) {
                console.log('🚪 Re-joining room after reconnection:', roomId);
                socketService.joinRoom(roomId, user?.role || 'customer');
              }
            }, 1000);
          } else {
            console.log('🔄 Re-joining room to ensure real-time updates:', roomId);
            socketService.joinRoom(roomId, user?.role || 'customer');
          }
        }
        
        toast.success('Upload file thành công!');
        
        // The file message should be handled by socket event 'new_message'
        // But as a fallback, reload messages after a short delay if socket doesn't work
        setTimeout(async () => {
          if (activeRoom?.room_id === roomId) {
            console.log('🔄 Fallback: Reloading messages to ensure file appears');
            await loadMessages(roomId, 1);
          }
        }, 2000);
        
        return response.data;
      } else {
        throw new Error(response.message || 'Upload file thất bại');
      }
    } catch (error) {
      console.error('Upload file error:', error);
      const errorMessage = error.message || 'Không thể upload file';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
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
    isConnected: isSocketConnected, // Alias for compatibility
    lastUpdateTime, // Add this for forcing re-renders
    
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
    customerCloseRoom,
    markRoomAsRead,
    refreshRooms,
    loadMessages,
    endGuestSession,
    connectGuestSocket,
    uploadFile,
    
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

export default ChatProvider;
