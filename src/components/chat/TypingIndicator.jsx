import React from 'react';

const TypingIndicator = ({ user }) => {
  return (
    <div className="typing-indicator">
      <div className="typing-avatar">
        {user?.avatar ? (
          <img src={user.avatar} alt={user.name} />
        ) : (
          <div className="avatar-placeholder">
            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
        )}
      </div>

      <div className="typing-bubble">
        <div className="typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div className="typing-text">
        {user?.name || 'Nhân viên hỗ trợ'} đang nhập...
      </div>

      <style>{`
        .typing-indicator {
          display: flex;
          align-items: flex-end;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          opacity: 0;
          animation: fadeInUp 0.3s ease forwards;
        }

        .typing-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
        }

        .typing-avatar img {
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

        .typing-bubble {
          background: white;
          border-radius: 1rem;
          padding: 0.75rem 1rem;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .typing-dots {
          display: flex;
          gap: 0.25rem;
          align-items: center;
        }

        .typing-dots span {
          width: 6px;
          height: 6px;
          background: #9ca3af;
          border-radius: 50%;
          animation: typing 1.4s infinite ease-in-out;
        }

        .typing-dots span:nth-child(1) {
          animation-delay: 0s;
        }

        .typing-dots span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-dots span:nth-child(3) {
          animation-delay: 0.4s;
        }

        .typing-text {
          font-size: 0.75rem;
          color: var(--text-light);
          align-self: center;
          margin-left: 0.5rem;
        }

        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          30% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .typing-avatar {
            width: 28px;
            height: 28px;
          }

          .typing-bubble {
            padding: 0.6rem 0.8rem;
          }

          .typing-dots span {
            width: 5px;
            height: 5px;
          }

          .typing-text {
            font-size: 0.7rem;
          }
        }
      `}</style>
    </div>
  );
};

export default TypingIndicator;
