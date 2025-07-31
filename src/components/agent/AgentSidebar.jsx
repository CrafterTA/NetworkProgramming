import React, { useState, useMemo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const AgentSidebar = ({ 
  rooms, 
  selectedRoom, 
  onRoomSelect, 
  collapsed, 
  onlineAgents, 
  currentAgent,
  onMarkAsRead 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, waiting, active, closed
  const [showAgentList, setShowAgentList] = useState(false);

  // Filter and search rooms
  const filteredRooms = useMemo(() => {
    let filtered = rooms;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(room => room.status === filterStatus);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(room => 
        (room.customer_name || room.customer?.name)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.subject?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by latest activity
    return filtered.sort((a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at));
  }, [rooms, searchTerm, filterStatus]);

  const handleRoomClick = async (room) => {
    // Mark as read if there are unread messages
    if (room.unread_count > 0 && onMarkAsRead) {
      await onMarkAsRead(room.room_id || room.id);
    }
    onRoomSelect(room);
  };
  const getStatusColor = (status) => {
    switch (status) {
      case 'waiting': return '#f59e0b';
      case 'active': return '#10b981';
      case 'closed': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'waiting': return 'Chờ xử lý';
      case 'active': return 'Đang xử lý';
      case 'closed': return 'Đã đóng';
      default: return 'Không xác định';
    }
  };

  const formatTime = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true, 
        locale: vi 
      });
    } catch {
      return 'Vừa xong';
    }
  };

  const getLastMessage = (room) => {
    if (!room.lastMessage) return 'Chưa có tin nhắn';
    
    if (room.lastMessage.type === 'file') {
      return `📎 ${room.lastMessage.fileName || 'File đính kèm'}`;
    }
    
    return room.lastMessage.content || 'Tin nhắn mới';
  };

  const statusCounts = useMemo(() => {
    return {
      all: rooms.length,
      waiting: rooms.filter(r => r.status === 'waiting').length,
      active: rooms.filter(r => r.status === 'active').length,
      closed: rooms.filter(r => r.status === 'closed').length
    };
  }, [rooms]);

  if (collapsed) {
    return (
      <div className="agent-sidebar collapsed">
        <div className="sidebar-header">
          <button className="filter-button active">
            <i className="ri-chat-4-line"></i>
          </button>
        </div>
        
        <div className="room-list">
          {filteredRooms.slice(0, 5).map(room => (
            <button
              key={room.room_id || room.id}
              className={`room-item collapsed ${selectedRoom?.room_id === room.room_id || selectedRoom?.id === room.id ? 'active' : ''}`}
              onClick={() => handleRoomClick(room)}
            >
              <div className="room-avatar">
                <img 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(room.customer_name || room.customer?.name || 'Guest')}&background=4f46e5&color=ffffff`}
                  alt={room.customer_name || room.customer?.name || 'Guest'}
                />
                <div 
                  className="status-indicator"
                  style={{ backgroundColor: getStatusColor(room.status) }}
                ></div>
                {(room.unread_count > 0) && (
                  <div className="unread-badge-collapsed">
                    {room.unread_count > 99 ? '99+' : room.unread_count}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        <style>{`
          .agent-sidebar.collapsed {
            width: 70px !important;
            min-width: 70px !important;
          }

          .sidebar-header {
            padding: 1rem 0.5rem;
            border-bottom: 1px solid #e5e7eb;
          }

          .filter-button {
            width: 100%;
            padding: 0.75rem;
            border: none;
            background: var(--primary-color);
            color: white;
            border-radius: 0.5rem;
            cursor: pointer;
          }

          .room-item.collapsed {
            padding: 0.75rem 0.5rem !important;
            justify-content: center;
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

          .status-indicator {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: 2px solid white;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="agent-sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <h3>Cuộc hội thoại</h3>
        
        {/* Search */}
        <div className="search-box">
          <i className="ri-search-line"></i>
          <input
            type="text"
            placeholder="Tìm kiếm cuộc hội thoại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Status Filters */}
        <div className="status-filters">
          <button
            className={`filter-button ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            Tất cả ({statusCounts.all})
          </button>
          <button
            className={`filter-button ${filterStatus === 'waiting' ? 'active' : ''}`}
            onClick={() => setFilterStatus('waiting')}
          >
            Chờ xử lý ({statusCounts.waiting})
          </button>
          <button
            className={`filter-button ${filterStatus === 'active' ? 'active' : ''}`}
            onClick={() => setFilterStatus('active')}
          >
            Đang xử lý ({statusCounts.active})
          </button>
        </div>
      </div>

      {/* Room List */}
      <div className="room-list">
        {filteredRooms.length === 0 ? (
          <div className="empty-state">
            <i className="ri-chat-3-line"></i>
            <p>Không có cuộc hội thoại nào</p>
          </div>
        ) : (
          filteredRooms.map(room => (
            <button
              key={room.room_id || room.id}
              className={`room-item ${selectedRoom?.room_id === room.room_id || selectedRoom?.id === room.id ? 'active' : ''}`}
              onClick={() => handleRoomClick(room)}
            >
              <div className="room-avatar">
                <img 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(room.customer_name || room.customer?.name || 'Guest')}&background=4f46e5&color=ffffff`}
                  alt={room.customer_name || room.customer?.name || 'Guest'}
                />
                <div 
                  className="status-indicator"
                  style={{ backgroundColor: getStatusColor(room.status) }}
                ></div>
                {(room.unread_count > 0) && (
                  <div className="unread-badge-avatar">
                    {room.unread_count > 99 ? '99+' : room.unread_count}
                  </div>
                )}
              </div>

              <div className="room-info">
                <div className="room-header">
                  <h4 className="customer-name">
                    {room.customer_name || room.customer?.name || 'Khách vãng lai'}
                  </h4>
                  <span className="time">
                    {formatTime(room.updated_at || room.created_at)}
                  </span>
                </div>

                <div className="room-details">
                  <p className="last-message">
                    {getLastMessage(room)}
                  </p>
                  <div className="room-meta">
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(room.status) }}
                    >
                      {getStatusText(room.status)}
                    </span>
                    {(room.unread_count > 0) && (
                      <span className="unread-badge-meta">
                        <i className="ri-mail-unread-line"></i>
                        {room.unread_count > 99 ? '99+' : room.unread_count}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Online Agents */}
      <div className="agents-section">
        <button 
          className="agents-toggle"
          onClick={() => setShowAgentList(!showAgentList)}
        >
          <div className="agents-info">
            <i className="ri-team-line"></i>
            <span>Agents ({onlineAgents.length} online)</span>
          </div>
          <i className={`ri-arrow-${showAgentList ? 'up' : 'down'}-s-line`}></i>
        </button>

        {showAgentList && (
          <div className="agents-list">
            {onlineAgents.map(agent => (
              <div key={agent.id} className="agent-item">
                <div className="agent-avatar">
                  <img 
                    src={agent.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(agent.name)}&background=4f46e5&color=ffffff`}
                    alt={agent.name}
                  />
                  <div className={`status-dot ${agent.status}`}></div>
                </div>
                <div className="agent-info">
                  <h5>{agent.name}</h5>
                  <p>{agent.activeRooms || 0} cuộc hội thoại</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .agent-sidebar {
          width: 350px;
          min-width: 350px;
          background: white;
          border-right: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .sidebar-header {
          padding: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .sidebar-header h3 {
          margin: 0 0 1rem 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-dark);
        }

        .search-box {
          position: relative;
          margin-bottom: 1rem;
        }

        .search-box i {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-light);
          font-size: 1rem;
        }

        .search-box input {
          width: 100%;
          padding: 0.75rem 0.75rem 0.75rem 2.5rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 0.9rem;
          background: #f9fafb;
          transition: all 0.2s;
        }

        .search-box input:focus {
          outline: none;
          border-color: var(--primary-color);
          background: white;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .status-filters {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .filter-button {
          padding: 0.5rem 0.75rem;
          border: 1px solid #e5e7eb;
          background: white;
          border-radius: 0.375rem;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
          color: var(--text-dark);
        }

        .filter-button:hover {
          border-color: var(--primary-color);
          background: #f8fafc;
        }

        .filter-button.active {
          background: var(--primary-color);
          border-color: var(--primary-color);
          color: white;
        }

        .room-list {
          flex: 1;
          overflow-y: auto;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          color: var(--text-light);
          text-align: center;
        }

        .empty-state i {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          opacity: 0.5;
        }

        .room-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          width: 100%;
          padding: 1rem 1.5rem;
          border: none;
          background: none;
          text-align: left;
          cursor: pointer;
          transition: background-color 0.2s;
          border-bottom: 1px solid #f3f4f6;
        }

        .room-item:hover {
          background: #f8fafc;
        }

        .room-item.active {
          background: #eef2ff;
          border-right: 3px solid var(--primary-color);
        }

        .room-avatar {
          position: relative;
          width: 48px;
          height: 48px;
          flex-shrink: 0;
        }

        .room-avatar img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }

        .status-indicator {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 2px solid white;
        }

        .unread-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #dc3545;
          color: white;
          border-radius: 50%;
          min-width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
          border: 2px solid white;
        }

        .unread-badge-collapsed {
          position: absolute;
          top: -5px;
          right: -5px;
          background: linear-gradient(135deg, #ff4757, #ff3742);
          color: white;
          border-radius: 50%;
          min-width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: bold;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(255, 71, 87, 0.3);
          animation: pulse 2s infinite;
        }

        .unread-badge-avatar {
          position: absolute;
          top: -8px;
          right: -8px;
          background: linear-gradient(135deg, #ff4757, #ff3742);
          color: white;
          border-radius: 50%;
          min-width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          border: 3px solid white;
          box-shadow: 0 3px 8px rgba(255, 71, 87, 0.4);
          z-index: 10;
        }

        .unread-badge-meta {
          background: linear-gradient(135deg, #ff4757, #ff3742);
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
          box-shadow: 0 2px 4px rgba(255, 71, 87, 0.3);
        }

        .unread-badge-meta i {
          font-size: 12px;
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 2px 4px rgba(255, 71, 87, 0.3);
          }
          50% {
            box-shadow: 0 2px 4px rgba(255, 71, 87, 0.5), 0 0 0 4px rgba(255, 71, 87, 0.1);
          }
          100% {
            box-shadow: 0 2px 4px rgba(255, 71, 87, 0.3);
          }
        }

        .room-info {
          flex: 1;
          min-width: 0;
        }

        .room-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.25rem;
        }

        .customer-name {
          margin: 0;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-dark);
          truncate: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }

        .time {
          font-size: 0.75rem;
          color: var(--text-light);
          flex-shrink: 0;
        }

        .room-details {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .last-message {
          margin: 0;
          font-size: 0.85rem;
          color: var(--text-light);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 150px;
        }

        .room-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .status-badge {
          font-size: 0.7rem;
          color: white;
          padding: 0.2rem 0.5rem;
          border-radius: 0.75rem;
          font-weight: 500;
        }

        .unread-badge {
          background: #ef4444;
          color: white;
          font-size: 0.7rem;
          padding: 0.2rem 0.4rem;
          border-radius: 0.75rem;
          min-width: 18px;
          text-align: center;
        }

        .agents-section {
          border-top: 1px solid #e5e7eb;
          background: #f9fafb;
        }

        .agents-toggle {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 1rem 1.5rem;
          border: none;
          background: none;
          cursor: pointer;
          color: var(--text-dark);
          font-size: 0.9rem;
        }

        .agents-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .agents-list {
          max-height: 200px;
          overflow-y: auto;
        }

        .agent-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.5rem;
        }

        .agent-avatar {
          position: relative;
          width: 32px;
          height: 32px;
        }

        .agent-avatar img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }

        .status-dot {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 2px solid white;
        }

        .status-dot.online { background: #10b981; }
        .status-dot.busy { background: #f59e0b; }
        .status-dot.away { background: #6b7280; }

        .agent-info h5 {
          margin: 0;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-dark);
        }

        .agent-info p {
          margin: 0;
          font-size: 0.75rem;
          color: var(--text-light);
        }

        @media (max-width: 1024px) {
          .agent-sidebar {
            width: 280px;
            min-width: 280px;
          }
        }

        @media (max-width: 768px) {
          .agent-sidebar {
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            z-index: 1000;
            box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
          }
        }
      `}</style>
    </div>
  );
};

export default AgentSidebar;
