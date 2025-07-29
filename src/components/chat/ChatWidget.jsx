import React, { useState } from 'react';
import { useChatContext } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';
import ChatWindow from './ChatWindow';
import GuestInfoForm from './GuestInfoForm';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [isCreatingGuestSession, setIsCreatingGuestSession] = useState(false);
  const { isConnected, notifications, createGuestSession } = useChatContext();
  const { isAuthenticated, user } = useAuth();

  const handleWidgetClick = () => {
    if (isAuthenticated()) {
      // User đã đăng nhập - mở chat trực tiếp
      setIsOpen(true);
    } else {
      // Khách vãng lai - hiển thị form thông tin
      setShowGuestForm(true);
      setIsOpen(true);
    }
  };

  const handleGuestFormSubmit = async (guestInfo) => {
    setIsCreatingGuestSession(true);
    try {
      await createGuestSession(guestInfo);
      setShowGuestForm(false);
      // Chat window sẽ tự động hiển thị sau khi tạo session thành công
    } catch (error) {
      console.error('Failed to create guest session:', error);
      alert('Không thể tạo phiên hỗ trợ. Vui lòng thử lại.');
    } finally {
      setIsCreatingGuestSession(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setShowGuestForm(false);
  };

  const getNotificationCount = () => {
    return notifications?.unreadCount || 0;
  };

  return (
    <>
      {/* Chat Widget Button */}
      <div className="chat-widget">
        <button 
          className={`chat-toggle-btn ${isOpen ? 'open' : ''}`}
          onClick={handleWidgetClick}
          title={isAuthenticated() ? "Mở chat hỗ trợ" : "Bắt đầu chat hỗ trợ"}
        >
          {isOpen ? (
            <i className="ri-close-line"></i>
          ) : (
            <>
              <i className="ri-customer-service-2-line"></i>
              {getNotificationCount() > 0 && (
                <span className="chat-badge">
                  {getNotificationCount() > 99 ? '99+' : getNotificationCount()}
                </span>
              )}
            </>
          )}
        </button>

        {/* Connection Status Indicator */}
        <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
          <div className="status-dot"></div>
          <span>{isConnected ? 'Đã kết nối' : 'Mất kết nối'}</span>
        </div>

        {/* Chat Window */}
        {isOpen && (
          <div className="chat-window-container">
            {showGuestForm ? (
              <GuestInfoForm
                onSubmit={handleGuestFormSubmit}
                onCancel={handleClose}
                isLoading={isCreatingGuestSession}
              />
            ) : (
              <ChatWindow onClose={handleClose} />
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .chat-widget {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 10000;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.5rem;
        }

        .chat-toggle-btn {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary-color), #019296);
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(1, 187, 191, 0.4);
        }

        .chat-toggle-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 30px rgba(1, 187, 191, 0.6);
        }

        .chat-toggle-btn.open {
          background: #6b7280;
        }

        .chat-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #ef4444;
          color: white;
          font-size: 0.7rem;
          font-weight: 600;
          padding: 0.2rem 0.4rem;
          border-radius: 1rem;
          min-width: 18px;
          text-align: center;
        }

        .connection-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.7rem;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          opacity: 0.8;
        }

        .connection-status.connected {
          background: var(--success-color);
        }

        .connection-status.disconnected {
          background: var(--error-color);
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
        }

        .chat-window-container {
          position: absolute;
          bottom: 80px;
          right: 0;
          width: 380px;
          max-width: calc(100vw - 2rem);
          height: 500px;
          max-height: calc(100vh - 120px);
          background: white;
          border-radius: 1rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          overflow: hidden;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .chat-widget {
            bottom: 1rem;
            right: 1rem;
          }

          .chat-toggle-btn {
            width: 50px;
            height: 50px;
            font-size: 1.3rem;
          }

          .chat-window-container {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
            max-width: none;
            max-height: none;
            border-radius: 0;
            animation: slideInMobile 0.3s ease;
          }
        }

        @keyframes slideInMobile {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
};

export default ChatWidget;
