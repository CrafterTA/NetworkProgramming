import React from 'react';
import GuestChatSimulator from '../components/chat/GuestChatSimulator';
import GuestSessionDemo from '../components/chat/GuestSessionDemo';

const TestChat = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f5f5f5',
      padding: '2rem 0'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        padding: '0 1rem'
      }}>
        <h1 style={{ 
          textAlign: 'center', 
          marginBottom: '3rem',
          color: '#333'
        }}>
          🧪 Chat System Testing
        </h1>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
          gap: '2rem',
          alignItems: 'start'
        }}>
          {/* Guest Chat Simulator */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              background: '#28a745',
              color: 'white',
              padding: '1rem 1.5rem',
              borderRadius: '12px 12px 0 0',
              marginBottom: '0'
            }}>
              <h2 style={{ margin: 0, fontSize: '1.2rem' }}>
                👤 Guest Chat Simulator
              </h2>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', opacity: 0.9 }}>
                Mô phỏng khách vãng lai chat với agent
              </p>
            </div>
            <div style={{ padding: '0' }}>
              <GuestChatSimulator />
            </div>
          </div>

          {/* Guest Session Management */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              background: '#007bff',
              color: 'white',
              padding: '1rem 1.5rem',
              borderRadius: '12px 12px 0 0',
              marginBottom: '0'
            }}>
              <h2 style={{ margin: 0, fontSize: '1.2rem' }}>
                🔐 Session Management
              </h2>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', opacity: 0.9 }}>
                Test guest session & disconnect handling
              </p>
            </div>
            <div style={{ padding: '0' }}>
              <GuestSessionDemo />
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          marginTop: '2rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#333', marginBottom: '1.5rem' }}>
            📋 Hướng dẫn test
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            <div>
              <h3 style={{ color: '#28a745', fontSize: '1.1rem' }}>
                🎭 Guest Chat Simulator
              </h3>
              <ol style={{ paddingLeft: '1.5rem', lineHeight: '1.6' }}>
                <li>Chọn một trong 3 mock guests hoặc nhập thông tin tùy chỉnh</li>
                <li>Click "Bắt đầu Chat" to create guest session</li>
                <li>Gửi tin nhắn bằng cách gõ hoặc dùng quick messages</li>
                <li>Mở Agent Dashboard để xem tin nhắn từ phía agent</li>
                <li>Test disconnect bằng nút "❌ Disconnect"</li>
              </ol>
            </div>

            <div>
              <h3 style={{ color: '#007bff', fontSize: '1.1rem' }}>
                🔐 Session Management
              </h3>
              <ol style={{ paddingLeft: '1.5rem', lineHeight: '1.6' }}>
                <li>Xem thông tin session hiện tại</li>
                <li>Test "Update Activity" để reset timeout</li>
                <li>Test "Manual Disconnect" để ngắt kết nối thủ công</li>
                <li>Test "Simulate Page Close" để mô phỏng đóng trang</li>
                <li>Xem system messages trong Agent Dashboard</li>
              </ol>
            </div>
          </div>

          <div style={{
            background: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '8px',
            padding: '1rem',
            marginTop: '1.5rem'
          }}>
            <h4 style={{ color: '#856404', margin: '0 0 0.5rem 0' }}>
              💡 Pro Tips
            </h4>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#856404' }}>
              <li>Mở 2 tab: một cho Guest Chat, một cho Agent Dashboard</li>
              <li>Test realtime bằng cách gửi tin nhắn từ cả 2 phía</li>
              <li>Quan sát console logs để debug</li>
              <li>Test trên mobile để xem responsive design</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestChat;
