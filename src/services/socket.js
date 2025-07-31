import { io } from 'socket.io-client';
import Cookies from 'js-cookie';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect(userType = 'user') {
    if (this.socket?.connected) {
      console.log('🟢 Socket already connected, reusing connection');
      return this.socket;
    }

    // Disconnect existing socket if any
    if (this.socket) {
      console.log('🔄 Disconnecting existing socket before reconnection');
      this.socket.disconnect();
    }

    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    
    // Prepare auth data
    const token = Cookies.get('accessToken') || localStorage.getItem('accessToken');
    const guestId = localStorage.getItem('guestId');
    
    let auth = {};
    if (token) {
      auth = { token };
    } else if (guestId) {
      auth = { isGuest: true, guestId };
    }

    console.log('🔌 Creating new socket connection to:', SOCKET_URL);

    // Create socket connection
    this.socket = io(SOCKET_URL, {
      auth,
      transports: ['websocket', 'polling'],
      timeout: 20000,
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      forceNew: true, // Force new connection
    });

    this.setupEventListeners();
    return this.socket;
  }

  setupEventListeners() {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('🟢 Socket connected:', this.socket.id || 'pending');
      console.log('🔗 Socket transport:', this.socket.io.engine.transport.name);
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      // Additional verification
      console.log('🔍 Connection verification:', {
        isConnected: this.isConnected,
        socketConnected: this.socket.connected,
        socketId: this.socket.id
      });
      
      this.emit('socket_connected', { socketId: this.socket.id });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔴 Socket disconnected:', reason);
      this.isConnected = false;
      this.emit('socket_disconnected', { reason });
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
      this.reconnectAttempts++;
      this.emit('socket_error', { error, attempts: this.reconnectAttempts });
    });

    // Chat events
    this.socket.on('new_message', (data) => {
      console.log('📩 New message received via socket:', {
        roomId: data.roomId,
        messageType: data.message?.message_type,
        hasFile: !!data.message?.file,
        sender: data.message?.sender_name
      });
      this.emit('new_message', data);
    });

    // File upload fallback event
    this.socket.on('file_uploaded', (data) => {
      console.log('📁 File uploaded event received:', data);
      this.emit('file_uploaded', data);
    });

    this.socket.on('message_sent', (data) => {
      console.log('✅ Message sent confirmation:', data);
      this.emit('message_sent', data);
    });

    this.socket.on('user_typing', (data) => {
      this.emit('user_typing', data);
    });

    this.socket.on('user_joined', (data) => {
      console.log('👋 User joined room:', data);
      this.emit('user_joined', data);
    });

    this.socket.on('user_left', (data) => {
      console.log('👋 User left room:', data);
      this.emit('user_left', data);
    });

    // Room events
    this.socket.on('room_created', (data) => {
      console.log('🏠 Room created:', data);
      this.emit('room_created', data);
    });

    this.socket.on('new_room_created', (data) => {
      console.log('🆕 New room created:', data);
      this.emit('new_room_created', data);
    });

    this.socket.on('room_updated', (data) => {
      console.log('🔄 Room updated:', data);
      this.emit('room_updated', data);
    });

    this.socket.on('room_closed', (data) => {
      console.log('🚪 Room closed:', data);
      this.emit('room_closed', data);
    });

    this.socket.on('agent_assigned', (data) => {
      console.log('👩‍💼 Agent assigned:', data);
      this.emit('agent_assigned', data);
    });

    // Notification events
    this.socket.on('new_notification', (data) => {
      console.log('🔔 New notification:', data);
      this.emit('new_notification', data);
    });

    // Agent events
    this.socket.on('agent_status_changed', (data) => {
      console.log('🟡 Agent status changed:', data);
      this.emit('agent_status_changed', data);
    });

    // Error events
    this.socket.on('error', (error) => {
      console.error('💥 Socket error:', error);
      this.emit('socket_error', error);
    });

    this.socket.on('unauthorized', (error) => {
      console.error('🚫 Socket unauthorized:', error);
      this.emit('unauthorized', error);
    });
  }

  // Event management
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} listener:`, error);
        }
      });
    }
  }

  // Room management
  joinRoom(roomId, userType = 'user') {
    console.log(`🚪 Attempting to join room: ${roomId} as ${userType}`);
    console.log(`🔍 Socket state check:`, {
      hasSocket: !!this.socket,
      isConnected: this.isConnected,
      socketConnected: this.socket?.connected,
      socketId: this.socket?.id
    });

    if (!this.socket) {
      console.warn('❌ No socket instance available');
      return;
    }

    // Use socket.connected instead of this.isConnected since it's more reliable
    if (!this.socket.connected) {
      console.warn('❌ Socket not connected, current state:', this.socket.connected);
      return;
    }

    console.log(`🚪 Joining room: ${roomId} as ${userType}`);
    this.socket.emit('join_room', { roomId, userType }, (data) => {
      if (data?.success) {
        console.log(`✅ Successfully joined room: ${roomId}`);
      } else {
        console.error('Failed to join room:', data?.message);
      }
    });
  }

  leaveRoom(roomId) {
    if (!this.socket || !this.socket.connected) {
      console.warn('Cannot leave room: Socket not connected');
      return;
    }

    console.log(`🚪 Leaving room: ${roomId}`);
    this.socket.emit('leave_room', { roomId });
  }

  // Message management
  sendMessage(roomId, content, messageType = 'text') {
    if (!this.socket?.connected) {
      console.warn('⚠️ Socket not connected, cannot send message');
      return false;
    }

    const messageData = {
      roomId,
      content,
      type: messageType,
      timestamp: new Date().toISOString()
    };

    console.log('📤 Sending message:', messageData);
    this.socket.emit('send_message', messageData);
    return true;
  }

  // Typing indicators
  startTyping(roomId) {
    if (!this.socket?.connected) return false;
    
    this.socket.emit('typing_start', { roomId });
    return true;
  }

  stopTyping(roomId) {
    if (!this.socket?.connected) return false;
    
    this.socket.emit('typing_stop', { roomId });
    return true;
  }

  // Agent status
  updateAgentStatus(status) {
    if (!this.socket?.connected) return false;
    
    console.log(`🟡 Updating agent status: ${status}`);
    this.socket.emit('agent_status_update', { status });
    return true;
  }

  // Room actions
  createRoom(roomData) {
    if (!this.socket?.connected) return false;
    
    console.log('🏠 Creating room:', roomData);
    this.socket.emit('create_room', roomData);
    return true;
  }

  assignAgent(roomId, agentId) {
    if (!this.socket?.connected) return false;
    
    console.log(`👩‍💼 Assigning agent ${agentId} to room ${roomId}`);
    this.socket.emit('assign_agent', { roomId, agentId });
    return true;
  }

  closeRoom(roomId, reason = '') {
    if (!this.socket?.connected) return false;
    
    console.log(`🚪 Closing room ${roomId}:`, reason);
    this.socket.emit('close_room', { roomId, reason });
    return true;
  }

  // Connection management
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Test connectivity method
  testConnection() {
    return new Promise((resolve) => {
      if (!this.socket || !this.socket.connected) {
        console.log('🔍 Socket test: Not connected');
        resolve(false);
        return;
      }
      
      console.log('🔍 Socket test: Connected, testing ping...');
      const startTime = Date.now();
      
      this.socket.emit('ping', { timestamp: startTime }, (response) => {
        const endTime = Date.now();
        const latency = endTime - startTime;
        
        console.log('🏓 Socket test: Ping response received:', response);
        console.log(`⚡ Socket test: Latency ${latency}ms`);
        
        resolve(response?.success === true);
      });

      // Timeout fallback
      setTimeout(() => {
        console.log('❌ Socket test: Ping timeout');
        resolve(false);
      }, 5000);
    });
  }

  reconnect() {
    if (this.socket && !this.socket.connected) {
      console.log('🔄 Attempting to reconnect socket');
      this.socket.connect();
    }
  }

  // Utility methods
  isSocketConnected() {
    return this.socket?.connected || false;
  }

  getSocketId() {
    return this.socket?.id || null;
  }

  // Guest session methods
  joinGuestSession(sessionId, roomId) {
    if (!this.socket?.connected) return false;
    
    console.log(`🎭 Joining guest session: ${sessionId} in room: ${roomId}`);
    this.socket.emit('join_guest_session', { sessionId, roomId });
    return true;
  }

  sendGuestMessage(sessionId, roomId, content) {
    if (!this.socket?.connected) return false;
    
    const messageData = {
      sessionId,
      roomId,
      content,
      senderType: 'guest',
      timestamp: new Date().toISOString()
    };

    console.log('📤 Sending guest message:', messageData);
    this.socket.emit('send_guest_message', messageData);
    return true;
  }

  // Connection status check
  isConnected() {
    return this.socket?.connected === true;
  }

  // Batch operations
  joinMultipleRooms(roomIds, userType = 'agent') {
    if (!this.socket?.connected) return false;
    
    console.log(`🚪 Joining multiple rooms:`, roomIds);
    roomIds.forEach(roomId => {
      this.joinRoom(roomId, userType);
    });
    return true;
  }

  // Debug methods
  getListeners() {
    return Array.from(this.listeners.keys());
  }

  clearAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }
}

// Create and export singleton instance
const socketService = new SocketService();

export default socketService;

// Export class for testing
export { SocketService };
