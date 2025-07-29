import React, { useState } from 'react';

const GuestInfoForm = ({ onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: 'Yêu cầu hỗ trợ tổng quát'
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ tên';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Họ tên phải có ít nhất 2 ký tự';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9+\-\s()]{10,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="guest-form-container">
      <div className="guest-form-header">
        <div className="header-content">
          <i className="ri-chat-3-line"></i>
          <div>
            <h3>Bắt đầu hỗ trợ</h3>
            <p>Vui lòng cung cấp thông tin của bạn để được hỗ trợ tốt nhất</p>
          </div>
        </div>
        <button className="close-btn" onClick={onCancel}>
          <i className="ri-close-line"></i>
        </button>
      </div>

      <form className="guest-form" onSubmit={handleSubmit}>
        {/* Full Name */}
        <div className="form-group">
          <label htmlFor="fullName">
            <i className="ri-user-line"></i>
            Họ và tên *
          </label>
          <input
            id="fullName"
            type="text"
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            placeholder="Nhập họ và tên của bạn"
            className={errors.fullName ? 'error' : ''}
            disabled={isLoading}
          />
          {errors.fullName && <span className="error-text">{errors.fullName}</span>}
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="email">
            <i className="ri-mail-line"></i>
            Email *
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="Nhập địa chỉ email"
            className={errors.email ? 'error' : ''}
            disabled={isLoading}
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        {/* Phone */}
        <div className="form-group">
          <label htmlFor="phone">
            <i className="ri-phone-line"></i>
            Số điện thoại *
          </label>
          <input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="Nhập số điện thoại"
            className={errors.phone ? 'error' : ''}
            disabled={isLoading}
          />
          {errors.phone && <span className="error-text">{errors.phone}</span>}
        </div>

        {/* Subject */}
        <div className="form-group">
          <label htmlFor="subject">
            <i className="ri-question-line"></i>
            Vấn đề cần hỗ trợ
          </label>
          <select
            id="subject"
            value={formData.subject}
            onChange={(e) => handleChange('subject', e.target.value)}
            disabled={isLoading}
          >
            <option value="Yêu cầu hỗ trợ tổng quát">Yêu cầu hỗ trợ tổng quát</option>
            <option value="Hỗ trợ khóa học">Hỗ trợ khóa học</option>
            <option value="Vấn đề thanh toán">Vấn đề thanh toán</option>
            <option value="Báo lỗi hệ thống">Báo lỗi hệ thống</option>
            <option value="Góp ý - Phản hồi">Góp ý - Phản hồi</option>
            <option value="Khác">Khác</option>
          </select>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-btn" 
            onClick={onCancel}
            disabled={isLoading}
          >
            Hủy
          </button>
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <i className="ri-loader-4-line spinning"></i>
                Đang xử lý...
              </>
            ) : (
              <>
                <i className="ri-send-plane-fill"></i>
                Bắt đầu chat
              </>
            )}
          </button>
        </div>
      </form>

      {/* Privacy Notice */}
      <div className="privacy-notice">
        <i className="ri-shield-check-line"></i>
        <p>
          Thông tin của bạn sẽ được bảo mật và chỉ sử dụng cho mục đích hỗ trợ.
          Chúng tôi cam kết không chia sẻ thông tin cá nhân với bên thứ ba.
        </p>
      </div>

      <style jsx>{`
        .guest-form-container {
          display: flex;
          flex-direction: column;
          max-height: 100%;
          background: white;
        }

        .guest-form-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
          background: linear-gradient(135deg, var(--primary-color), #019296);
          color: white;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .header-content i {
          font-size: 2rem;
          opacity: 0.9;
        }

        .header-content h3 {
          margin: 0 0 0.25rem 0;
          font-size: 1.3rem;
          font-weight: 600;
        }

        .header-content p {
          margin: 0;
          font-size: 0.9rem;
          opacity: 0.9;
          line-height: 1.4;
        }

        .close-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 0.5rem;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .guest-form {
          flex: 1;
          padding: 1.5rem;
          overflow-y: auto;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: var(--text-dark);
          font-size: 0.9rem;
        }

        .form-group label i {
          color: var(--primary-color);
          font-size: 1rem;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 0.9rem;
          transition: all 0.2s;
          outline: none;
        }

        .form-group input:focus,
        .form-group select:focus {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(1, 187, 191, 0.1);
        }

        .form-group input.error,
        .form-group select.error {
          border-color: var(--error-color);
        }

        .form-group input:disabled,
        .form-group select:disabled {
          background: #f9fafb;
          cursor: not-allowed;
          opacity: 0.7;
        }

        .error-text {
          display: block;
          color: var(--error-color);
          font-size: 0.8rem;
          margin-top: 0.25rem;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }

        .cancel-btn,
        .submit-btn {
          flex: 1;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .cancel-btn {
          background: #f3f4f6;
          color: var(--text-dark);
        }

        .cancel-btn:hover:not(:disabled) {
          background: #e5e7eb;
        }

        .submit-btn {
          background: var(--primary-color);
          color: white;
        }

        .submit-btn:hover:not(:disabled) {
          background: var(--primary-dark);
          transform: translateY(-1px);
        }

        .cancel-btn:disabled,
        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .privacy-notice {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 1rem 1.5rem;
          background: #f0f9ff;
          border-top: 1px solid #e0f2fe;
          font-size: 0.8rem;
          color: var(--text-light);
          line-height: 1.4;
        }

        .privacy-notice i {
          color: var(--primary-color);
          font-size: 1rem;
          flex-shrink: 0;
          margin-top: 0.1rem;
        }

        .privacy-notice p {
          margin: 0;
        }

        .spinning {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .guest-form-header {
            padding: 1rem;
          }

          .header-content {
            gap: 0.75rem;
          }

          .header-content i {
            font-size: 1.75rem;
          }

          .header-content h3 {
            font-size: 1.2rem;
          }

          .header-content p {
            font-size: 0.85rem;
          }

          .guest-form {
            padding: 1rem;
          }

          .form-group {
            margin-bottom: 1.25rem;
          }

          .form-actions {
            flex-direction: column;
          }

          .privacy-notice {
            padding: 0.75rem 1rem;
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default GuestInfoForm;
