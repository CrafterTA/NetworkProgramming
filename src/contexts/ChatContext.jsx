import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useAuth } from './AuthContext';

// Mock data for testing
const MOCK_ROOMS = [
  {
    id: 'room_001',
    customer: {
      name: 'Nguyễn Văn Minh',
      email: 'minh.nguyen@student.hutech.edu.vn',
      phone: '0912345678',
      type: 'student'
    },
    subject: 'Hỗ trợ đăng ký học phần',
    status: 'waiting',
    priority: 'normal',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 minutes ago
    messageCount: 3,
    duration: '15 phút',
    fileCount: 1,
    lastMessage: {
      content: 'Em cần hướng dẫn đăng ký học phần môn Lập trình Web ạ',
      type: 'text',
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString()
    },
    unreadCount: 2
  },
  {
    id: 'room_002', 
    customer: {
      name: 'Trần Thị Lan',
      email: 'lan.tran@gmail.com',
      phone: '0987654321',
      type: 'guest'
    },
    subject: 'Tư vấn chương trình đào tạo',
    status: 'active',
    priority: 'high',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
    messageCount: 8,
    duration: '25 phút',
    fileCount: 2,
    lastMessage: {
      content: 'Cảm ơn anh đã tư vấn chi tiết',
      type: 'text',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString()
    },
    unreadCount: 0
  },
  {
    id: 'room_003',
    customer: {
      name: 'Lê Hoàng Nam',
      email: 'nam.le@student.hutech.edu.vn',
      phone: '0901112233',
      type: 'student'
    },
    subject: 'Vấn đề đăng nhập hệ thống',
    status: 'closed',
    priority: 'urgent',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    messageCount: 12,
    duration: '45 phút',
    fileCount: 0,
    lastMessage: {
      content: 'Vấn đề đã được giải quyết. Cảm ơn bạn!',
      type: 'text',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    unreadCount: 0
  },
  {
    id: 'room_004',
    customer: {
      name: 'Phạm Thị Hoa',
      email: 'hoa.pham@outlook.com',
      phone: '0933445566',
      type: 'guest'
    },
    subject: 'Thông tin học phí',
    status: 'waiting',
    priority: 'normal',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    messageCount: 1,
    duration: '2 phút',
    fileCount: 0,
    lastMessage: {
      content: 'Xin chào, tôi muốn biết thông tin về học phí các ngành học',
      type: 'text',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    },
    unreadCount: 1
  }
];

const MOCK_MESSAGES = {
  'room_001': [
    {
      id: 'msg_001',
      content: 'Xin chào em! Tôi là nhân viên hỗ trợ của HUTECH. Tôi có thể giúp gì cho em?',
      type: 'text',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      sender: { id: 1, name: 'Agent', role: 'agent' },
      room_id: 'room_001',
      status: 'read'
    },
    {
      id: 'msg_002',
      content: 'Em chào anh ạ. Em cần hướng dẫn cách đăng ký học phần ạ',
      type: 'text',
      timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
      sender: { name: 'Nguyễn Văn Minh', role: 'student' },
      room_id: 'room_001',
      status: 'delivered'
    },
    {
      id: 'msg_003',
      content: 'Em cần hướng dẫn đăng ký học phần môn Lập trình Web ạ',
      type: 'text',
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      sender: { name: 'Nguyễn Văn Minh', role: 'student' },
      room_id: 'room_001',
      status: 'sent'
    }
  ],
  'room_002': [
    {
      id: 'msg_004',
      content: 'Chào chị! Tôi có thể tư vấn cho chị về các chương trình đào tạo tại HUTECH.',
      type: 'text',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      sender: { id: 1, name: 'Agent', role: 'agent' },
      room_id: 'room_002',
      status: 'read'
    },
    {
      id: 'msg_005',
      content: 'Em muốn tìm hiểu về ngành Công nghệ thông tin ạ',
      type: 'text',
      timestamp: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
      sender: { name: 'Trần Thị Lan', role: 'guest' },
      room_id: 'room_002',
      status: 'read'
    },
    {
      id: 'msg_006',
      content: 'Ngành CNTT tại HUTECH có 3 chuyên ngành chính: Công nghệ phần mềm, Hệ thống thông tin, và Khoa học máy tính. Chị quan tâm đến chuyên ngành nào?',
      type: 'text',
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      sender: { id: 1, name: 'Agent', role: 'agent' },
      room_id: 'room_002',
      status: 'read'
    },
    {
      id: 'msg_007',
      content: 'Em quan tâm đến Công nghệ phần mềm ạ. Chương trình học như thế nào?',
      type: 'text',
      timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
      sender: { name: 'Trần Thị Lan', role: 'guest' },
      room_id: 'room_002',
      status: 'read'
    },
    {
      id: 'msg_008',
      content: 'Chuyên ngành Công nghệ phần mềm tập trung vào lập trình, phát triển ứng dụng, quản lý dự án phần mềm. Thời gian học 4 năm với nhiều project thực tế.',
      type: 'text',
      timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
      sender: { id: 1, name: 'Agent', role: 'agent' },
      room_id: 'room_002',
      status: 'read'
    },
    {
      id: 'msg_009',
      content: 'Cảm ơn anh đã tư vấn chi tiết',
      type: 'text',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      sender: { name: 'Trần Thị Lan', role: 'guest' },
      room_id: 'room_002',
      status: 'delivered'
    }
  ],
  'room_003': [
    {
      id: 'msg_010',
      content: 'Xin chào! Tôi thấy bạn gặp vấn đề với việc đăng nhập hệ thống. Có thể mô tả chi tiết lỗi không?',
      type: 'text',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      sender: { id: 1, name: 'Agent', role: 'agent' },
      room_id: 'room_003',
      status: 'read'
    },
    {
      id: 'msg_011',
      content: 'Em nhập đúng email và mật khẩu nhưng cứ báo "Thông tin đăng nhập không chính xác"',
      type: 'text',
      timestamp: new Date(Date.now() - 3.5 * 60 * 60 * 1000).toISOString(),
      sender: { name: 'Lê Hoàng Nam', role: 'student' },
      room_id: 'room_003',
      status: 'read'
    },
    {
      id: 'msg_012',
      content: 'Bạn thử reset mật khẩu qua email xem. Tôi sẽ gửi link hướng dẫn.',
      type: 'text',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      sender: { id: 1, name: 'Agent', role: 'agent' },
      room_id: 'room_003',
      status: 'read'
    },
    {
      id: 'msg_013',
      content: 'Em đã thử reset rồi ạ, vẫn không được',
      type: 'text',
      timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
      sender: { name: 'Lê Hoàng Nam', role: 'student' },
      room_id: 'room_003',
      status: 'read'
    },
    {
      id: 'msg_014',
      content: 'Vậy tôi sẽ kiểm tra tài khoản của bạn trực tiếp trong hệ thống. Đợi 5 phút nhé.',
      type: 'text',
      timestamp: new Date(Date.now() - 2.2 * 60 * 60 * 1000).toISOString(),
      sender: { id: 1, name: 'Agent', role: 'agent' },
      room_id: 'room_003',
      status: 'read'
    },
    {
      id: 'msg_015',
      content: 'Tôi đã cập nhật lại tài khoản. Bạn thử đăng nhập lại xem.',
      type: 'text',
      timestamp: new Date(Date.now() - 2.1 * 60 * 60 * 1000).toISOString(),
      sender: { id: 1, name: 'Agent', role: 'agent' },
      room_id: 'room_003',
      status: 'read'
    },
    {
      id: 'msg_016',
      content: 'Được rồi ạ! Cảm ơn anh nhiều. Vấn đề đã được giải quyết.',
      type: 'text',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      sender: { name: 'Lê Hoàng Nam', role: 'student' },
      room_id: 'room_003',
      status: 'read'
    }
  ],
  'room_004': [
    {
      id: 'msg_017',
      content: 'Xin chào, tôi muốn biết thông tin về học phí các ngành học',
      type: 'text',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      sender: { name: 'Phạm Thị Hoa', role: 'guest' },
      room_id: 'room_004',
      status: 'sent'
    }
  ]
};

const MOCK_ONLINE_AGENTS = [
  {
    id: 1,
    name: 'Nguyễn Văn An',
    avatar: null,
    status: 'online',
    activeRooms: 2
  },
  {
    id: 2, 
    name: 'Trần Thị Bình',
    avatar: null,
    status: 'busy',
    activeRooms: 3
  },
  {
    id: 3,
    name: 'Lê Văn Cường',
    avatar: null,
    status: 'online',
    activeRooms: 1
  }
];

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
  const [onlineAgents, setOnlineAgents] = useState(MOCK_ONLINE_AGENTS);
  const [notifications, setNotifications] = useState([]);
  const [typing, setTyping] = useState(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  // Initialize mock data for agents
  useEffect(() => {
    if (isAuthenticated() && user && (user.Role === 'agent' || user.Role === 'admin')) {
      // Simulate loading mock rooms
      setTimeout(() => {
        setActiveRooms(MOCK_ROOMS);
        setIsConnected(true);
        
        // Auto-select first room and load its messages
        if (MOCK_ROOMS.length > 0) {
          const firstRoom = MOCK_ROOMS[0];
          setCurrentRoom(firstRoom);
          const roomMessages = MOCK_MESSAGES[firstRoom.id] || [];
          setMessages(roomMessages);
          console.log(`Auto-selected first room: ${firstRoom.id}, loaded ${roomMessages.length} messages:`, roomMessages);
        }
        
        // Show welcome notification
        setNotifications([{
          id: Date.now(),
          type: 'info',
          title: 'Kết nối thành công',
          message: `Chào mừng ${user.FullName} đến với Agent Dashboard!`,
          timestamp: new Date().toISOString()
        }]);
      }, 1000);
    }
  }, [user, isAuthenticated]);

  // Kết nối WebSocket
  const connectWebSocket = () => {
    if (!isAuthenticated()) return;
    
    // Mock WebSocket connection for agents
    if (user && (user.Role === 'agent' || user.Role === 'admin')) {
      console.log('Mock WebSocket connected for agent:', user.FullName);
      setIsConnected(true);
      return;
    }

    if (socket?.readyState === WebSocket.OPEN) return;

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
    // Mock send message for agents
    if (user && (user.Role === 'agent' || user.Role === 'admin') && currentRoom) {
      const newMessage = {
        id: `msg_${Date.now()}`,
        content,
        type,
        timestamp: new Date().toISOString(),
        sender: { 
          id: user.UserID, 
          name: user.FullName, 
          role: user.Role 
        },
        room_id: currentRoom.id,
        status: 'sent',
        fileData
      };

      // Add message to current messages
      setMessages(prev => [...prev, newMessage]);

      // Update room's last message and timestamp
      const updatedRooms = activeRooms.map(room => 
        room.id === currentRoom.id 
          ? {
              ...room,
              lastMessage: {
                content: type === 'file' ? `📎 ${fileData?.name || 'File đính kèm'}` : content,
                type,
                timestamp: newMessage.timestamp
              },
              updatedAt: newMessage.timestamp,
              messageCount: room.messageCount + 1
            }
          : room
      );
      setActiveRooms(updatedRooms);

      console.log('Mock message sent:', newMessage);
      
      // Simulate message status updates
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
        ));
      }, 1000);

      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'read' } : msg
        ));
      }, 2000);

      return;
    }

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
    // Mock join room for agents
    if (user && (user.Role === 'agent' || user.Role === 'admin')) {
      const room = MOCK_ROOMS.find(r => r.id === roomId);
      if (room) {
        setCurrentRoom(room);
        // Load mock messages for this room
        const roomMessages = MOCK_MESSAGES[roomId] || [];
        setMessages(roomMessages);
        
        // Mark messages as read
        if (room.unreadCount > 0) {
          const updatedRooms = activeRooms.map(r => 
            r.id === roomId ? { ...r, unreadCount: 0 } : r
          );
          setActiveRooms(updatedRooms);
        }
        
        console.log(`Mock joined room: ${roomId}, loaded ${roomMessages.length} messages:`, roomMessages);
      }
      return;
    }

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
    // Mock leave room for agents
    if (user && (user.Role === 'agent' || user.Role === 'admin')) {
      setCurrentRoom(null);
      setMessages([]);
      console.log(`Mock left room: ${roomId}`);
      return;
    }

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
    // Mock typing for agents
    if (user && (user.Role === 'agent' || user.Role === 'admin')) {
      console.log(`Mock typing: ${isTyping} in room: ${currentRoom?.id}`);
      return;
    }

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

  // Tạo guest session (Mock version cho testing)
  const createGuestSession = async (guestInfo) => {
    try {
      // Mock API call - thay thế bằng real API sau
      console.log('Creating guest session with info:', guestInfo);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock response data
      const mockResponse = {
        sessionId: `guest_${Date.now()}`,
        ticketId: `ticket_${Date.now()}`,
        status: 'success'
      };
      
      // Lưu thông tin guest session
      localStorage.setItem('guestSession', JSON.stringify({
        sessionId: mockResponse.sessionId,
        ticketId: mockResponse.ticketId,
        guestInfo: guestInfo,
        createdAt: new Date().toISOString()
      }));

      // Mock kết nối WebSocket
      console.log('Mock WebSocket connection for guest:', mockResponse.sessionId);
      setIsConnected(true);
      
      // Mock tạo room cho guest
      const mockRoom = {
        id: mockResponse.ticketId,
        customer: {
          name: guestInfo.fullName,
          email: guestInfo.email,
          phone: guestInfo.phone
        },
        subject: guestInfo.subject,
        status: 'waiting',
        createdAt: new Date().toISOString(),
        messages: []
      };
      
      setActiveRooms([mockRoom]);
      setCurrentRoom(mockRoom);
      
      // Mock welcome message
      const welcomeMessage = {
        id: `msg_${Date.now()}`,
        type: 'system',
        content: `Xin chào ${guestInfo.fullName}! Cảm ơn bạn đã liên hệ với HUTECH Support. Chúng tôi sẽ kết nối bạn với nhân viên hỗ trợ sớm nhất có thể.`,
        timestamp: new Date().toISOString(),
        sender: { name: 'System' }
      };
      
      setMessages([welcomeMessage]);
      
      return mockResponse;
    } catch (error) {
      console.error('Error creating guest session:', error);
      throw new Error('Không thể tạo phiên hỗ trợ. Vui lòng thử lại sau.');
    }
  };

  // Kết nối WebSocket cho guest
  const connectWebSocketGuest = (sessionId) => {
    try {
      const ws = new WebSocket(`ws://localhost:8000/ws/chat/guest/${sessionId}`);
      
      ws.onopen = () => {
        console.log('Guest WebSocket connected');
        setSocket(ws);
        setIsConnected(true);
        reconnectAttempts.current = 0;
      };

      ws.onmessage = (event) => {
        handleWebSocketMessage(JSON.parse(event.data));
      };

      ws.onclose = () => {
        console.log('Guest WebSocket disconnected');
        setIsConnected(false);
        handleReconnectGuest(sessionId);
      };

      ws.onerror = (error) => {
        console.error('Guest WebSocket error:', error);
        setIsConnected(false);
      };

    } catch (error) {
      console.error('Failed to connect guest WebSocket:', error);
    }
  };

  // Xử lý reconnect cho guest
  const handleReconnectGuest = (sessionId) => {
    if (reconnectAttempts.current < maxReconnectAttempts) {
      setTimeout(() => {
        reconnectAttempts.current++;
        console.log(`Guest reconnect attempt ${reconnectAttempts.current}`);
        connectWebSocketGuest(sessionId);
      }, Math.pow(2, reconnectAttempts.current) * 1000);
    }
  };

  const value = {
    // State
    socket,
    isConnected,
    messages,
    activeRooms,
    currentRoom,
    onlineAgents,
    notifications,
    typing,
    rooms: activeRooms,
    
    // Actions
    sendMessage,
    joinRoom,
    createRoom,
    leaveRoom,
    sendTyping,
    uploadFile,
    submitRating,
    removeNotification,
    createGuestSession,
    
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
