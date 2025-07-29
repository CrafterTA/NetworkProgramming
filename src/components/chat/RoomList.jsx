import React, { useState } from 'react';
import { useChatContext } from '../../contexts/ChatContext';

const RoomList = ({ onRoomSelect, selectedRoomId }) => {
  const { rooms, joinRoom, leaveRoom } = useChatContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, waiting, closed

  // Filter and search rooms
  const filteredRooms = rooms.filter(room => {
    // Search filter
    const matchesSearch = 
      room.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.subject?.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesFilter = 
      filter === 'all' ||
      (filter === 'active' && room.status === 'active') ||
      (filter === 'waiting' && room.status === 'waiting') ||
      (filter === 'closed' && room.status === 'closed');

    return matchesSearch && matchesFilter;
  });

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return date.toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffDays <= 7) {
      return `${diffDays} ngày`;
    } else {
      return date.toLocaleDateString('vi-VN');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'waiting': return '#f59e0b';
      case 'closed': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Đang hoạt động';
      case 'waiting': return 'Chờ xử lý';
      case 'closed': return 'Đã đóng';
      default: return 'Không xác định';
    }
  };

  const handleRoomClick = async (room) => {
    try {
      if (room.status !== 'closed') {
        await joinRoom(room.id);
      }
      onRoomSelect(room);
    } catch (error) {
      console.error('Failed to join room:', error);
    }
  };

  return (
    <div className="room-list">
      {/* Header */}
      <div className="room-list-header">
        <h3>Danh sách phòng chat</h3>
        <div className="room-count">
          {filteredRooms.length} phòng
        </div>
      </div>

      {/* Search */}
      <div className="search-section">
        <div className="search-input">
          <i className="ri-search-line"></i>
          <input
            type="text"
            placeholder="Tìm kiếm phòng chat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="filter-section">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Tất cả
        </button>
        <button
          className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Hoạt động
        </button>
        <button
          className={`filter-btn ${filter === 'waiting' ? 'active' : ''}`}
          onClick={() => setFilter('waiting')}
        >
          Chờ xử lý
        </button>
        <button
          className={`filter-btn ${filter === 'closed' ? 'active' : ''}`}
          onClick={() => setFilter('closed')}
        >
          Đã đóng
        </button>
      </div>

      {/* Room List */}
      <div className="rooms-container">
        {filteredRooms.length === 0 ? (
          <div className="empty-rooms">
            <i className="ri-chat-3-line"></i>
            <p>Không có phòng chat nào</p>
          </div>
        ) : (
          filteredRooms.map(room => (
            <div
              key={room.id}
              className={`room-item ${selectedRoomId === room.id ? 'selected' : ''}`}
              onClick={() => handleRoomClick(room)}
            >
              {/* Customer Avatar */}
              <div className="room-avatar">
                {room.customer?.avatar ? (
                  <img src={room.customer.avatar} alt={room.customer.name} />
                ) : (
                  <div className="avatar-placeholder">
                    {room.customer?.name?.charAt(0)?.toUpperCase() || 'K'}
                  </div>
                )}
                {/* Status Indicator */}
                <div 
                  className="status-dot"
                  style={{ backgroundColor: getStatusColor(room.status) }}
                ></div>
              </div>

              {/* Room Info */}
              <div className="room-info">
                <div className="room-header">
                  <div className="customer-name">
                    {room.customer?.name || 'Khách hàng'}
                  </div>
                  <div className="room-time">
                    {formatTime(room.lastActivity || room.createdAt)}
                  </div>
                </div>

                <div className="room-details">
                  <div className="room-subject">
                    {room.subject || `Phòng ${room.id}`}
                  </div>
                  <div 
                    className="room-status"
                    style={{ color: getStatusColor(room.status) }}
                  >
                    {getStatusText(room.status)}
                  </div>
                </div>

                {/* Last Message */}
                {room.lastMessage && (
                  <div className="last-message">
                    {room.lastMessage.type === 'file' ? (
                      <span>
                        <i className="ri-attachment-line"></i>
                        Đã gửi file
                      </span>
                    ) : (
                      <span>{room.lastMessage.content}</span>
                    )}
                  </div>
                )}

                {/* Unread Count */}
                {room.unreadCount > 0 && (
                  <div className="unread-badge">
                    {room.unreadCount > 99 ? '99+' : room.unreadCount}
                  </div>
                )}
              </div>

              {/* Room Actions */}
              <div className="room-actions">
                {room.status === 'active' && (
                  <button
                    className="action-btn close-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      leaveRoom(room.id);
                    }}
                    title="Rời khỏi phòng"
                  >
                    <i className="ri-logout-circle-line"></i>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .room-list {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: white;
        }

        .room-list-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .room-list-header h3 {
          margin: 0;
          font-size: 1.1rem;
          color: var(--text-dark);
        }

        .room-count {
          font-size: 0.8rem;
          color: var(--text-light);
          background: #f3f4f6;
          padding: 0.25rem 0.5rem;
          border-radius: 1rem;
        }

        .search-section {
          padding: 1rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .search-input {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-input i {
          position: absolute;
          left: 0.75rem;
          color: var(--text-light);
          z-index: 1;
        }

        .search-input input {
          width: 100%;
          padding: 0.75rem 0.75rem 0.75rem 2.5rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.2s;
        }

        .search-input input:focus {
          border-color: var(--primary-color);
        }

        .filter-section {
          display: flex;
          gap: 0.5rem;
          padding: 1rem;
          border-bottom: 1px solid #e5e7eb;
          overflow-x: auto;
        }

        .filter-btn {
          padding: 0.5rem 1rem;
          border: 1px solid #d1d5db;
          background: white;
          color: var(--text-dark);
          border-radius: 1rem;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .filter-btn:hover {
          border-color: var(--primary-color);
          color: var(--primary-color);
        }

        .filter-btn.active {
          background: var(--primary-color);
          border-color: var(--primary-color);
          color: white;
        }

        .rooms-container {
          flex: 1;
          overflow-y: auto;
          padding: 0.5rem 0;
        }

        .empty-rooms {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 1rem;
          color: var(--text-light);
          text-align: center;
        }

        .empty-rooms i {
          font-size: 3rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .room-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 1rem;
          cursor: pointer;
          transition: background 0.2s;
          border-bottom: 1px solid #f3f4f6;
          position: relative;
        }

        .room-item:hover {
          background: #f9fafb;
        }

        .room-item.selected {
          background: #eff6ff;
          border-left: 3px solid var(--primary-color);
        }

        .room-avatar {
          position: relative;
          width: 40px;
          height: 40px;
          flex-shrink: 0;
        }

        .room-avatar img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
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
          font-size: 0.9rem;
          font-weight: 600;
          border-radius: 50%;
        }

        .status-dot {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid white;
        }

        .room-info {
          flex: 1;
          min-width: 0;
          position: relative;
        }

        .room-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.25rem;
        }

        .customer-name {
          font-weight: 500;
          color: var(--text-dark);
          font-size: 0.9rem;
        }

        .room-time {
          font-size: 0.75rem;
          color: var(--text-light);
          flex-shrink: 0;
        }

        .room-details {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.25rem;
        }

        .room-subject {
          font-size: 0.8rem;
          color: var(--text-light);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
          margin-right: 0.5rem;
        }

        .room-status {
          font-size: 0.75rem;
          font-weight: 500;
          flex-shrink: 0;
        }

        .last-message {
          font-size: 0.8rem;
          color: var(--text-light);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-top: 0.25rem;
        }

        .last-message i {
          margin-right: 0.25rem;
        }

        .unread-badge {
          position: absolute;
          top: 0;
          right: 0;
          background: #ef4444;
          color: white;
          font-size: 0.7rem;
          font-weight: 600;
          padding: 0.2rem 0.4rem;
          border-radius: 1rem;
          min-width: 18px;
          text-align: center;
        }

        .room-actions {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .room-item:hover .room-actions {
          opacity: 1;
        }

        .action-btn {
          background: none;
          border: none;
          color: var(--text-light);
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 0.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          font-size: 0.9rem;
        }

        .action-btn:hover {
          background: #f3f4f6;
          color: var(--text-dark);
        }

        .close-btn:hover {
          color: #ef4444;
        }

        @media (max-width: 768px) {
          .room-list-header {
            padding: 0.75rem;
          }

          .search-section,
          .filter-section {
            padding: 0.75rem;
          }

          .room-item {
            padding: 0.75rem;
            gap: 0.6rem;
          }

          .room-avatar {
            width: 36px;
            height: 36px;
          }

          .status-dot {
            width: 10px;
            height: 10px;
          }

          .customer-name {
            font-size: 0.85rem;
          }

          .room-time,
          .room-status {
            font-size: 0.7rem;
          }

          .room-subject,
          .last-message {
            font-size: 0.75rem;
          }

          .filter-section {
            gap: 0.4rem;
          }

          .filter-btn {
            padding: 0.4rem 0.8rem;
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default RoomList;
