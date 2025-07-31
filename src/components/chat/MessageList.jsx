import React, { useRef, useEffect, useState } from 'react';
import MessageItem from './MessageItem';
import TypingIndicator from './TypingIndicator';
import FileMessage from './FileMessage';

const MessageList = ({ messages, currentUser, typing }) => {
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [lastMessageCount, setLastMessageCount] = useState(0);

  // Debug logs - only in development
  if (process.env.NODE_ENV === 'development') {
    console.log('🔄 MessageList re-rendering with:', messages.length, 'messages');
    console.log('📝 Messages array:', messages.map(m => ({ id: m.id, content: m.content?.slice(0, 20), created_at: m.created_at })));
  }

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end' 
      });
    }
  };

  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const isScrolledUp = scrollTop < scrollHeight - clientHeight - 100;
    
    // Detect if user is manually scrolling
    if (isScrolledUp) {
      setIsUserScrolling(true);
    } else {
      setIsUserScrolling(false);
    }
  };

  // Smart auto-scroll: only scroll if user is not manually scrolling up
  useEffect(() => {
    const isNewMessage = messages.length > lastMessageCount;
    
    if (!isUserScrolling || isNewMessage) {
      const timer = setTimeout(() => {
        scrollToBottom();
      }, 100);
      
      setLastMessageCount(messages.length);
      return () => clearTimeout(timer);
    }
    
    setLastMessageCount(messages.length);
  }, [messages, isUserScrolling, lastMessageCount]);
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Hôm nay';
    } else if (diffDays === 2) {
      return 'Hôm qua';
    } else if (diffDays <= 7) {
      return `${diffDays} ngày trước`;
    } else {
      return date.toLocaleDateString('vi-VN');
    }
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};
    
    messages.forEach(message => {
      const timestamp = message.timestamp || message.created_at;
      const dateKey = new Date(timestamp).toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });

    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  if (messages.length === 0) {
    return (
      <div className="empty-messages">
        <div className="empty-content">
          <i className="ri-chat-3-line"></i>
          <h4>Chưa có tin nhắn</h4>
          <p>Hãy bắt đầu cuộc trò chuyện bằng cách gửi tin nhắn đầu tiên</p>
        </div>

        <style>{`
          .empty-messages {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
          }

          .empty-content {
            text-align: center;
            color: var(--text-light);
          }

          .empty-content i {
            font-size: 3rem;
            margin-bottom: 1rem;
            opacity: 0.5;
          }

          .empty-content h4 {
            margin-bottom: 0.5rem;
            font-size: 1.1rem;
          }

          .empty-content p {
            font-size: 0.9rem;
            line-height: 1.4;
            max-width: 200px;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div 
      className="message-list"
      ref={messagesContainerRef}
      onScroll={handleScroll}
    >
      {Object.entries(messageGroups).map(([dateKey, groupMessages]) => (
        <div key={dateKey} className="message-group">
          {/* Date Separator */}
          <div className="date-separator">
            <span>{formatDate(groupMessages[0].timestamp || groupMessages[0].created_at)}</span>
          </div>

          {/* Messages */}
          {groupMessages.map((message, index) => (
            <MessageItem
              key={message.id || index}
              message={message}
              isOwn={
                String(message.sender_id) === String(currentUser?.user_id) ||
                String(message.sender_id) === String(currentUser?.UserID) ||
                String(message.sender_id) === String(currentUser?.id)
              }
              showAvatar={
                index === 0 || 
                groupMessages[index - 1].sender_id !== message.sender_id
              }
              showTime={
                index === groupMessages.length - 1 ||
                groupMessages[index + 1].sender_id !== message.sender_id ||
                new Date(groupMessages[index + 1].timestamp || groupMessages[index + 1].created_at) - new Date(message.timestamp || message.created_at) > 300000 // 5 minutes
              }
            />
          ))}
        </div>
      ))}

      {/* Typing Indicator */}
      {typing && <TypingIndicator user={typing} />}
      
      {/* Scroll anchor */}
      <div ref={messagesEndRef} />

      <style>{`
        .message-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding-bottom: 1rem;
        }

        .message-group {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .date-separator {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 1rem 0 0.5rem;
          position: relative;
        }

        .date-separator::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: #e5e7eb;
          z-index: 1;
        }

        .date-separator span {
          background: white;
          padding: 0.25rem 0.75rem;
          font-size: 0.75rem;
          color: var(--text-light);
          border-radius: 1rem;
          position: relative;
          z-index: 2;
          border: 1px solid #e5e7eb;
        }

        @media (max-width: 768px) {
          .message-list {
            padding-bottom: 0.5rem;
          }

          .date-separator {
            margin: 0.75rem 0 0.25rem;
          }

          .date-separator span {
            font-size: 0.7rem;
            padding: 0.2rem 0.6rem;
          }
        }
      `}</style>
    </div>
  );
};

export default MessageList;
