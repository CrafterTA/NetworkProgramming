import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ChatHeader from './ChatHeader';
import RoomList from './RoomList';
// import FileUpload from './FileUpload';
// import RatingModal from './RatingModal';

const ChatWindow = ({ onClose }) => {
  const [view, setView] = useState('chat'); // 'chat', 'rooms', 'agents'
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  
  const {
    messages,
    activeRoom: currentRoom, // Map activeRoom to currentRoom for compatibility
    activeRooms,
    onlineAgents,
    isConnected,
    createRoom,
    joinRoom,
    leaveRoom,
    typing,
    guestSession,
    isGuestMode,
    connectGuestSocket,
    lastUpdateTime
  } = useChat();
  
  const { user, isAuthenticated } = useAuth();
  const messagesEndRef = useRef(null);

  // Scroll to bottom khi có tin nhắn mới
  useEffect(() => {
    // Delay scroll để đảm bảo DOM đã được update
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end' 
      });
    }
  };

  // Xử lý drag & drop file
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setShowFileUpload(true);
    }
  };

  // Tạo phòng chat mới hoặc sử dụng guest session
    const handleCreateRoom = (priority = 'normal', agentId = null) => {
    if (isGuestMode && guestSession) {
      connectGuestSocket();
      setView('chat');
      return;
    }
    
    if (isAuthenticated && user) {
      // Check if user already has an active room in the activeRooms list
      const existingRoom = activeRooms?.find(room => 
        room.customer_email === user.email && 
        room.status !== 'closed'
      );
      
      if (existingRoom) {
        console.log('📋 User already has active room:', existingRoom.room_id);
        joinRoom(existingRoom.room_id); // Join the existing room
        setView('chat');
        return;
      }
      
      // Create new room only if no active room exists
      const roomData = {
        customerName: user.full_name,
        customerEmail: user.email,
        customerPhone: user.phone || '',
        subject: 'Cần hỗ trợ',
        customerType: user.role || 'student',
        priority: priority || 'normal',
        agentId
      };
      console.log('🆕 Creating new room - Room data:', roomData);
      createRoom(roomData);
      setView('chat');
    } else {
      // Chưa authenticated và không có guest session
      console.warn('⚠️ Cannot create room - no authentication or guest session');
    }
  };

  // Chuyển đổi phòng chat
  const handleRoomSwitch = (room) => {
    joinRoom(room.id);
    setView('chat');
  };

  // Kết thúc chat và đánh giá
  const handleEndChat = () => {
    if (currentRoom) {
      setShowRating(true);
    }
  };

  return (
    <div 
      className={`chat-window ${dragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Chat Header */}
      <ChatHeader 
        currentRoom={currentRoom}
        isConnected={isConnected}
        onClose={onClose}
        onViewChange={setView}
        onEndChat={handleEndChat}
        view={view}
      />

      {/* Main Content */}
      <div className="chat-content">
        {view === 'chat' && (
          <>
            {currentRoom || (isGuestMode && guestSession) ? (
              <>
                {console.log('🎯 ChatWindow - Showing chat interface:', { 
                  currentRoom: !!currentRoom, 
                  isGuestMode, 
                  guestSession: !!guestSession,
                  isConnected 
                })}
                {/* Messages Area */}
                <div className="messages-container">
                  <MessageList 
                    messages={messages}
                    currentUser={user || { name: guestSession?.customerName || 'Guest' }}
                    typing={typing}
                  />
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <MessageInput 
                  roomId={currentRoom?.room_id}
                  disabled={false}
                  placeholder={isGuestMode ? "Nhập tin nhắn để bắt đầu chat với tư vấn viên..." : "Nhập tin nhắn..."}
                  onFileUpload={() => setShowFileUpload(true)}
                />
              </>
            ) : (
              /* No Room Selected */
              <div className="no-room-selected">
                {console.log('📋 ChatWindow - Showing welcome screen:', { 
                  currentRoom: !!currentRoom, 
                  isGuestMode, 
                  guestSession: !!guestSession,
                  isAuthenticated,
                  isConnected 
                })}
                <div className="welcome-message">
                  <i className="ri-customer-service-2-line"></i>
                  <h3>Chào mừng đến với HUTECH Support!</h3>
                  {isGuestMode && guestSession ? (
                    <p>Xin chào {guestSession.name}! Bắt đầu cuộc trò chuyện để nhận hỗ trợ.</p>
                  ) : (
                    <p>Bắt đầu cuộc trò chuyện để nhận hỗ trợ từ đội ngũ chuyên viên</p>
                  )}
                  
                  <div className="quick-actions">
                    <button 
                      className="btn-start-chat"
                      onClick={() => handleCreateRoom()}
                    >
                      <i className="ri-chat-new-line"></i>
                      {isGuestMode ? 'Bắt đầu chat với tư vấn viên' : 'Bắt đầu chat'}
                    </button>
                    
                    {isAuthenticated && (
                      <button 
                        className="btn-view-rooms"
                        onClick={() => setView('rooms')}
                      >
                        <i className="ri-chat-history-line"></i>
                        Lịch sử chat ({(activeRooms || []).length})
                      </button>
                    )}
                  </div>

                  {/* Online Agents */}
                  {(onlineAgents || []).length > 0 && (
                    <div className="online-agents">
                      <h4>Nhân viên đang online ({(onlineAgents || []).length})</h4>
                      <div className="agents-list">
                        {onlineAgents.slice(0, 3).map(agent => (
                          <div key={agent.id} className="agent-item">
                            <div className="agent-avatar">
                              <img src={agent.avatar || '/default-avatar.png'} alt={agent.name} />
                              <div className="online-indicator"></div>
                            </div>
                            <div className="agent-info">
                              <div className="agent-name">{agent.name}</div>
                              <div className="agent-status">{agent.status}</div>
                            </div>
                            <button 
                              className="btn-chat-agent"
                              onClick={() => handleCreateRoom(agent.id)}
                            >
                              Chat
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {view === 'rooms' && (
          <RoomList 
            rooms={activeRooms}
            currentRoom={currentRoom}
            onRoomSelect={handleRoomSwitch}
            onCreateRoom={handleCreateRoom}
          />
        )}

        {view === 'agents' && (
          <div className="agents-view">
            <div className="agents-header">
              <h3>Nhân viên hỗ trợ</h3>
              <p>Chọn nhân viên để bắt đầu chat trực tiếp</p>
            </div>
            
            <div className="agents-grid">
              {onlineAgents.map(agent => (
                <div key={agent.id} className="agent-card">
                  <div className="agent-avatar-large">
                    <img src={agent.avatar || '/default-avatar.png'} alt={agent.name} />
                    <div className="online-indicator"></div>
                  </div>
                  <div className="agent-details">
                    <h4>{agent.name}</h4>
                    <p>{agent.department}</p>
                    <div className="agent-stats">
                      <span>⭐ {agent.rating}/5</span>
                      <span>💬 {agent.activeChats} chats</span>
                    </div>
                  </div>
                  <button 
                    className="btn-start-chat-agent"
                    onClick={() => handleCreateRoom(agent.id)}
                  >
                    Bắt đầu chat
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* File Upload Modal */}
      {showFileUpload && (
        <FileUpload 
          onClose={() => setShowFileUpload(false)}
        />
      )}

      {/* Rating Modal */}
      {showRating && (
        <RatingModal 
          room={currentRoom}
          onClose={() => setShowRating(false)}
          onComplete={() => {
            setShowRating(false);
            leaveRoom(currentRoom.id);
          }}
        />
      )}

      {/* Drag Over Overlay */}
      {dragOver && (
        <div className="drag-overlay">
          <div className="drag-content">
            <i className="ri-upload-cloud-line"></i>
            <p>Thả file để tải lên</p>
          </div>
        </div>
      )}

      <style>{`
        .chat-window {
          position: fixed;
          bottom: 100px;
          right: 30px;
          width: 380px;
          height: 500px;
          background: white;
          border-radius: 1rem;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          z-index: 1000;
          transition: all 0.3s ease;
        }

        .chat-window.drag-over {
          border: 2px dashed var(--primary-color);
          background: rgba(1, 187, 191, 0.05);
        }

        .chat-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
        }

        .no-room-selected {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .welcome-message {
          text-align: center;
          max-width: 280px;
        }

        .welcome-message i {
          font-size: 3rem;
          color: var(--primary-color);
          margin-bottom: 1rem;
        }

        .welcome-message h3 {
          margin-bottom: 0.5rem;
          color: var(--text-dark);
          font-size: 1.2rem;
        }

        .welcome-message p {
          margin-bottom: 1.5rem;
          color: var(--text-light);
          font-size: 0.9rem;
          line-height: 1.4;
        }

        .quick-actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .btn-start-chat,
        .btn-view-rooms {
          padding: 0.75rem 1rem;
          border: none;
          border-radius: 0.5rem;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .btn-start-chat {
          background: var(--primary-color);
          color: white;
        }

        .btn-start-chat:hover {
          background: #019a9e;
          transform: translateY(-1px);
        }

        .btn-view-rooms {
          background: transparent;
          color: var(--text-dark);
          border: 1px solid #e5e7eb;
        }

        .btn-view-rooms:hover {
          background: #f9fafb;
        }

        .online-agents {
          border-top: 1px solid #e5e7eb;
          padding-top: 1rem;
        }

        .online-agents h4 {
          font-size: 0.9rem;
          color: var(--text-dark);
          margin-bottom: 0.75rem;
        }

        .agents-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .agent-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem;
          border-radius: 0.5rem;
          transition: all 0.3s ease;
        }

        .agent-item:hover {
          background: rgba(1, 187, 191, 0.05);
        }

        .agent-avatar {
          width: 32px;
          height: 32px;
          position: relative;
        }

        .agent-avatar img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }

        .online-indicator {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 10px;
          height: 10px;
          background: #10b981;
          border: 2px solid white;
          border-radius: 50%;
        }

        .agent-info {
          flex: 1;
        }

        .agent-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-dark);
        }

        .agent-status {
          font-size: 0.75rem;
          color: var(--text-light);
        }

        .btn-chat-agent {
          background: var(--primary-color);
          color: white;
          border: none;
          padding: 0.25rem 0.75rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-chat-agent:hover {
          background: #019a9e;
        }

        .agents-view {
          flex: 1;
          padding: 1rem;
          overflow-y: auto;
        }

        .agents-header {
          margin-bottom: 1rem;
          text-align: center;
        }

        .agents-header h3 {
          font-size: 1.1rem;
          color: var(--text-dark);
          margin-bottom: 0.25rem;
        }

        .agents-header p {
          font-size: 0.85rem;
          color: var(--text-light);
        }

        .agents-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .agent-card {
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          padding: 1rem;
          text-align: center;
          transition: all 0.3s ease;
        }

        .agent-card:hover {
          border-color: var(--primary-color);
          box-shadow: 0 4px 12px rgba(1, 187, 191, 0.1);
        }

        .agent-avatar-large {
          width: 60px;
          height: 60px;
          margin: 0 auto 0.75rem;
          position: relative;
        }

        .agent-avatar-large img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }

        .agent-details h4 {
          font-size: 1rem;
          color: var(--text-dark);
          margin-bottom: 0.25rem;
        }

        .agent-details p {
          font-size: 0.85rem;
          color: var(--text-light);
          margin-bottom: 0.5rem;
        }

        .agent-stats {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1rem;
          font-size: 0.75rem;
          color: var(--text-light);
        }

        .btn-start-chat-agent {
          background: var(--primary-color);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
        }

        .btn-start-chat-agent:hover {
          background: #019a9e;
        }

        .drag-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(1, 187, 191, 0.1);
          backdrop-filter: blur(2px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .drag-content {
          text-align: center;
          color: var(--primary-color);
        }

        .drag-content i {
          font-size: 3rem;
          margin-bottom: 0.5rem;
        }

        .drag-content p {
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .chat-window {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
            border-radius: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default ChatWindow;
