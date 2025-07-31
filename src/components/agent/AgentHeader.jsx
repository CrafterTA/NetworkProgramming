import React, { useState } from 'react';

const AgentHeader = ({ 
  agent, 
  status, 
  onStatusChange, 
  isConnected, 
  onSidebarToggle, 
  sidebarCollapsed 
}) => {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const statusOptions = [
    { value: 'online', label: 'Trực tuyến', color: '#10b981', icon: 'ri-checkbox-blank-circle-fill' },
    { value: 'busy', label: 'Bận', color: '#f59e0b', icon: 'ri-checkbox-blank-circle-fill' },
    { value: 'away', label: 'Vắng mặt', color: '#6b7280', icon: 'ri-checkbox-blank-circle-fill' },
    { value: 'offline', label: 'Offline', color: '#ef4444', icon: 'ri-checkbox-blank-circle-line' }
  ];

  const currentStatus = statusOptions.find(s => s.value === status);

  const handleLogout = () => {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
  };

  return (
    <header className="agent-header">
      <div className="header-left">
        <button 
          className="sidebar-toggle"
          onClick={onSidebarToggle}
          title={sidebarCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
        >
          <i className="ri-menu-line"></i>
        </button>

        <div className="logo-section">
          <img src="https://file1.hutech.edu.vn/file/editor/homepage/stories/hinh34/logo%20CMYK-03.png" alt="HUTECH" className="logo" />
          <div className="brand-info">
            <h2>HUTECH Support</h2>
            <span className="role-badge">Agent Dashboard</span>
          </div>
        </div>
      </div>

      <div className="header-center">
        <div className="connection-status">
          <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
            <i className={`ri-wifi-${isConnected ? 'fill' : 'off-line'}`}></i>
            <span>{isConnected ? 'Đã kết nối' : 'Mất kết nối'}</span>
          </div>
        </div>
      </div>

      <div className="header-right">
        {/* Status Selector */}
        <div className="status-selector">
          <button 
            className="status-button"
            onClick={() => setShowStatusMenu(!showStatusMenu)}
          >
            <i className={currentStatus.icon} style={{ color: currentStatus.color }}></i>
            <span>{currentStatus.label}</span>
            <i className="ri-arrow-down-s-line"></i>
          </button>

          {showStatusMenu && (
            <div className="status-menu">
              {statusOptions.map(option => (
                <button
                  key={option.value}
                  className={`status-option ${status === option.value ? 'active' : ''}`}
                  onClick={() => {
                    onStatusChange(option.value);
                    setShowStatusMenu(false);
                  }}
                >
                  <i className={option.icon} style={{ color: option.color }}></i>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <button className="notification-button">
          <i className="ri-notification-3-line"></i>
          <span className="notification-badge">3</span>
        </button>

        {/* Profile Menu */}
        <div className="profile-section">
          <button 
            className="profile-button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="avatar">
              <img 
                src={agent?.Avatar || '/src/assets/default-avatar.png'} 
                alt={agent?.FullName}
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(agent?.FullName || 'Agent')}&background=4f46e5&color=ffffff`;
                }}
              />
              <div className={`status-dot ${status}`}></div>
            </div>
            <div className="profile-info">
              <span className="name">{agent?.FullName}</span>
              <span className="role">{agent?.Role}</span>
            </div>
            <i className="ri-arrow-down-s-line"></i>
          </button>

          {showProfileMenu && (
            <div className="profile-menu">
              <div className="menu-header">
                <div className="avatar-large">
                  <img 
                    src={agent?.Avatar || '/src/assets/default-avatar.png'} 
                    alt={agent?.FullName}
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(agent?.FullName || 'Agent')}&background=4f46e5&color=ffffff`;
                    }}
                  />
                </div>
                <div>
                  <h4>{agent?.FullName}</h4>
                  <p>{agent?.Email}</p>
                </div>
              </div>
              
              <div className="menu-divider"></div>
              
              <button className="menu-item">
                <i className="ri-user-line"></i>
                <span>Hồ sơ cá nhân</span>
              </button>
              
              <button className="menu-item">
                <i className="ri-settings-line"></i>
                <span>Cài đặt</span>
              </button>
              
              <button className="menu-item">
                <i className="ri-question-line"></i>
                <span>Trợ giúp</span>
              </button>
              
              <div className="menu-divider"></div>
              
              <button className="menu-item logout" onClick={handleLogout}>
                <i className="ri-logout-box-line"></i>
                <span>Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .agent-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.5rem;
          height: 70px;
          background: white;
          border-bottom: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          position: relative;
          z-index: 1000;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .sidebar-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border: none;
          background: #f3f4f6;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .sidebar-toggle:hover {
          background: #e5e7eb;
        }

        .sidebar-toggle i {
          font-size: 1.2rem;
          color: var(--agent-text-dark);
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .logo {
          height: 40px;
          width: auto;
        }

        .brand-info h2 {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--primary-color);
          margin: 0;
        }

        .role-badge {
          font-size: 0.75rem;
          color: var(--text-light);
          background: #f3f4f6;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
        }

        .header-center {
          flex: 1;
          display: flex;
          justify-content: center;
        }

        .connection-status {
          display: flex;
          align-items: center;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .status-indicator.connected {
          background: #dcfce7;
          color: #166534;
        }

        .status-indicator.disconnected {
          background: #fef2f2;
          color: #dc2626;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 1rem;
          position: relative;
        }

        .status-selector {
          position: relative;
        }

        .status-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border: 1px solid #e5e7eb;
          background: white;
          border-radius: 0.5rem;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s;
        }

        .status-button:hover {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .status-menu {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 0.5rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          min-width: 160px;
          z-index: 1000;
        }

        .status-option {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.75rem 1rem;
          border: none;
          background: none;
          text-align: left;
          cursor: pointer;
          transition: background-color 0.2s;
          font-size: 0.9rem;
        }

        .status-option:hover,
        .status-option.active {
          background: #f8fafc;
        }

        .notification-button {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border: none;
          background: #f3f4f6;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .notification-button:hover {
          background: #e5e7eb;
        }

        .notification-button i {
          font-size: 1.1rem;
          color: var(--text-dark);
        }

        .notification-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          background: #ef4444;
          color: white;
          font-size: 0.7rem;
          padding: 0.1rem 0.3rem;
          border-radius: 0.75rem;
          min-width: 16px;
          text-align: center;
        }

        .profile-section {
          position: relative;
        }

        .profile-button {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem;
          border: none;
          background: none;
          cursor: pointer;
          border-radius: 0.5rem;
          transition: background-color 0.2s;
        }

        .profile-button:hover {
          background: #f8fafc;
        }

        .avatar {
          position: relative;
          width: 40px;
          height: 40px;
        }

        .avatar img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }

        .status-dot {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid white;
        }

        .status-dot.online { background: #10b981; }
        .status-dot.busy { background: #f59e0b; }
        .status-dot.away { background: #6b7280; }
        .status-dot.offline { background: #ef4444; }

        .profile-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .profile-info .name {
          font-weight: 600;
          color: var(--text-dark);
          font-size: 0.9rem;
        }

        .profile-info .role {
          font-size: 0.8rem;
          color: var(--text-light);
        }

        .profile-menu {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 0.5rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          min-width: 280px;
        }

        .menu-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
        }

        .avatar-large {
          width: 50px;
          height: 50px;
        }

        .avatar-large img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }

        .menu-header h4 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-dark);
        }

        .menu-header p {
          margin: 0;
          font-size: 0.8rem;
          color: var(--text-light);
        }

        .menu-divider {
          height: 1px;
          background: #e5e7eb;
          margin: 0 1rem;
        }

        .menu-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          padding: 0.75rem 1.5rem;
          border: none;
          background: none;
          text-align: left;
          cursor: pointer;
          transition: background-color 0.2s;
          font-size: 0.9rem;
          color: var(--text-dark);
        }

        .menu-item:hover {
          background: #f8fafc;
        }

        .menu-item.logout {
          color: #ef4444;
        }

        .menu-item.logout:hover {
          background: #fef2f2;
        }

        .menu-item i {
          font-size: 1.1rem;
          width: 20px;
        }

        @media (max-width: 768px) {
          .agent-header {
            padding: 0 1rem;
          }

          .brand-info h2 {
            display: none;
          }

          .header-center {
            display: none;
          }

          .profile-info {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};

export default AgentHeader;
