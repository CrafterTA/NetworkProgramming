import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useChatContext } from '../contexts/ChatContext';
import AgentSidebar from '../components/agent/AgentSidebar';
import AgentChatWindow from '../components/agent/AgentChatWindow';
import AgentHeader from '../components/agent/AgentHeader';
import '../styles/agent-chat.css';

const AgentChat = () => {
  const { user, isAuthenticated } = useAuth();
  const { 
    isConnected, 
    activeRooms, 
    currentRoom, 
    messages, 
    onlineAgents,
    connectWebSocket
  } = useChatContext();

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [agentStatus, setAgentStatus] = useState('online'); // online, busy, away, offline

  // Check if user is agent/admin
  useEffect(() => {
    if (!isAuthenticated() || !user) {
      window.location.href = '/login';
      return;
    }

    if (user.Role !== 'agent' && user.Role !== 'admin') {
      alert('Bạn không có quyền truy cập trang này');
      window.location.href = '/';
      return;
    }

    // Connect WebSocket for agent
    connectWebSocket();
  }, [user, isAuthenticated]);

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
  };

  const handleStatusChange = (newStatus) => {
    setAgentStatus(newStatus);
    // TODO: Send status update to server
  };

  if (!isAuthenticated() || !user) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <i className="ri-loader-4-line spinning"></i>
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="agent-chat-container">
      {/* Header */}
      <AgentHeader 
        agent={user}
        status={agentStatus}
        onStatusChange={handleStatusChange}
        isConnected={isConnected}
        onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        sidebarCollapsed={sidebarCollapsed}
      />

      <div className="chat-layout">
        {/* Sidebar */}
        <AgentSidebar
          rooms={activeRooms}
          selectedRoom={selectedRoom}
          onRoomSelect={handleRoomSelect}
          collapsed={sidebarCollapsed}
          onlineAgents={onlineAgents}
          currentAgent={user}
        />

        {/* Main Chat Area */}
        <div className="chat-main">
          {selectedRoom ? (
            <AgentChatWindow
              room={selectedRoom}
              messages={messages.filter(msg => msg.room_id === selectedRoom.id)}
              currentAgent={user}
            />
          ) : (
            <div className="no-room-selected">
              <div className="welcome-content">
                <i className="ri-chat-3-line"></i>
                <h3>HUTECH Agent Dashboard</h3>
                <p>Chọn cuộc hội thoại từ danh sách bên trái để bắt đầu hỗ trợ khách hàng</p>
                
                <div className="stats-grid">
                  <div className="stat-card">
                    <i className="ri-chat-4-line"></i>
                    <div>
                      <h4>{activeRooms.length}</h4>
                      <p>Cuộc hội thoại</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <i className="ri-time-line"></i>
                    <div>
                      <h4>{activeRooms.filter(r => r.status === 'waiting').length}</h4>
                      <p>Chờ xử lý</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <i className="ri-user-line"></i>
                    <div>
                      <h4>{onlineAgents.length}</h4>
                      <p>Agent online</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .agent-chat-container {
          height: 100vh;
          display: flex;
          flex-direction: column;
          background: #f8fafc;
        }

        .chat-layout {
          flex: 1;
          display: flex;
          overflow: hidden;
        }

        .chat-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: white;
        }

        .no-room-selected {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .welcome-content {
          text-align: center;
          max-width: 500px;
        }

        .welcome-content i {
          font-size: 4rem;
          color: var(--primary-color);
          margin-bottom: 1.5rem;
          opacity: 0.7;
        }

        .welcome-content h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--text-dark);
          margin-bottom: 0.5rem;
        }

        .welcome-content p {
          color: var(--text-light);
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-top: 2rem;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          background: #f8fafc;
          border-radius: 0.75rem;
          border: 1px solid #e5e7eb;
        }

        .stat-card i {
          font-size: 1.5rem;
          color: var(--primary-color);
        }

        .stat-card h4 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-dark);
          margin: 0;
        }

        .stat-card p {
          font-size: 0.8rem;
          color: var(--text-light);
          margin: 0;
        }

        .loading-container {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8fafc;
        }

        .loading-spinner {
          text-align: center;
          color: var(--text-light);
        }

        .loading-spinner i {
          font-size: 2rem;
          margin-bottom: 1rem;
        }

        .spinning {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .welcome-content {
            padding: 1rem;
          }

          .welcome-content i {
            font-size: 3rem;
          }

          .welcome-content h3 {
            font-size: 1.3rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AgentChat;
