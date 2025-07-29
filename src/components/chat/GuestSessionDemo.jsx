import React, { useEffect, useState } from 'react';
import { useChatContext } from '../../contexts/ChatContext';

const GuestSessionDemo = () => {
  const { 
    guestSession, 
    initializeGuestSession, 
    updateGuestActivity, 
    handleGuestDisconnect,
    messages 
  } = useChatContext();
  
  const [sessionInfo, setSessionInfo] = useState(null);

  useEffect(() => {
    // Initialize guest session when component mounts
    if (!guestSession) {
      const session = initializeGuestSession();
      setSessionInfo(session);
    } else {
      setSessionInfo(guestSession);
    }
  }, [guestSession, initializeGuestSession]);

  const handleUserActivity = () => {
    updateGuestActivity();
    console.log('Guest activity updated');
  };

  const handleManualDisconnect = () => {
    handleGuestDisconnect('manual_disconnect');
    setSessionInfo(null);
  };

  const simulatePageClose = () => {
    handleGuestDisconnect('page_close');
    setSessionInfo(null);
  };

  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc', margin: '1rem' }}>
      <h3>🔐 Guest Session Management Demo</h3>
      
      {sessionInfo ? (
        <div>
          <div style={{ background: '#e8f5e8', padding: '1rem', marginBottom: '1rem' }}>
            <h4>✅ Active Session</h4>
            <p><strong>Session ID:</strong> {sessionInfo.id}</p>
            <p><strong>Created:</strong> {new Date(sessionInfo.createdAt).toLocaleString()}</p>
            <p><strong>Last Activity:</strong> {new Date(sessionInfo.lastActivity).toLocaleString()}</p>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <h4>🎮 Test Actions</h4>
            <button 
              onClick={handleUserActivity}
              style={{ 
                margin: '0.25rem', 
                padding: '0.5rem 1rem', 
                background: '#4CAF50', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              📱 Update Activity
            </button>
            
            <button 
              onClick={handleManualDisconnect}
              style={{ 
                margin: '0.25rem', 
                padding: '0.5rem 1rem', 
                background: '#f44336', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              🚪 Manual Disconnect
            </button>
            
            <button 
              onClick={simulatePageClose}
              style={{ 
                margin: '0.25rem', 
                padding: '0.5rem 1rem', 
                background: '#ff9800', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              📄 Simulate Page Close
            </button>
          </div>

          <div style={{ background: '#fff3cd', padding: '1rem' }}>
            <h4>⚠️ Auto-Disconnect Scenarios</h4>
            <ul>
              <li><strong>Timeout:</strong> 30 phút không hoạt động</li>
              <li><strong>Page Close:</strong> Đóng tab/tắt trình duyệt</li>
              <li><strong>Page Hide:</strong> Chuyển tab khác</li>
              <li><strong>Network Loss:</strong> Mất kết nối mạng</li>
            </ul>
          </div>
        </div>
      ) : (
        <div style={{ background: '#f8d7da', padding: '1rem' }}>
          <h4>❌ No Active Session</h4>
          <button 
            onClick={() => {
              const session = initializeGuestSession();
              setSessionInfo(session);
            }}
            style={{ 
              padding: '0.5rem 1rem', 
              background: '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🔄 Create New Session
          </button>
        </div>
      )}

      {/* Display system messages about disconnections */}
      <div style={{ marginTop: '1rem' }}>
        <h4>📨 System Messages</h4>
        <div style={{ 
          height: '200px', 
          overflow: 'auto', 
          border: '1px solid #ddd', 
          padding: '0.5rem',
          background: '#f9f9f9'
        }}>
          {messages
            .filter(msg => msg.type === 'system')
            .map(msg => (
              <div key={msg.id} style={{ 
                padding: '0.25rem', 
                borderBottom: '1px solid #eee',
                fontSize: '0.9rem'
              }}>
                <strong>{new Date(msg.timestamp).toLocaleTimeString()}:</strong> {msg.content}
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default GuestSessionDemo;
