import React, { useState, useRef, useCallback } from 'react';
import { useChatContext } from '../../contexts/ChatContext';

const MessageInput = ({ roomId, disabled = false }) => {
  const { sendMessage, uploadFile } = useChatContext();
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-resize textarea
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 120); // Max 120px
      textarea.style.height = `${newHeight}px`;
    }
  }, []);

  // Handle message send
  const handleSend = async () => {
    if (!message.trim() || disabled) return;

    const messageText = message.trim();
    setMessage('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      await sendMessage(roomId, messageText);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Restore message on error
      setMessage(messageText);
    }
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Handle file selection
  const handleFileSelect = async (files) => {
    if (!files || files.length === 0 || disabled) return;

    setIsUploading(true);
    
    try {
      const fileArray = Array.from(files);
      
      // Validate files
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = [
        'image/*',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/*'
      ];

      for (const file of fileArray) {
        if (file.size > maxSize) {
          alert(`File "${file.name}" quá lớn. Kích thước tối đa là 10MB.`);
          continue;
        }

        const isAllowed = allowedTypes.some(type => {
          if (type.endsWith('/*')) {
            return file.type.startsWith(type.slice(0, -1));
          }
          return file.type === type;
        });

        if (!isAllowed) {
          alert(`File "${file.name}" không được hỗ trợ.`);
          continue;
        }

        // Upload file
        await uploadFile(roomId, file);
      }
    } catch (error) {
      console.error('Failed to upload file:', error);
      alert('Không thể tải file lên. Vui lòng thử lại.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true);
    }
  };

  const handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  return (
    <div className="message-input-container">
      {/* Drag Overlay */}
      {dragActive && (
        <div className="drag-overlay">
          <div className="drag-content">
            <i className="ri-upload-cloud-2-line"></i>
            <p>Thả file để tải lên</p>
          </div>
        </div>
      )}

      <div 
        className={`message-input ${disabled ? 'disabled' : ''} ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {/* File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx,.txt"
          onChange={(e) => handleFileSelect(e.target.files)}
          style={{ display: 'none' }}
        />

        {/* Attach Button */}
        <button
          className="attach-btn"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading}
          title="Đính kèm file"
        >
          <i className={isUploading ? "ri-loader-4-line spinning" : "ri-attachment-2"}></i>
        </button>

        {/* Text Input */}
        <div className="input-wrapper">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              adjustTextareaHeight();
            }}
            onKeyDown={handleKeyPress}
            placeholder={disabled ? "Đang kết nối..." : "Nhập tin nhắn..."}
            disabled={disabled}
            rows={1}
            className="message-textarea"
          />
        </div>

        {/* Send Button */}
        <button
          className="send-btn"
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          title="Gửi tin nhắn"
        >
          <i className="ri-send-plane-fill"></i>
        </button>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="upload-progress">
          <i className="ri-loader-4-line spinning"></i>
          <span>Đang tải file...</span>
        </div>
      )}

      <style jsx>{`
        .message-input-container {
          position: relative;
          border-top: 1px solid #e5e7eb;
          background: white;
        }

        .drag-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(59, 130, 246, 0.1);
          border: 2px dashed var(--primary-color);
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }

        .drag-content {
          text-align: center;
          color: var(--primary-color);
        }

        .drag-content i {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .drag-content p {
          margin: 0;
          font-weight: 500;
        }

        .message-input {
          display: flex;
          align-items: flex-end;
          gap: 0.5rem;
          padding: 1rem;
          transition: all 0.2s;
        }

        .message-input.disabled {
          opacity: 0.6;
          pointer-events: none;
        }

        .message-input.drag-active {
          background: rgba(59, 130, 246, 0.05);
        }

        .attach-btn {
          background: none;
          border: none;
          color: var(--text-light);
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          flex-shrink: 0;
          height: 36px;
          width: 36px;
        }

        .attach-btn:hover:not(:disabled) {
          background: #f3f4f6;
          color: var(--primary-color);
        }

        .attach-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .input-wrapper {
          flex: 1;
          position: relative;
        }

        .message-textarea {
          width: 100%;
          border: 1px solid #d1d5db;
          border-radius: 1.5rem;
          padding: 0.75rem 1rem;
          font-size: 0.9rem;
          font-family: inherit;
          resize: none;
          outline: none;
          transition: all 0.2s;
          line-height: 1.4;
          min-height: 36px;
          max-height: 120px;
        }

        .message-textarea:focus {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .message-textarea:disabled {
          background: #f9fafb;
          cursor: not-allowed;
        }

        .message-textarea::placeholder {
          color: #9ca3af;
        }

        .send-btn {
          background: var(--primary-color);
          border: none;
          color: white;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          flex-shrink: 0;
          height: 36px;
          width: 36px;
        }

        .send-btn:hover:not(:disabled) {
          background: var(--primary-dark);
          transform: scale(1.05);
        }

        .send-btn:disabled {
          background: #d1d5db;
          cursor: not-allowed;
          transform: none;
        }

        .upload-progress {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #f0f9ff;
          border-top: 1px solid #e0f2fe;
          font-size: 0.8rem;
          color: var(--primary-color);
        }

        .spinning {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .message-input {
            padding: 0.75rem;
            gap: 0.4rem;
          }

          .attach-btn,
          .send-btn {
            height: 32px;
            width: 32px;
            padding: 0.4rem;
          }

          .message-textarea {
            padding: 0.6rem 0.8rem;
            font-size: 0.85rem;
            min-height: 32px;
          }

          .upload-progress {
            padding: 0.4rem 0.75rem;
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default MessageInput;
