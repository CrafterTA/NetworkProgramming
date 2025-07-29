import React from 'react';

const QuickActions = ({ onSelectTemplate, onClose }) => {
  const quickTemplates = [
    {
      id: 1,
      title: 'Chào hỏi',
      content: 'Xin chào! Tôi là nhân viên hỗ trợ của HUTECH. Tôi có thể giúp gì cho bạn hôm nay?',
      icon: 'ri-hand-heart-line'
    },
    {
      id: 2,
      title: 'Xin lỗi',
      content: 'Xin lỗi bạn vì sự bất tiện này. Tôi sẽ giúp bạn giải quyết vấn đề một cách nhanh chóng.',
      icon: 'ri-emotion-unhappy-line'
    },
    {
      id: 3,
      title: 'Chờ một chút',
      content: 'Vui lòng chờ một chút để tôi kiểm tra thông tin và tìm giải pháp tốt nhất cho bạn.',
      icon: 'ri-time-line'
    },
    {
      id: 4,
      title: 'Yêu cầu thông tin',
      content: 'Để có thể hỗ trợ bạn tốt hơn, bạn có thể cung cấp thêm thông tin chi tiết về vấn đề không?',
      icon: 'ri-question-line'
    },
    {
      id: 5,
      title: 'Hướng dẫn',
      content: 'Tôi sẽ hướng dẫn bạn từng bước để giải quyết vấn đề này:',
      icon: 'ri-guide-line'
    },
    {
      id: 6,
      title: 'Liên hệ khác',
      content: 'Nếu vấn đề vẫn chưa được giải quyết, bạn có thể liên hệ qua email: support@hutech.edu.vn hoặc hotline: 028 5445 7777',
      icon: 'ri-phone-line'
    },
    {
      id: 7,
      title: 'Cảm ơn',
      content: 'Cảm ơn bạn đã liên hệ với HUTECH Support. Hy vọng tôi đã giúp bạn giải quyết được vấn đề!',
      icon: 'ri-heart-line'
    },
    {
      id: 8,
      title: 'Kết thúc',
      content: 'Cuộc hội thoại này đã được hoàn thành. Cảm ơn bạn đã sử dụng dịch vụ hỗ trợ của chúng tôi. Chúc bạn một ngày tốt lành!',
      icon: 'ri-check-double-line'
    }
  ];

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="quick-actions-panel">
      <div className="panel-header">
        <h4>
          <i className="ri-magic-line"></i>
          Hành động nhanh
        </h4>
        <button className="close-btn" onClick={onClose}>
          <i className="ri-close-line"></i>
        </button>
      </div>

      <div className="templates-grid">
        {quickTemplates.map(template => (
          <button
            key={template.id}
            className="template-card"
            onClick={() => onSelectTemplate(template)}
          >
            <div className="template-icon">
              <i className={template.icon}></i>
            </div>
            <div className="template-content">
              <h5>{template.title}</h5>
              <p>{template.content}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="panel-footer">
        <button className="action-btn">
          <i className="ri-add-line"></i>
          Tạo mẫu mới
        </button>
        <button className="action-btn">
          <i className="ri-settings-line"></i>
          Quản lý mẫu
        </button>
      </div>

      <style jsx>{`
        .quick-actions-panel {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #e5e7eb;
          border-top: none;
          max-height: 400px;
          overflow-y: auto;
          z-index: 1000;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #e5e7eb;
          background: #f8fafc;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .panel-header h4 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-dark);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .panel-header i {
          color: var(--primary-color);
        }

        .close-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border: none;
          background: #e5e7eb;
          border-radius: 50%;
          cursor: pointer;
          color: var(--text-dark);
          transition: background-color 0.2s;
        }

        .close-btn:hover {
          background: #d1d5db;
        }

        .templates-grid {
          padding: 1rem;
          display: grid;
          gap: 0.75rem;
        }

        .template-card {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1rem;
          border: 1px solid #e5e7eb;
          background: white;
          border-radius: 0.75rem;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s;
          width: 100%;
        }

        .template-card:hover {
          border-color: var(--primary-color);
          background: #f8fafc;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .template-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: var(--primary-color);
          color: white;
          border-radius: 0.5rem;
          flex-shrink: 0;
        }

        .template-icon i {
          font-size: 1.2rem;
        }

        .template-content {
          flex: 1;
          min-width: 0;
        }

        .template-content h5 {
          margin: 0 0 0.5rem 0;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-dark);
        }

        .template-content p {
          margin: 0;
          font-size: 0.8rem;
          color: var(--text-light);
          line-height: 1.4;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .panel-footer {
          display: flex;
          gap: 0.5rem;
          padding: 1rem;
          border-top: 1px solid #e5e7eb;
          background: #f8fafc;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border: 1px solid #e5e7eb;
          background: white;
          color: var(--text-dark);
          border-radius: 0.5rem;
          cursor: pointer;
          font-size: 0.85rem;
          transition: all 0.2s;
          flex: 1;
          justify-content: center;
        }

        .action-btn:hover {
          border-color: var(--primary-color);
          background: #f8fafc;
        }

        .action-btn i {
          font-size: 1rem;
        }

        @media (max-width: 768px) {
          .quick-actions-panel {
            max-height: 300px;
          }

          .panel-header {
            padding: 0.75rem 1rem;
          }

          .panel-header h4 {
            font-size: 0.9rem;
          }

          .templates-grid {
            padding: 0.75rem;
          }

          .template-card {
            padding: 0.75rem;
            gap: 0.75rem;
          }

          .template-icon {
            width: 32px;
            height: 32px;
          }

          .template-icon i {
            font-size: 1rem;
          }

          .template-content h5 {
            font-size: 0.85rem;
          }

          .template-content p {
            font-size: 0.75rem;
            -webkit-line-clamp: 1;
          }

          .panel-footer {
            padding: 0.75rem;
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default QuickActions;
