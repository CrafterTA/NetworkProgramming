import React, { useState } from 'react';
import { useChatContext } from '../contexts/ChatContext';
import { useAuth } from '../contexts/AuthContext';
import ChatWindow from './ChatWindow';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const { isConnected, notifications } = useChatContext();
  const { isAuthenticated } = useAuth();

  const toggleChat = () => {
    if (!isAuthenticated()) {
      setShowLogin(true);
      return;
    }
    setIsOpen(!isOpen);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      {/* Chat Widget Button */}
      <div className="chat-widget">
        <button 
          className={`chat-toggle-btn ${isOpen ? 'open' : ''}`}
          onClick={toggleChat}
        >
          {isOpen ? (
            <i className="ri-close-line"></i>
          ) : (
            <>
              <i className="ri-customer-service-2-line"></i>
              {unreadCount > 0 && (
                <span className="chat-badge">{unreadCount}</span>
              )}
            </>
          )}
        </button>

        {/* Connection Status Indicator */}
        <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
          <div className="status-dot"></div>
        </div>

        {/* Chat Window */}
        {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}

        {/* Login Prompt */}
        {showLogin && (
          <div className="chat-login-prompt">
            <div className="login-prompt-content">
              <h4>Cần đăng nhập</h4>
              <p>Vui lòng đăng nhập để sử dụng dịch vụ hỗ trợ</p>
              <div className="login-prompt-actions">
                <button 
                  className="btn-login"
                  onClick={() => {
                    window.location.href = '/login';
                  }}
                >
                  Đăng nhập
                </button>
                <button 
                  className="btn-cancel"
                  onClick={() => setShowLogin(false)}
                >
                  Hủy
                </button>
              </div>
            </div>
            <div className="login-prompt-overlay" onClick={() => setShowLogin(false)}></div>
          </div>
        )}

        <style jsx>{`
          .chat-widget {
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 1000;
          }

          .chat-toggle-btn {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--primary-color) 0%, #019a9e 100%);
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(1, 187, 191, 0.3);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
          }

          .chat-toggle-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 25px rgba(1, 187, 191, 0.4);
          }

          .chat-toggle-btn.open {
            background: #ef4444;
          }

          .chat-badge {
            position: absolute;
            top: -5px;
            right: -5px;
            background: #ef4444;
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            font-size: 12px;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: pulse 2s infinite;
          }

          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }

          .connection-status {
            position: absolute;
            top: 5px;
            right: 5px;
            width: 12px;
            height: 12px;
          }

          .status-dot {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            transition: all 0.3s ease;
          }

          .connection-status.connected .status-dot {
            background: #10b981;
            box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.3);
          }

          .connection-status.disconnected .status-dot {
            background: #ef4444;
            box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.3);
          }

          .chat-login-prompt {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .login-prompt-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(5px);
          }

          .login-prompt-content {
            background: white;
            padding: 2rem;
            border-radius: 1rem;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
            text-align: center;
            max-width: 300px;
            position: relative;
            z-index: 1;
          }

          .login-prompt-content h4 {
            margin-bottom: 1rem;
            color: var(--text-dark);
            font-size: 1.2rem;
          }

          .login-prompt-content p {
            margin-bottom: 1.5rem;
            color: var(--text-light);
            line-height: 1.5;
          }

          .login-prompt-actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
          }

          .btn-login {
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
          }

          .btn-login:hover {
            background: #019a9e;
            transform: translateY(-1px);
          }

          .btn-cancel {
            background: transparent;
            color: var(--text-light);
            border: 1px solid var(--text-light);
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
          }

          .btn-cancel:hover {
            background: var(--text-light);
            color: white;
          }

          @media (max-width: 768px) {
            .chat-widget {
              bottom: 20px;
              right: 20px;
            }

            .chat-toggle-btn {
              width: 55px;
              height: 55px;
              font-size: 22px;
            }

            .login-prompt-content {
              margin: 1rem;
              padding: 1.5rem;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default ChatWidget;
