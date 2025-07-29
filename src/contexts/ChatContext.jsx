import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [activeRooms, setActiveRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [onlineAgents, setOnlineAgents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [typing, setTyping] = useState(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  // Kết nối WebSocket
  const connectWebSocket = () => {
    if (!isAuthenticated() || socket?.readyState === WebSocket.OPEN) return;

    try {
      const wsUrl = `ws://localhost:8000/ws/chat/${user?.UserID}`;
      const newSocket = new WebSocket(wsUrl);

      newSocket.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setSocket(newSocket);
        reconnectAttempts.current = 0;
        
        // Gửi thông tin xác thực
        newSocket.send(JSON.stringify({
          type: 'auth',
          token: localStorage.getItem('authToken'),
          userInfo: user
        }));
      };

      newSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
      };

      newSocket.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        setSocket(null);
        
        // Tự động kết nối lại
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          setTimeout(() => {
            connectWebSocket();
          }, 2000 * reconnectAttempts.current);
        }
      };

      newSocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };

    } catch (error) {
      console.error('WebSocket connection error:', error);
    }
  };

  // Xử lý tin nhắn WebSocket
  const handleWebSocketMessage = (data) => {
    switch (data.type) {
      case 'message':
        setMessages(prev => [...prev, data.message]);
        break;
      
      case 'room_joined':
        setCurrentRoom(data.room);
        setMessages(data.messages || []);
        break;
      
      case 'room_list':
        setActiveRooms(data.rooms);
        break;
      
      case 'agent_status':
        setOnlineAgents(data.agents);
        break;
      
      case 'notification':
        setNotifications(prev => [
          ...prev,
          { ...data.notification, id: Date.now() }
        ]);
        break;
      
      case 'typing':
        setTyping(data.typing ? data.user : null);
        break;
      
      case 'file_uploaded':
        setMessages(prev => [...prev, data.message]);
        break;
      
      default:
        console.log('Unknown message type:', data.type);
    }
  };

  // Gửi tin nhắn
  const sendMessage = (content, type = 'text', fileData = null) => {
    if (!socket || !currentRoom) return;

    const message = {
      type: 'send_message',
      room_id: currentRoom.id,
      content,
      message_type: type,
      file_data: fileData,
      timestamp: new Date().toISOString()
    };

    socket.send(JSON.stringify(message));
  };

  // Tham gia phòng chat
  const joinRoom = (roomId) => {
    if (!socket) return;

    socket.send(JSON.stringify({
      type: 'join_room',
      room_id: roomId
    }));
  };

  // Tạo phòng chat mới
  const createRoom = (agentId = null, priority = 'normal') => {
    if (!socket) return;

    socket.send(JSON.stringify({
      type: 'create_room',
      agent_id: agentId,
      priority,
      user_info: {
        name: user?.FullName,
        email: user?.Email,
        role: user?.Role
      }
    }));
  };

  // Rời phòng chat
  const leaveRoom = (roomId) => {
    if (!socket) return;

    socket.send(JSON.stringify({
      type: 'leave_room',
      room_id: roomId
    }));
    
    setCurrentRoom(null);
    setMessages([]);
  };

  // Gửi trạng thái typing
  const sendTyping = (isTyping) => {
    if (!socket || !currentRoom) return;

    socket.send(JSON.stringify({
      type: 'typing',
      room_id: currentRoom.id,
      is_typing: isTyping
    }));
  };

  // Upload file
  const uploadFile = (file) => {
    if (!socket || !currentRoom) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const fileData = {
        name: file.name,
        size: file.size,
        type: file.type,
        data: e.target.result
      };

      socket.send(JSON.stringify({
        type: 'upload_file',
        room_id: currentRoom.id,
        file_data: fileData
      }));
    };
    reader.readAsDataURL(file);
  };

  // Đánh giá chất lượng hỗ trợ
  const submitRating = (roomId, rating, feedback = '') => {
    if (!socket) return;

    socket.send(JSON.stringify({
      type: 'submit_rating',
      room_id: roomId,
      rating,
      feedback
    }));
  };

  // Xóa thông báo
  const removeNotification = (notificationId) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  // Kết nối khi có user
  useEffect(() => {
    if (isAuthenticated() && user) {
      connectWebSocket();
    }

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [user, isAuthenticated]);

  // Cleanup khi unmount
  useEffect(() => {
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [socket]);

  const value = {
    // Connection state
    socket,
    isConnected,
    
    // Chat data
    messages,
    activeRooms,
    currentRoom,
    onlineAgents,
    notifications,
    typing,
    
    // Actions
    sendMessage,
    joinRoom,
    createRoom,
    leaveRoom,
    sendTyping,
    uploadFile,
    submitRating,
    removeNotification,
    
    // Utils
    connectWebSocket
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
