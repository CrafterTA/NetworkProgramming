import React, { useState, useEffect, useRef } from 'react';
import { useChatContext } from '../../contexts/ChatContext';

const GuestChatSimulator = () => {
  const { 
    initializeGuestSession, 
    sendMessage, 
    createRoom,
    messages,
    currentRoom,
    guestSession,
    updateGuestActivity
  } = useChatContext();

  const [isConnected, setIsConnected] = useState(false);
  const [guestInfo, setGuestInfo] = useState({
    name: '',
    email: '',
    phone: '',
    subject: ''
  });
  const [inputMessage, setInputMessage] = useState('');
  const [chatStarted, setChatStarted] = useState(false);
  const messagesEndRef = useRef(null);

  // Mock guest profiles for quick testing
  const mockGuests = [
    {
      name: 'Nguyễn Văn A',
      email: 'guest001@temp.com',
      phone: '0912345678',
      subject: 'Tư vấn tuyển sinh'
    },
    {
      name: 'Trần Thị B',
      email: 'guest002@temp.com', 
      phone: '0987654321',
      subject: 'Hỏi về học phí'
    },
    {
      name: 'Lê Văn C',
      email: 'guest003@temp.com',
      phone: '0966123456',
      subject: 'Vấn đề kỹ thuật'
    }
  ];

  // Sample messages for guests to send
  const sampleMessages = [
    'Xin chào! Tôi cần tư vấn về chương trình đào tạo',
    'Em muốn biết thông tin tuyển sinh năm nay',
    'Học phí các ngành như thế nào ạ?',
    'Có chương trình học bổng không ạ?',
    'Tôi gặp sự cố khi đăng ký online',
    'Khi nào có ngày hội tư vấn tuyển sinh?',
    'Cảm ơn anh/chị đã hỗ trợ!',
    'Tôi cần hỗ trợ khẩn cấp',
    'Website có vấn đề, không truy cập được'
  ];

  useEffect(() => {
    if (messages && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleStartChat = () => {
    if (!guestInfo.name || !guestInfo.subject) {
      alert('Vui lòng nhập tên và chủ đề!');
      return;
    }

    // Initialize guest session
    const session = initializeGuestSession();
    
    // Create chat room
    createRoom(null, 'normal', guestInfo);
    
    setChatStarted(true);
    setIsConnected(true);
    
    // Send initial message
    setTimeout(() => {
      sendMessage(`Xin chào! Tôi là ${guestInfo.name}. ${guestInfo.subject}`, 'text');
      updateGuestActivity();
    }, 1000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && isConnected) {
      sendMessage(inputMessage.trim(), 'text');
      setInputMessage('');
      updateGuestActivity();
    }
  };

  const handleQuickMessage = (message) => {
    if (isConnected) {
      sendMessage(message, 'text');
      updateGuestActivity();
    }
  };

  const handleMockGuest = (guest) => {
    setGuestInfo(guest);
  };

  const simulateDisconnect = () => {
    setIsConnected(false);
    setChatStarted(false);
    console.log('Guest disconnected');
  };

  if (!chatStarted) {
    return (
      <div style={{ 
        maxWidth: '500px', 
        margin: '2rem auto', 
        padding: '2rem', 
        border: '1px solid #ddd', 
        borderRadius: '8px',
        background: '#f9f9f9'
      }}>
        <h3 style={{ textAlign: 'center', color: '#333', marginBottom: '2rem' }}>
          🎭 Guest Chat Simulator
        </h3>
        
        {/* Quick Mock Guests */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Quick Test Guests:</h4>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {mockGuests.map((guest, index) => (
              <button
                key={index}
                onClick={() => handleMockGuest(guest)}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.85rem'
                }}
              >
                {guest.name}
              </button>
            ))}
          </div>
        </div>

        {/* Guest Info Form */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              Tên khách hàng:
            </label>
            <input
              type="text"
              value={guestInfo.name}
              onChange={(e) => setGuestInfo({...guestInfo, name: e.target.value})}
              placeholder="Nhập tên của bạn"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              Email:
            </label>
            <input
              type="email"
              value={guestInfo.email}
              onChange={(e) => setGuestInfo({...guestInfo, email: e.target.value})}
              placeholder="email@example.com"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              Số điện thoại:
            </label>
            <input
              type="tel"
              value={guestInfo.phone}
              onChange={(e) => setGuestInfo({...guestInfo, phone: e.target.value})}
              placeholder="0912345678"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              Chủ đề cần hỗ trợ:
            </label>
            <input
              type="text"
              value={guestInfo.subject}
              onChange={(e) => setGuestInfo({...guestInfo, subject: e.target.value})}
              placeholder="Tôi cần hỗ trợ về..."
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
          </div>

          <button
            onClick={handleStartChat}
            style={{
              width: '100%',
              padding: '1rem',
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            🚀 Bắt đầu Chat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '2rem auto', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      background: 'white',
      height: '80vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Chat Header */}
      <div style={{ 
        padding: '1rem', 
        background: '#007bff', 
        color: 'white',
        borderRadius: '8px 8px 0 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h4 style={{ margin: 0 }}>💬 Chat với HUTECH Support</h4>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', opacity: 0.9 }}>
            {guestInfo.name} | {guestInfo.subject}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span style={{ 
            fontSize: '0.8rem', 
            padding: '0.25rem 0.5rem', 
            background: isConnected ? '#28a745' : '#dc3545',
            borderRadius: '4px'
          }}>
            {isConnected ? '🟢 Online' : '🔴 Offline'}
          </span>
          <button
            onClick={simulateDisconnect}
            style={{
              background: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.8rem'
            }}
          >
            ❌ Disconnect
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div style={{ 
        flex: 1, 
        padding: '1rem', 
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {messages && messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message.id}
              style={{
                alignSelf: message.sender?.role === 'guest' ? 'flex-end' : 'flex-start',
                maxWidth: '70%'
              }}
            >
              <div style={{
                padding: '0.75rem 1rem',
                borderRadius: '1rem',
                background: message.sender?.role === 'guest' ? '#007bff' : '#f1f3f4',
                color: message.sender?.role === 'guest' ? 'white' : '#333'
              }}>
                <div style={{ fontSize: '0.9rem' }}>{message.content}</div>
                <div style={{ 
                  fontSize: '0.7rem', 
                  marginTop: '0.25rem',
                  opacity: 0.7
                }}>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
            Chưa có tin nhắn...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Messages */}
      <div style={{ padding: '0 1rem', borderTop: '1px solid #eee' }}>
        <div style={{ padding: '0.5rem 0', fontSize: '0.85rem', color: '#666' }}>
          💡 Quick messages:
        </div>
        <div style={{ 
          display: 'flex', 
          gap: '0.5rem', 
          flexWrap: 'wrap',
          marginBottom: '0.5rem'
        }}>
          {sampleMessages.slice(0, 4).map((msg, index) => (
            <button
              key={index}
              onClick={() => handleQuickMessage(msg)}
              disabled={!isConnected}
              style={{
                padding: '0.25rem 0.5rem',
                background: '#f8f9fa',
                border: '1px solid #dee2e6',
                borderRadius: '12px',
                fontSize: '0.75rem',
                cursor: isConnected ? 'pointer' : 'not-allowed',
                opacity: isConnected ? 1 : 0.5
              }}
            >
              {msg.length > 30 ? msg.substring(0, 30) + '...' : msg}
            </button>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <form 
        onSubmit={handleSendMessage}
        style={{ 
          padding: '1rem', 
          borderTop: '1px solid #eee',
          display: 'flex',
          gap: '0.5rem'
        }}
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={isConnected ? "Nhập tin nhắn..." : "Đã ngắt kết nối"}
          disabled={!isConnected}
          style={{
            flex: 1,
            padding: '0.75rem',
            border: '1px solid #ddd',
            borderRadius: '20px',
            fontSize: '0.9rem',
            outline: 'none'
          }}
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || !isConnected}
          style={{
            padding: '0.75rem 1.5rem',
            background: isConnected && inputMessage.trim() ? '#007bff' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            cursor: isConnected && inputMessage.trim() ? 'pointer' : 'not-allowed'
          }}
        >
          ➤
        </button>
      </form>
    </div>
  );
};

export default GuestChatSimulator;
