import React from 'react';

const ChatHeader = ({ 
  currentRoom, 
  isConnected, 
  onClose, 
  onViewChange, 
  onEndChat, 
  view 
}) => {
  const getTitle = () => {
    switch(view) {
      case 'rooms':
        return 'Lịch sử chat';
      case 'agents':
        return 'Nhân viên hỗ trợ';
      default:
        return currentRoom?.agent?.name || 'HUTECH Support';
    }
  };

  const getSubtitle = () => {
    if (view !== 'chat') return '';
    
    if (!currentRoom) {
      return 'Chào mừng bạn đến với dịch vụ hỗ trợ';
    }
    
    return isConnected ? 'Đang hoạt động' : 'Mất kết nối';
  };

  return (
    <div className="chat-header">
      <div className="header-left">
        {/* Back Button cho sub views */}
        {view !== 'chat' && (
          <button 
            className="back-btn"
            onClick={() => onViewChange('chat')}
          >
            <i className="ri-arrow-left-line"></i>
          </button>
        )}

        {/* Avatar */}
        <div className="header-avatar">
          {currentRoom?.agent?.avatar ? (
            <img 
              src={currentRoom.agent.avatar} 
              alt={currentRoom.agent.name}
            />
          ) : (
            <div className="default-avatar">
              <i className="ri-customer-service-2-line"></i>
            </div>
          )}
          {view === 'chat' && isConnected && (
            <div className="online-dot"></div>
          )}
        </div>

        {/* Title & Status */}
        <div className="header-info">
          <h4 className="header-title">{getTitle()}</h4>
          <p className="header-subtitle">{getSubtitle()}</p>
        </div>
      </div>

      <div className="header-right">
        {/* Action Buttons */}
        {view === 'chat' && (
          <div className="header-actions">
            {/* Rooms Button */}
            <button 
              className="action-btn"
              onClick={() => onViewChange('rooms')}
              title="Lịch sử chat"
            >
              <i className="ri-chat-history-line"></i>
            </button>

            {/* Agents Button */}
            <button 
              className="action-btn"
              onClick={() => onViewChange('agents')}
              title="Nhân viên hỗ trợ"
            >
              <i className="ri-team-line"></i>
            </button>

            {/* End Chat Button */}
            {currentRoom && (
              <button 
                className="action-btn end-chat"
                onClick={onEndChat}
                title="Kết thúc chat"
              >
                <i className="ri-phone-line"></i>
              </button>
            )}
          </div>
        )}

        {/* Close Button */}
        <button 
          className="close-btn"
          onClick={onClose}
        >
          <i className="ri-close-line"></i>
        </button>
      </div>

      <style jsx>{`
        .chat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          background: linear-gradient(135deg, var(--primary-color) 0%, #019a9e 100%);
          color: white;
          border-radius: 1rem 1rem 0 0;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex: 1;
        }

        .back-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .back-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .header-avatar {
          width: 40px;
          height: 40px;
          position: relative;
        }

        .header-avatar img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .default-avatar {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .online-dot {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 12px;
          height: 12px;
          background: #10b981;
          border: 2px solid white;
          border-radius: 50%;
        }

        .header-info {
          flex: 1;
        }

        .header-title {
          font-size: 1rem;
          font-weight: 600;
          margin: 0;
          color: white;
        }

        .header-subtitle {
          font-size: 0.8rem;
          margin: 0;
          color: rgba(255, 255, 255, 0.8);
          margin-top: 2px;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .header-actions {
          display: flex;
          gap: 0.25rem;
        }

        .action-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }

        .action-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .action-btn.end-chat {
          background: rgba(239, 68, 68, 0.8);
        }

        .action-btn.end-chat:hover {
          background: rgba(239, 68, 68, 1);
        }

        .close-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-left: 0.5rem;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        @media (max-width: 768px) {
          .chat-header {
            padding: 0.75rem 1rem;
          }

          .header-avatar {
            width: 36px;
            height: 36px;
          }

          .header-title {
            font-size: 0.95rem;
          }

          .header-subtitle {
            font-size: 0.75rem;
          }

          .action-btn,
          .close-btn,
          .back-btn {
            width: 28px;
            height: 28px;
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ChatHeader;
