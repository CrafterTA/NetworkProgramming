import React, { useState, useEffect } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';
import ChatWindow from './ChatWindow';
import GuestInfoForm from './GuestInfoForm';
import './ChatWidget.css';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [isCreatingGuestSession, setIsCreatingGuestSession] = useState(false);
  const { isConnected, notifications, createGuestSession } = useChat();
  const { isAuthenticated, user } = useAuth();

  const handleWidgetClick = () => {
    if (isAuthenticated) {
      // User đã đăng nhập - mở chat trực tiếp
      setIsOpen(true);
    } else {
      // Khách vãng lai - hiển thị form thông tin
      setShowGuestForm(true);
    }
  };

  const handleGuestInfoSubmit = async (guestInfo) => {
    setIsCreatingGuestSession(true);
    try {
      const session = await createGuestSession(guestInfo);
      if (session) {
        setShowGuestForm(false);
        setIsOpen(true);
      }
    } catch (error) {
      console.error('Error creating guest session:', error);
    } finally {
      setIsCreatingGuestSession(false);
    }
  };

  // Show notification badge if there are unread messages
  const hasNotifications = notifications && notifications.length > 0;

  return (
    <>
      {/* Guest Info Form Modal */}
      {showGuestForm && (
        <div className="guest-form-overlay">
          <div className="guest-form-container">
            <div className="guest-form-header">
              <h3>🎯 Thông tin liên hệ</h3>
              <button 
                className="close-btn" 
                onClick={() => setShowGuestForm(false)}
              >
                ✕
              </button>
            </div>
            <GuestInfoForm 
              onSubmit={handleGuestInfoSubmit}
              isLoading={isCreatingGuestSession}
            />
          </div>
        </div>
      )}

      {/* Chat Widget Button */}
      <div className={`chat-widget ${isOpen ? 'open' : ''}`}>
        <button 
          className="chat-toggle-btn" 
          onClick={handleWidgetClick}
          title={isAuthenticated ? "Mở chat hỗ trợ" : "Bắt đầu chat hỗ trợ"}
        >
          {hasNotifications && (
            <div className="notification-badge">
              {notifications.length}
            </div>
          )}
          
          {isOpen ? (
            <span className="chat-icon">✕</span>
          ) : (
            <span className="chat-icon">💬</span>
          )}
        </button>

        {/* Chat Window */}
        {isOpen && (
          <div className="chat-window-container">
            <ChatWindow 
              onClose={() => setIsOpen(false)} 
              isGuest={!isAuthenticated}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ChatWidget;
