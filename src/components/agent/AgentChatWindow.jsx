import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../contexts/ChatContext';
import AgentMessageList from './AgentMessageList';
import AgentMessageInput from './AgentMessageInput';
import CustomerInfo from './CustomerInfo';
import QuickActions from './QuickActions';

const AgentChatWindow = ({ room, messages: roomMessages, currentAgent }) => {
  const { 
    sendMessage, 
    uploadFile, 
    messages: allMessages, 
    isLoading,
    typingUsers,
    markMessageAsRead,
    updateRoomStatus,
    closeRoom,
    transferRoom,
    getAvailableAgents,
    lastUpdateTime
  } = useChat();

  // Use roomMessages prop if provided, otherwise filter from all messages
  const displayMessages = roomMessages || allMessages.filter(msg => 
    msg.room_id === room?.room_id || msg.room_id === room?.id
  );

  // Debug messages
  console.log('🎯 AgentChatWindow debug:', {
    roomMessagesCount: roomMessages?.length,
    allMessagesCount: allMessages?.length,
    displayMessagesCount: displayMessages?.length,
    roomId: room?.room_id || room?.id,
    roomMessages: roomMessages?.slice(0, 2),
    displayMessages: displayMessages?.slice(0, 2)
  });

  const [showCustomerInfo, setShowCustomerInfo] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [availableAgents, setAvailableAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [closeReason, setCloseReason] = useState('');
  const [transferReason, setTransferReason] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  // Handle typing indicator
  const handleTypingStart = () => {
    if (!isTyping) {
      setIsTyping(true);
      // sendTyping(true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      // sendTyping(false);
    }, 2000);
  };

  const handleTypingStop = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    setIsTyping(false);
    // sendTyping(false);
  };

  const handleSendMessage = (content, type = 'text', fileData = null) => {
    sendMessage(content, type, fileData);
    handleTypingStop();
  };

  const handleFileUpload = (file) => {
    uploadFile(room?.room_id || room?.id, file);
  };

  const handleCloseRoom = () => {
    setShowCloseModal(true);
  };

  const confirmCloseRoom = async () => {
    try {
      await closeRoom(room?.room_id || room?.id, closeReason);
      setShowCloseModal(false);
      setCloseReason('');
    } catch (error) {
      console.error('Failed to close room:', error);
    }
  };

  const handleTransferRoom = async () => {
    try {
      const agents = await getAvailableAgents();
      setAvailableAgents(agents);
      setShowTransferModal(true);
    } catch (error) {
      console.error('Failed to get available agents:', error);
    }
  };

  const confirmTransferRoom = async () => {
    if (!selectedAgent) {
      alert('Vui lòng chọn agent để chuyển tiếp');
      return;
    }

    console.log('🔄 Transfer room debug:', {
      roomId: room?.room_id || room?.id,
      selectedAgent,
      transferReason,
      selectedAgentType: typeof selectedAgent
    });

    try {
      await transferRoom(room?.room_id || room?.id, selectedAgent, transferReason);
      setShowTransferModal(false);
      setSelectedAgent('');
      setTransferReason('');
    } catch (error) {
      console.error('Failed to transfer room:', error);
    }
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
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(room.customer_name || room.customer?.name || 'Guest')}&background=4f46e5&color=ffffff`}
              alt={room.customer_name || room.customer?.name || 'Guest'}
            />
            <div 
              className="status-indicator"
              style={{ backgroundColor: getStatusColor(room.status) }}
            ></div>
          </button>

          <div className="customer-details">
            <h3>{room.customer_name || room.customer?.name || 'Khách vãng lai'}</h3>
            <div className="customer-meta">
              <span 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(room.status) }}
              >
                {getStatusText(room.status)}
              </span>
              {(room.customer_email || room.customer?.email) && (
                <span className="email">{room.customer_email || room.customer?.email}</span>
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
          messages={displayMessages}
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

      {/* Close Room Modal */}
      {showCloseModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Đóng cuộc hội thoại</h3>
              <button 
                className="close-btn"
                onClick={() => setShowCloseModal(false)}
              >
                <i className="ri-close-line"></i>
              </button>
            </div>
            <div className="modal-body">
              <p>Bạn có chắc chắn muốn đóng cuộc hội thoại với <strong>{room.customer_name || 'khách hàng này'}</strong>?</p>
              <div className="form-group">
                <label>Lý do đóng (không bắt buộc):</label>
                <textarea
                  value={closeReason}
                  onChange={(e) => setCloseReason(e.target.value)}
                  placeholder="Nhập lý do đóng cuộc hội thoại..."
                  rows="3"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowCloseModal(false)}
              >
                Hủy
              </button>
              <button 
                className="btn btn-danger"
                onClick={confirmCloseRoom}
                disabled={isLoading}
              >
                {isLoading ? 'Đang đóng...' : 'Đóng cuộc hội thoại'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Room Modal */}
      {showTransferModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Chuyển tiếp cuộc hội thoại</h3>
              <button 
                className="close-btn"
                onClick={() => setShowTransferModal(false)}
              >
                <i className="ri-close-line"></i>
              </button>
            </div>
            <div className="modal-body">
              <p>Chuyển tiếp cuộc hội thoại với <strong>{room.customer_name || 'khách hàng này'}</strong> cho agent khác.</p>
              
              <div className="form-group">
                <label>Chọn agent:</label>
                <select
                  value={selectedAgent}
                  onChange={(e) => setSelectedAgent(e.target.value)}
                  className="form-select"
                >
                  <option value="">-- Chọn agent --</option>
                  {availableAgents.map(agent => (
                    <option key={agent.user_id} value={agent.user_id}>
                      {agent.full_name} ({agent.active_chats || 0} cuộc trò chuyện)
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Lý do chuyển tiếp (không bắt buộc):</label>
                <textarea
                  value={transferReason}
                  onChange={(e) => setTransferReason(e.target.value)}
                  placeholder="Nhập lý do chuyển tiếp..."
                  rows="3"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowTransferModal(false)}
              >
                Hủy
              </button>
              <button 
                className="btn btn-primary"
                onClick={confirmTransferRoom}
                disabled={isLoading || !selectedAgent}
              >
                {isLoading ? 'Đang chuyển...' : 'Chuyển tiếp'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
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

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 0.75rem;
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow: hidden;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-header h3 {
          margin: 0;
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--text-dark);
        }

        .close-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: none;
          background: none;
          border-radius: 0.5rem;
          cursor: pointer;
          color: #6b7280;
          transition: all 0.2s;
        }

        .close-btn:hover {
          background: #f3f4f6;
          color: #374151;
        }

        .modal-body {
          padding: 1.5rem;
        }

        .modal-body p {
          margin: 0 0 1rem 0;
          color: var(--text-dark);
          line-height: 1.6;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: var(--text-dark);
        }

        .form-group textarea,
        .form-select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          font-size: 0.9rem;
          transition: border-color 0.2s;
          resize: vertical;
        }

        .form-group textarea:focus,
        .form-select:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .modal-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 1rem;
          padding: 1.5rem;
          border-top: 1px solid #e5e7eb;
          background: #f9fafb;
        }

        .btn {
          padding: 0.625rem 1.25rem;
          border-radius: 0.5rem;
          font-weight: 500;
          font-size: 0.9rem;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #e5e7eb;
        }

        .btn-primary {
          background: var(--primary-color);
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #4338ca;
        }

        .btn-danger {
          background: #ef4444;
          color: white;
        }

        .btn-danger:hover:not(:disabled) {
          background: #dc2626;
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
