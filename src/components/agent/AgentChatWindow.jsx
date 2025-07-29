import React, { useState, useRef, useEffect } from 'react';
import { useChatContext } from '../../contexts/ChatContext';
import AgentMessageList from './AgentMessageList';
import AgentMessageInput from './AgentMessageInput';
import CustomerInfo from './CustomerInfo';
import QuickActions from './QuickActions';

const AgentChatWindow = ({ room, messages, currentAgent }) => {
  const { 
    sendMessage, 
    uploadFile, 
    sendTyping, 
    submitRating,
    leaveRoom 
  } = useChatContext();

  const [showCustomerInfo, setShowCustomerInfo] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  // Handle typing indicator
  const handleTypingStart = () => {
    if (!isTyping) {
      setIsTyping(true);
      sendTyping(true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      sendTyping(false);
    }, 2000);
  };

  const handleTypingStop = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    setIsTyping(false);
    sendTyping(false);
  };

  const handleSendMessage = (content, type = 'text', fileData = null) => {
    sendMessage(content, type, fileData);
    handleTypingStop();
  };

  const handleFileUpload = (file) => {
    uploadFile(file);
  };

  const handleCloseRoom = () => {
    if (confirm('Bạn có chắc chắn muốn đóng cuộc hội thoại này?')) {
      leaveRoom(room.id);
    }
  };

  const handleTransferRoom = () => {
    // TODO: Implement room transfer logic
    console.log('Transfer room to another agent');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'waiting': return '#f59e0b';
      case 'active': return '#10b981';
      case 'closed': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'waiting': return 'Chờ xử lý';
      case 'active': return 'Đang xử lý';
      case 'closed': return 'Đã đóng';
      default: return 'Không xác định';
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  if (!room) {
    return (
      <div className="no-room-selected">
        <i className="ri-chat-3-line"></i>
        <h3>Chọn cuộc hội thoại để bắt đầu</h3>
        <p>Chọn một cuộc hội thoại từ danh sách bên trái để bắt đầu hỗ trợ khách hàng</p>
      </div>
    );
  }

  return (
    <div className="agent-chat-window">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="customer-info">
          <button 
            className="customer-avatar-btn"
            onClick={() => setShowCustomerInfo(true)}
          >
            <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(room.customer?.name || 'Guest')}&background=4f46e5&color=ffffff`}
              alt={room.customer?.name}
            />
            <div 
              className="status-indicator"
              style={{ backgroundColor: getStatusColor(room.status) }}
            ></div>
          </button>

          <div className="customer-details">
            <h3>{room.customer?.name || 'Khách vãng lai'}</h3>
            <div className="customer-meta">
              <span 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(room.status) }}
              >
                {getStatusText(room.status)}
              </span>
              {room.customer?.email && (
                <span className="email">{room.customer.email}</span>
              )}
            </div>
          </div>
        </div>

        <div className="chat-actions">
          <button 
            className="action-btn"
            onClick={() => setShowQuickActions(!showQuickActions)}
            title="Hành động nhanh"
          >
            <i className="ri-magic-line"></i>
          </button>

          <button 
            className="action-btn"
            onClick={handleTransferRoom}
            title="Chuyển tiếp"
          >
            <i className="ri-user-shared-line"></i>
          </button>

          <button 
            className="action-btn"
            onClick={() => setShowCustomerInfo(true)}
            title="Thông tin khách hàng"
          >
            <i className="ri-user-line"></i>
          </button>

          <button 
            className="action-btn danger"
            onClick={handleCloseRoom}
            title="Đóng cuộc hội thoại"
          >
            <i className="ri-close-line"></i>
          </button>
        </div>
      </div>

      {/* Quick Actions Panel */}
      {showQuickActions && (
        <QuickActions 
          onSelectTemplate={(template) => {
            handleSendMessage(template.content);
            setShowQuickActions(false);
          }}
          onClose={() => setShowQuickActions(false)}
        />
      )}

      {/* Chat Messages */}
      <div className="chat-content">
        <AgentMessageList 
          messages={messages}
          currentAgent={currentAgent}
          room={room}
        />
      </div>

      {/* Message Input */}
      <div className="chat-input-container">
        <AgentMessageInput
          onSendMessage={handleSendMessage}
          onFileUpload={handleFileUpload}
          onTypingStart={handleTypingStart}
          onTypingStop={handleTypingStop}
          disabled={room.status === 'closed'}
        />
      </div>

      {/* Customer Info Modal */}
      {showCustomerInfo && (
        <CustomerInfo 
          customer={room.customer}
          room={room}
          onClose={() => setShowCustomerInfo(false)}
          onSubmitRating={submitRating}
        />
      )}

      <style jsx>{`
        .agent-chat-window {
          flex: 1;
          display: flex;
          flex-direction: column;
          height: 100%;
          background: white;
        }

        .chat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #e5e7eb;
          background: white;
          position: relative;
        }

        .customer-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .customer-avatar-btn {
          position: relative;
          border: none;
          background: none;
          cursor: pointer;
          border-radius: 50%;
          transition: transform 0.2s;
        }

        .customer-avatar-btn:hover {
          transform: scale(1.05);
        }

        .customer-avatar-btn img {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
        }

        .status-indicator {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 2px solid white;
        }

        .customer-details h3 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-dark);
        }

        .customer-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-top: 0.25rem;
        }

        .status-badge {
          font-size: 0.75rem;
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 0.75rem;
          font-weight: 500;
        }

        .email {
          font-size: 0.8rem;
          color: var(--text-light);
        }

        .chat-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border: 1px solid #e5e7eb;
          background: white;
          cursor: pointer;
          border-radius: 0.5rem;
          transition: all 0.2s;
          color: var(--text-dark);
        }

        .action-btn:hover {
          background: #f8fafc;
          border-color: var(--primary-color);
        }

        .action-btn.danger:hover {
          background: #fef2f2;
          border-color: #ef4444;
          color: #ef4444;
        }

        .action-btn i {
          font-size: 1.1rem;
        }

        .chat-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: #f8fafc;
        }

        .chat-input-container {
          border-top: 1px solid #e5e7eb;
          background: white;
        }

        .no-room-selected {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          text-align: center;
          background: #f8fafc;
        }

        .no-room-selected i {
          font-size: 4rem;
          color: var(--primary-color);
          margin-bottom: 1rem;
          opacity: 0.7;
        }

        .no-room-selected h3 {
          font-size: 1.3rem;
          font-weight: 600;
          color: var(--text-dark);
          margin-bottom: 0.5rem;
        }

        .no-room-selected p {
          color: var(--text-light);
          max-width: 400px;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .chat-header {
            padding: 1rem;
          }

          .customer-details h3 {
            font-size: 1rem;
          }

          .customer-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
          }

          .chat-actions {
            gap: 0.25rem;
          }

          .action-btn {
            width: 36px;
            height: 36px;
          }
        }
      `}</style>
    </div>
  );
};

export default AgentChatWindow;
