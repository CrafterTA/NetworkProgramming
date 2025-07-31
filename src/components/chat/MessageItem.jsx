import React, { useState } from 'react';
import FilePreview from './FilePreview';

const MessageItem = ({ message, isOwn, showAvatar, showTime }) => {
  const [showFullTime, setShowFullTime] = useState(false);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    if (showFullTime) {
      return date.toLocaleString('vi-VN');
    }
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const renderMessageContent = () => {
    switch (message.type) {
      case 'file':
        return (
          <div className="file-message">
            <FilePreview file={message.file} />
            {message.content && (
              <p className="file-caption">{message.content}</p>
            )}
          </div>
        );
      
      case 'image':
        return (
          <div className="image-message">
            <img 
              src={message.file?.url || message.content} 
              alt="Hình ảnh" 
              className="message-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <div className="image-error" style={{ display: 'none' }}>
              <i className="ri-image-line"></i>
              <span>Không thể tải hình ảnh</span>
            </div>
            {message.caption && (
              <p className="image-caption">{message.caption}</p>
            )}
          </div>
        );
      
      case 'system':
        return (
          <div className="system-message">
            <i className="ri-information-line"></i>
            <span>{message.content}</span>
          </div>
        );
      
      default:
        return (
          <div className="text-message">
            <p>{message.content}</p>
          </div>
        );
    }
  };

  const getStatusIcon = () => {
    switch (message.status) {
      case 'sending':
        return <i className="ri-time-line status-icon sending"></i>;
      case 'sent':
        return <i className="ri-check-line status-icon sent"></i>;
      case 'delivered':
        return <i className="ri-check-double-line status-icon delivered"></i>;
      case 'read':
        return <i className="ri-check-double-line status-icon read"></i>;
      case 'failed':
        return <i className="ri-error-warning-line status-icon failed"></i>;
      default:
        return null;
    }
  };

  if (message.type === 'system') {
    return (
      <div className="message-item system">
        {renderMessageContent()}
        
        <style>{`
          .message-item.system {
            display: flex;
            justify-content: center;
            margin: 1rem 0;
          }

          .system-message {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            background: #f3f4f6;
            border-radius: 1rem;
            font-size: 0.8rem;
            color: var(--text-light);
          }

          .system-message i {
            font-size: 0.9rem;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className={`message-item ${isOwn ? 'own' : 'other'}`}>
      {/* Avatar */}
      {!isOwn && showAvatar && (
        <div className="message-avatar">
          {message.sender?.avatar ? (
            <img src={message.sender.avatar} alt={message.sender.name} />
          ) : (
            <div className="avatar-placeholder">
              {message.sender?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
          )}
        </div>
      )}

      {/* Message Bubble */}
      <div className="message-bubble">
        {/* Sender Name (for non-own messages) */}
        {!isOwn && showAvatar && (
          <div className="sender-name">
            {message.sender?.name || 'Nhân viên hỗ trợ'}
          </div>
        )}

        {/* Message Content */}
        <div className="message-content">
          {renderMessageContent()}
        </div>

        {/* Time and Status */}
        {showTime && (
          <div 
            className="message-meta"
            onClick={() => setShowFullTime(!showFullTime)}
          >
            <span className="message-time">
              {formatTime(message.timestamp)}
            </span>
            {isOwn && getStatusIcon()}
          </div>
        )}
      </div>

      <style>{`
        .message-item {
          display: flex;
          margin-bottom: 0.25rem;
          max-width: 100%;
          gap: 0.5rem;
        }

        .message-item.own {
          flex-direction: row-reverse;
        }

        .message-item.other {
          flex-direction: row;
        }

        .message-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
          align-self: flex-end;
        }

        .message-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--primary-color);
          color: white;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .message-bubble {
          max-width: 70%;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .own .message-bubble {
          align-items: flex-end;
        }

        .other .message-bubble {
          align-items: flex-start;
        }

        .sender-name {
          font-size: 0.75rem;
          color: var(--text-light);
          padding: 0 0.75rem;
          font-weight: 500;
        }

        .message-content {
          background: #ffffff;
          border-radius: 1rem;
          padding: 0.75rem 1rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          border: 1px solid #d1d5db;
          color: #1f2937;
        }

        .own .message-content {
          background: #3b82f6;
          border-color: #2563eb;
          color: white;
        }

        .other .message-content {
          background: #f3f4f6;
          border-color: #d1d5db;
          color: #374151;
        }
          word-wrap: break-word;
          position: relative;
        }

        .text-message p {
          margin: 0;
          line-height: 1.4;
          white-space: pre-wrap;
          color: inherit;
        }

        .file-message {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .file-caption,
        .image-caption {
          margin: 0;
          font-size: 0.9rem;
          line-height: 1.4;
        }

        .image-message {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .message-image {
          max-width: 200px;
          max-height: 200px;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .message-image:hover {
          transform: scale(1.02);
        }

        .image-error {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          background: #f9fafb;
          border-radius: 0.5rem;
          color: var(--text-light);
        }

        .message-meta {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.7rem;
          color: var(--text-light);
          cursor: pointer;
          padding: 0 0.25rem;
          opacity: 0.7;
          transition: opacity 0.2s;
        }

        .message-meta:hover {
          opacity: 1;
        }

        .own .message-meta {
          flex-direction: row-reverse;
        }

        .message-time {
          user-select: none;
        }

        .status-icon {
          font-size: 0.8rem;
        }

        .status-icon.sending {
          color: #6b7280;
        }

        .status-icon.sent {
          color: #6b7280;
        }

        .status-icon.delivered {
          color: var(--primary-color);
        }

        .status-icon.read {
          color: var(--primary-color);
        }

        .status-icon.failed {
          color: #ef4444;
        }

        @media (max-width: 768px) {
          .message-bubble {
            max-width: 85%;
          }

          .message-avatar {
            width: 28px;
            height: 28px;
          }

          .message-content {
            padding: 0.6rem 0.8rem;
          }

          .message-image {
            max-width: 150px;
            max-height: 150px;
          }

          .sender-name {
            font-size: 0.7rem;
            padding: 0 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default MessageItem;
