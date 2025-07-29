import React from 'react';

const CustomerInfo = ({ customer, room, onClose, onSubmitRating }) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="customer-info-modal" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>Thông tin khách hàng</h3>
          <button className="close-btn" onClick={onClose}>
            <i className="ri-close-line"></i>
          </button>
        </div>

        <div className="modal-body">
          {/* Customer Avatar & Basic Info */}
          <div className="customer-section">
            <div className="customer-avatar">
              <img 
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(customer?.name || 'Guest')}&background=4f46e5&color=ffffff`}
                alt={customer?.name}
              />
            </div>
            <div className="customer-details">
              <h4>{customer?.name || 'Khách vãng lai'}</h4>
              <p className="customer-type">
                {customer?.type === 'guest' ? 'Khách vãng lai' : 'Người dùng đã đăng ký'}
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="info-section">
            <h5>Thông tin liên hệ</h5>
            <div className="info-grid">
              <div className="info-item">
                <i className="ri-mail-line"></i>
                <div>
                  <label>Email</label>
                  <span>{customer?.email || 'Không có'}</span>
                </div>
              </div>
              <div className="info-item">
                <i className="ri-phone-line"></i>
                <div>
                  <label>Số điện thoại</label>
                  <span>{customer?.phone || 'Không có'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Room Information */}
          <div className="info-section">
            <h5>Thông tin cuộc hội thoại</h5>
            <div className="info-grid">
              <div className="info-item">
                <i className="ri-hashtag"></i>
                <div>
                  <label>ID phòng</label>
                  <span>{room?.id}</span>
                </div>
              </div>
              <div className="info-item">
                <i className="ri-time-line"></i>
                <div>
                  <label>Thời gian tạo</label>
                  <span>{new Date(room?.createdAt).toLocaleString('vi-VN')}</span>
                </div>
              </div>
              <div className="info-item">
                <i className="ri-bookmark-line"></i>
                <div>
                  <label>Chủ đề</label>
                  <span>{room?.subject || 'Hỗ trợ chung'}</span>
                </div>
              </div>
              <div className="info-item">
                <i className="ri-flag-line"></i>
                <div>
                  <label>Độ ưu tiên</label>
                  <span className={`priority-badge ${room?.priority || 'normal'}`}>
                    {room?.priority === 'high' ? 'Cao' : 
                     room?.priority === 'urgent' ? 'Khẩn cấp' : 'Bình thường'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Statistics */}
          <div className="info-section">
            <h5>Thống kê cuộc hội thoại</h5>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">{room?.messageCount || 0}</div>
                <div className="stat-label">Tin nhắn</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{room?.duration || '0 phút'}</div>
                <div className="stat-label">Thời lượng</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{room?.fileCount || 0}</div>
                <div className="stat-label">File đính kèm</div>
              </div>
            </div>
          </div>

          {/* Previous Conversations */}
          {customer?.previousConversations && customer.previousConversations.length > 0 && (
            <div className="info-section">
              <h5>Cuộc hội thoại trước</h5>
              <div className="conversation-list">
                {customer.previousConversations.map((conv, index) => (
                  <div key={index} className="conversation-item">
                    <div className="conversation-info">
                      <span className="conversation-date">
                        {new Date(conv.date).toLocaleDateString('vi-VN')}
                      </span>
                      <span className="conversation-subject">{conv.subject}</span>
                    </div>
                    <span className={`conversation-status ${conv.status}`}>
                      {conv.status === 'resolved' ? 'Đã giải quyết' : 'Chưa giải quyết'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Đóng
          </button>
          <button className="btn-primary">
            <i className="ri-user-settings-line"></i>
            Cập nhật thông tin
          </button>
        </div>
      </div>

      <style jsx>{`
        .customer-info-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 1rem;
        }

        .modal-content {
          background: white;
          border-radius: 1rem;
          max-width: 500px;
          width: 100%;
          max-height: 80vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-header h3 {
          margin: 0;
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--text-dark);
        }

        .close-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: none;
          background: #f3f4f6;
          border-radius: 50%;
          cursor: pointer;
          color: var(--text-dark);
          transition: background-color 0.2s;
        }

        .close-btn:hover {
          background: #e5e7eb;
        }

        .modal-body {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
        }

        .customer-section {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #f3f4f6;
        }

        .customer-avatar {
          width: 60px;
          height: 60px;
        }

        .customer-avatar img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }

        .customer-details h4 {
          margin: 0 0 0.25rem 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-dark);
        }

        .customer-type {
          margin: 0;
          font-size: 0.85rem;
          color: var(--text-light);
          background: #f3f4f6;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          display: inline-block;
        }

        .info-section {
          margin-bottom: 2rem;
        }

        .info-section h5 {
          margin: 0 0 1rem 0;
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-dark);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .info-grid {
          display: grid;
          gap: 1rem;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: #f8fafc;
          border-radius: 0.5rem;
        }

        .info-item i {
          font-size: 1.1rem;
          color: var(--primary-color);
          width: 20px;
          text-align: center;
        }

        .info-item div {
          flex: 1;
        }

        .info-item label {
          display: block;
          font-size: 0.75rem;
          color: var(--text-light);
          margin-bottom: 0.25rem;
          font-weight: 500;
        }

        .info-item span {
          font-size: 0.9rem;
          color: var(--text-dark);
        }

        .priority-badge {
          font-size: 0.75rem !important;
          padding: 0.25rem 0.5rem;
          border-radius: 0.75rem;
          font-weight: 500;
          color: white;
        }

        .priority-badge.normal {
          background: #6b7280;
        }

        .priority-badge.high {
          background: #f59e0b;
        }

        .priority-badge.urgent {
          background: #ef4444;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        .stat-item {
          text-align: center;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 0.5rem;
        }

        .stat-number {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary-color);
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.8rem;
          color: var(--text-light);
        }

        .conversation-list {
          space-y: 0.5rem;
        }

        .conversation-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem;
          background: #f8fafc;
          border-radius: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .conversation-info {
          flex: 1;
        }

        .conversation-date {
          font-size: 0.8rem;
          color: var(--text-light);
          display: block;
        }

        .conversation-subject {
          font-size: 0.9rem;
          color: var(--text-dark);
          font-weight: 500;
        }

        .conversation-status {
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
          border-radius: 0.75rem;
          font-weight: 500;
        }

        .conversation-status.resolved {
          background: #dcfce7;
          color: #166534;
        }

        .conversation-status.pending {
          background: #fef3c7;
          color: #92400e;
        }

        .modal-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 1rem;
          padding: 1.5rem;
          border-top: 1px solid #e5e7eb;
        }

        .btn-secondary {
          padding: 0.5rem 1rem;
          border: 1px solid #e5e7eb;
          background: white;
          color: var(--text-dark);
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-secondary:hover {
          background: #f8fafc;
          border-color: var(--primary-color);
        }

        .btn-primary {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border: none;
          background: var(--primary-color);
          color: white;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .btn-primary:hover {
          background: #3730a3;
        }

        @media (max-width: 768px) {
          .customer-info-modal {
            padding: 0.5rem;
          }

          .modal-content {
            max-height: 90vh;
          }

          .modal-header,
          .modal-body,
          .modal-footer {
            padding: 1rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .customer-section {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default CustomerInfo;
