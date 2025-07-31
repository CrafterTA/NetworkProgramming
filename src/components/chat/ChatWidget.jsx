import React, { useState } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';
import ChatWindow from './ChatWindow';
import GuestInfoForm from './GuestInfoForm';
import './ChatWidget.css';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [isCreatingGuestSession, setIsCreatingGuestSession] = useState(false);
  const { isSocketConnected, notifications, createGuestSession, guestSession } = useChat();
  const { isAuthenticated, user } = useAuth();

  const handleWidgetClick = () => {
    console.log('🎯 Chat widget clicked', {
      isAuthenticated,
      guestSession: !!guestSession,
      savedGuestSession: !!localStorage.getItem('guestSession'),
      savedGuestId: !!localStorage.getItem('guestId')
    });
    
    if (isAuthenticated) {
      // User đã đăng nhập - mở chat trực tiếp
      console.log('👤 Authenticated user - opening chat directly');
      setIsOpen(true);
    } else {
      // Kiểm tra xem có guest session trong localStorage không
      const savedGuestSession = localStorage.getItem('guestSession');
      const savedGuestId = localStorage.getItem('guestId');
      
      console.log('🔍 Guest session check:', {
        savedGuestSession: !!savedGuestSession,
        savedGuestId: !!savedGuestId,
        guestSession: !!guestSession
      });
      
      if (savedGuestSession && savedGuestId) {
        // Đã có guest session - mở chat
        console.log('👻 Existing guest session - opening chat');
        setIsOpen(true);
        setShowGuestForm(false);
      } else {
        // Khách vãng lai chưa có session - hiển thị form thông tin
        console.log('📝 New guest - showing info form');
        setShowGuestForm(true);
        setIsOpen(true);
      }
    }
  };

  const handleGuestFormSubmit = async (guestInfo) => {
    setIsCreatingGuestSession(true);
    try {
      console.log('🔄 Creating guest session...', guestInfo);
      await createGuestSession(guestInfo);
      console.log('✅ Guest session created successfully');
      setShowGuestForm(false);
      // Chat window sẽ tự động hiển thị sau khi tạo session thành công
    } catch (error) {
      console.error('❌ Failed to create guest session:', error);
      alert('Không thể tạo phiên hỗ trợ. Vui lòng thử lại.');
    } finally {
      setIsCreatingGuestSession(false);
      console.log('🏁 Guest session creation process completed');
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setShowGuestForm(false);
  };

  const getNotificationCount = () => {
    return notifications?.length || 0;
  };

  console.log('🔍 ChatWidget render state:', {
    isOpen,
    showGuestForm,
    isAuthenticated,
    hasGuestSession: !!guestSession,
    savedGuestSession: !!localStorage.getItem('guestSession')
  });

  return (
    <>
      {/* Chat Widget Button */}
      <div className="chat-widget">
        <button 
          className={`chat-toggle-btn ${isOpen ? 'open' : ''}`}
          onClick={handleWidgetClick}
          title={isAuthenticated ? "Mở chat hỗ trợ" : "Bắt đầu chat hỗ trợ"}
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
        <div className={`connection-status ${isSocketConnected ? 'connected' : 'disconnected'}`}>
          <div className="status-dot"></div>
          <span>{isSocketConnected ? 'Đã kết nối' : 'Mất kết nối'}</span>
        </div>

        {/* Chat Window */}
        {isOpen && (
          <div className="chat-window-container">
            {showGuestForm ? (
              <>
                {console.log('🔍 Rendering GuestInfoForm')}
                <GuestInfoForm
                  onSubmit={handleGuestFormSubmit}
                  onCancel={handleClose}
                  isLoading={isCreatingGuestSession}
                />
              </>
            ) : (
              <>
                {console.log('🔍 Rendering ChatWindow')}
                <ChatWindow onClose={handleClose} />
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ChatWidget;
