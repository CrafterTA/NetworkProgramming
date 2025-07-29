import React, { useState, useRef, useEffect } from 'react';

const AgentMessageInput = ({
  onSendMessage,
  onFileUpload,
  onTypingStart,
  onTypingStop,
  disabled = false
}) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Quick templates
  const templates = [
    { id: 1, title: 'Chào hỏi', content: 'Xin chào! Tôi có thể giúp gì cho bạn hôm nay?' },
    { id: 2, title: 'Xin lỗi', content: 'Xin lỗi bạn vì sự bất tiện này. Tôi sẽ giúp bạn giải quyết ngay.' },
    { id: 3, title: 'Chờ một chút', content: 'Vui lòng chờ một chút để tôi kiểm tra thông tin cho bạn.' },
    { id: 4, title: 'Cảm ơn', content: 'Cảm ơn bạn đã liên hệ với chúng tôi!' },
    { id: 5, title: 'Kết thúc', content: 'Cảm ơn bạn đã sử dụng dịch vụ. Chúc bạn một ngày tốt lành!' }
  ];

  // Common emojis
  const emojis = ['😊', '😢', '😍', '🤔', '👍', '👎', '❤️', '🔥', '✅', '❌', '📄', '📸', '🎉', '💪', '🙏'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      adjustTextareaHeight();
      onTypingStop?.();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    adjustTextareaHeight();
    
    if (e.target.value.trim()) {
      onTypingStart?.();
    } else {
      onTypingStop?.();
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      onFileUpload(file);
    });
    e.target.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
      onFileUpload(file);
    });
  };

  const insertEmoji = (emoji) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newMessage = message.substring(0, start) + emoji + message.substring(end);
    
    setMessage(newMessage);
    setShowEmojiPicker(false);
    
    // Focus back to textarea and set cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 0);
  };

  const insertTemplate = (template) => {
    setMessage(template.content);
    setShowTemplates(false);
    textareaRef.current?.focus();
    adjustTextareaHeight();
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, []);

  return (
    <div className={`message-input-container ${dragOver ? 'drag-over' : ''}`}>
      {/* Template Picker */}
      {showTemplates && (
        <div className="templates-panel">
          <div className="panel-header">
            <h4>Mẫu tin nhắn nhanh</h4>
            <button onClick={() => setShowTemplates(false)}>
              <i className="ri-close-line"></i>
            </button>
          </div>
          <div className="templates-grid">
            {templates.map(template => (
              <button
                key={template.id}
                className="template-item"
                onClick={() => insertTemplate(template)}
              >
                <div className="template-title">{template.title}</div>
                <div className="template-content">{template.content}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="emoji-picker">
          <div className="emoji-grid">
            {emojis.map((emoji, index) => (
              <button
                key={index}
                className="emoji-item"
                onClick={() => insertEmoji(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form 
        className="input-form"
        onSubmit={handleSubmit}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="input-toolbar">
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => fileInputRef.current?.click()}
            title="Đính kèm file"
            disabled={disabled}
          >
            <i className="ri-attachment-line"></i>
          </button>

          <button
            type="button"
            className="toolbar-btn"
            onClick={() => setShowTemplates(!showTemplates)}
            title="Mẫu tin nhắn"
            disabled={disabled}
          >
            <i className="ri-file-text-line"></i>
          </button>

          <button
            type="button"
            className="toolbar-btn"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            title="Emoji"
            disabled={disabled}
          >
            <i className="ri-emotion-line"></i>
          </button>
        </div>

        <div className="input-wrapper">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={disabled ? "Cuộc hội thoại đã được đóng" : "Nhập tin nhắn..."}
            disabled={disabled}
            rows={1}
          />
          
          <button
            type="submit"
            className={`send-button ${message.trim() ? 'active' : ''}`}
            disabled={!message.trim() || disabled}
            title="Gửi tin nhắn"
          >
            <i className="ri-send-plane-fill"></i>
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="*/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </form>

      {dragOver && (
        <div className="drag-overlay">
          <div className="drag-content">
            <i className="ri-upload-cloud-line"></i>
            <p>Thả file để gửi</p>
          </div>
        </div>
      )}

      <style jsx>{`
        .message-input-container {
          position: relative;
          background: white;
          border-top: 1px solid #e5e7eb;
        }

        .message-input-container.drag-over {
          background: #f0f9ff;
          border-color: var(--primary-color);
        }

        .templates-panel {
          position: absolute;
          bottom: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #e5e7eb;
          border-bottom: none;
          max-height: 300px;
          overflow-y: auto;
        }

        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          border-bottom: 1px solid #e5e7eb;
          background: #f8fafc;
        }

        .panel-header h4 {
          margin: 0;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-dark);
        }

        .panel-header button {
          border: none;
          background: none;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 0.25rem;
          color: var(--text-light);
        }

        .panel-header button:hover {
          background: #e5e7eb;
        }

        .templates-grid {
          padding: 1rem;
        }

        .template-item {
          display: block;
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e5e7eb;
          background: white;
          border-radius: 0.5rem;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s;
          margin-bottom: 0.5rem;
        }

        .template-item:hover {
          border-color: var(--primary-color);
          background: #f8fafc;
        }

        .template-title {
          font-weight: 600;
          font-size: 0.85rem;
          color: var(--text-dark);
          margin-bottom: 0.25rem;
        }

        .template-content {
          font-size: 0.8rem;
          color: var(--text-light);
          line-height: 1.4;
        }

        .emoji-picker {
          position: absolute;
          bottom: 100%;
          right: 1rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          padding: 0.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          z-index: 1000;
        }

        .emoji-grid {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 0.25rem;
        }

        .emoji-item {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: none;
          background: none;
          cursor: pointer;
          border-radius: 0.25rem;
          font-size: 1.2rem;
          transition: background-color 0.2s;
        }

        .emoji-item:hover {
          background: #f3f4f6;
        }

        .input-form {
          padding: 1rem;
          position: relative;
        }

        .input-toolbar {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .toolbar-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border: 1px solid #e5e7eb;
          background: white;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
          color: var(--text-dark);
        }

        .toolbar-btn:hover:not(:disabled) {
          border-color: var(--primary-color);
          background: #f8fafc;
        }

        .toolbar-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .toolbar-btn i {
          font-size: 1rem;
        }

        .input-wrapper {
          display: flex;
          align-items: flex-end;
          gap: 0.75rem;
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 1.5rem;
          padding: 0.75rem 1rem;
          transition: all 0.2s;
        }

        .input-wrapper:focus-within {
          border-color: var(--primary-color);
          background: white;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .input-wrapper textarea {
          flex: 1;
          border: none;
          background: none;
          resize: none;
          outline: none;
          font-size: 0.9rem;
          line-height: 1.5;
          color: var(--text-dark);
          min-height: 20px;
          max-height: 120px;
          font-family: inherit;
        }

        .input-wrapper textarea::placeholder {
          color: var(--text-light);
        }

        .input-wrapper textarea:disabled {
          color: var(--text-light);
          cursor: not-allowed;
        }

        .send-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border: none;
          background: #e5e7eb;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s;
          color: var(--text-light);
          flex-shrink: 0;
        }

        .send-button.active {
          background: var(--primary-color);
          color: white;
          transform: scale(1.05);
        }

        .send-button:disabled {
          cursor: not-allowed;
          transform: none;
        }

        .send-button i {
          font-size: 1rem;
        }

        .drag-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(79, 70, 229, 0.1);
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

        @media (max-width: 768px) {
          .input-form {
            padding: 0.75rem;
          }

          .input-toolbar {
            margin-bottom: 0.5rem;
          }

          .toolbar-btn {
            width: 32px;
            height: 32px;
          }

          .input-wrapper {
            padding: 0.5rem 0.75rem;
          }

          .send-button {
            width: 32px;
            height: 32px;
          }

          .templates-panel {
            max-height: 200px;
          }

          .emoji-grid {
            grid-template-columns: repeat(6, 1fr);
          }
        }
      `}</style>
    </div>
  );
};

export default AgentMessageInput;
