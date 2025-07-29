import React, { useEffect, useRef, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const AgentMessageList = ({ messages, currentAgent, room }) => {
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const isScrolledUp = scrollTop < scrollHeight - clientHeight - 100;
    setShowScrollButton(isScrolledUp);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch {
      return 'Vừa xong';
    }
  };

  const isAgent = (message) => {
    return message.sender?.role === 'agent' || message.sender?.role === 'admin';
  };

  const renderMessage = (message, index) => {
    const isCurrentAgent = message.sender?.id === currentAgent?.UserID;
    const isAgentMessage = isAgent(message);
    const isSystemMessage = message.type === 'system';

    if (isSystemMessage) {
      return (
        <div key={message.id || index} className="system-message">
          <div className="system-content">
            <i className="ri-information-line"></i>
            <span>{message.content}</span>
          </div>
          <span className="message-time">{formatTime(message.timestamp)}</span>
        </div>
      );
    }

    return (
      <div 
        key={message.id || index} 
        className={`message-wrapper ${isAgentMessage ? 'agent-message' : 'customer-message'} ${isCurrentAgent ? 'own-message' : ''}`}
      >
        {!isAgentMessage && (
          <div className="sender-avatar">
            <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(room.customer?.name || 'Guest')}&background=4f46e5&color=ffffff`}
              alt={room.customer?.name}
            />
          </div>
        )}

        <div className="message-content">
          {!isCurrentAgent && isAgentMessage && (
            <div className="sender-name">
              {message.sender?.name || 'Agent'}
            </div>
          )}

          <div className="message-bubble">
            {message.type === 'file' ? (
              <div className="file-message">
                <div className="file-info">
                  <i className="ri-file-line"></i>
                  <div>
                    <div className="file-name">{message.fileName}</div>
                    <div className="file-size">{formatFileSize(message.fileSize)}</div>
                  </div>
                </div>
                <button className="download-btn">
                  <i className="ri-download-line"></i>
                </button>
              </div>
            ) : message.type === 'image' ? (
              <div className="image-message">
                <img 
                  src={message.fileUrl} 
                  alt={message.fileName}
                  onClick={() => window.open(message.fileUrl, '_blank')}
                />
                {message.content && (
                  <div className="image-caption">{message.content}</div>
                )}
              </div>
            ) : (
              <div className="text-message">
                {message.content}
              </div>
            )}
          </div>

          <div className="message-footer">
            <span className="message-time">{formatTime(message.timestamp)}</span>
            {isCurrentAgent && (
              <div className="message-status">
                {message.status === 'sending' && (
                  <i className="ri-time-line" title="Đang gửi"></i>
                )}
                {message.status === 'sent' && (
                  <i className="ri-check-line" title="Đã gửi"></i>
                )}
                {message.status === 'delivered' && (
                  <i className="ri-check-double-line" title="Đã nhận"></i>
                )}
                {message.status === 'read' && (
                  <i className="ri-check-double-line read" title="Đã đọc"></i>
                )}
              </div>
            )}
          </div>
        </div>

        {isAgentMessage && (
          <div className="sender-avatar">
            <img 
              src={message.sender?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(message.sender?.name || 'Agent')}&background=4f46e5&color=ffffff`}
              alt={message.sender?.name}
            />
          </div>
        )}
      </div>
    );
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="message-list-container">
      <div 
        className="messages-container"
        ref={messagesContainerRef}
        onScroll={handleScroll}
      >
        {messages.length === 0 ? (
          <div className="empty-messages">
            <i className="ri-chat-3-line"></i>
            <h4>Cuộc hội thoại mới</h4>
            <p>Gửi tin nhắn đầu tiên để bắt đầu hỗ trợ khách hàng</p>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((message, index) => renderMessage(message, index))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {showScrollButton && (
        <button className="scroll-to-bottom" onClick={scrollToBottom}>
          <i className="ri-arrow-down-line"></i>
        </button>
      )}

      <style jsx>{`
        .message-list-container {
          flex: 1;
          position: relative;
          overflow: hidden;
        }

        .messages-container {
          height: 100%;
          overflow-y: auto;
          padding: 1rem;
        }

        .empty-messages {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
          color: var(--text-light);
        }

        .empty-messages i {
          font-size: 3rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .empty-messages h4 {
          margin: 0 0 0.5rem 0;
          font-size: 1.1rem;
          color: var(--text-dark);
        }

        .empty-messages p {
          margin: 0;
          max-width: 300px;
        }

        .messages-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .message-wrapper {
          display: flex;
          align-items: flex-end;
          gap: 0.75rem;
          max-width: 80%;
        }

        .customer-message {
          align-self: flex-start;
        }

        .agent-message {
          align-self: flex-end;
          flex-direction: row-reverse;
        }

        .own-message .message-bubble {
          background: var(--primary-color);
          color: white;
        }

        .sender-avatar {
          width: 32px;
          height: 32px;
          flex-shrink: 0;
        }

        .sender-avatar img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }

        .message-content {
          flex: 1;
          min-width: 0;
        }

        .sender-name {
          font-size: 0.75rem;
          color: var(--text-light);
          margin-bottom: 0.25rem;
          padding: 0 0.75rem;
        }

        .message-bubble {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 1rem;
          padding: 0.75rem 1rem;
          word-wrap: break-word;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .agent-message .message-bubble {
          background: #f8fafc;
          border-color: #e2e8f0;
        }

        .text-message {
          line-height: 1.5;
          font-size: 0.9rem;
        }

        .file-message {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.5rem;
        }

        .file-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex: 1;
        }

        .file-info i {
          font-size: 1.5rem;
          color: var(--primary-color);
        }

        .file-name {
          font-weight: 500;
          font-size: 0.9rem;
          color: var(--text-dark);
        }

        .file-size {
          font-size: 0.75rem;
          color: var(--text-light);
        }

        .download-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: none;
          background: var(--primary-color);
          color: white;
          border-radius: 50%;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .download-btn:hover {
          background: #3730a3;
        }

        .image-message img {
          max-width: 250px;
          max-height: 200px;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .image-message img:hover {
          transform: scale(1.02);
        }

        .image-caption {
          margin-top: 0.5rem;
          font-size: 0.9rem;
          color: var(--text-dark);
        }

        .message-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 0.5rem;
          padding: 0 0.75rem;
        }

        .message-time {
          font-size: 0.7rem;
          color: var(--text-light);
        }

        .message-status {
          display: flex;
          align-items: center;
        }

        .message-status i {
          font-size: 0.8rem;
          color: var(--text-light);
        }

        .message-status i.read {
          color: var(--primary-color);
        }

        .system-message {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          margin: 1rem 0;
        }

        .system-content {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #f3f4f6;
          border-radius: 1rem;
          font-size: 0.85rem;
          color: var(--text-dark);
        }

        .system-content i {
          color: var(--primary-color);
        }

        .scroll-to-bottom {
          position: absolute;
          bottom: 1rem;
          right: 1rem;
          width: 40px;
          height: 40px;
          border: none;
          background: var(--primary-color);
          color: white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .scroll-to-bottom:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(79, 70, 229, 0.4);
        }

        @media (max-width: 768px) {
          .message-wrapper {
            max-width: 90%;
          }

          .messages-container {
            padding: 0.5rem;
          }

          .sender-avatar {
            width: 28px;
            height: 28px;
          }

          .message-bubble {
            padding: 0.5rem 0.75rem;
          }

          .image-message img {
            max-width: 200px;
            max-height: 150px;
          }
        }
      `}</style>
    </div>
  );
};

export default AgentMessageList;
