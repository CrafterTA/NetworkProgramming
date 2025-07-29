import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import websiteData from './webdata.json'; 

const Gemini = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Xin chào! Tôi là AI hỗ trợ. Hãy hỏi tôi về website của chúng tôi.' }
  ]);
  const [loading, setLoading] = useState(false);
  const chatboxRef = useRef(null);

  // Lấy API key từ biến môi trường (file .env)
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

  const handleSend = async () => {
    if (!input.trim()) return;

    // Thêm câu hỏi của người dùng vào chat
    const userMessage = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    const lowerInput = input.toLowerCase();
    let prompt = "";
    if (lowerInput.includes("trường sạch") || lowerInput.includes("hướng dẫn") || lowerInput.includes("giới thiệu")) {
      prompt = `Thông tin website:
Tiêu đề: ${websiteData.title}
Mô tả: ${websiteData.description}
Hướng dẫn sử dụng: ${websiteData.usageGuide}
Giới thiệu: ${websiteData.about.content}

Hãy trả lời câu hỏi: ${input}`;
    } else {
      prompt = `${websiteData.trainingData}

Website "${websiteData.title}" cung cấp các thông tin về phát triển bền vững, quyên góp cho cộng đồng và các hoạt động môi trường.
Mô tả: ${websiteData.description}
Hướng dẫn sử dụng: ${websiteData.usageGuide}

Hãy trả lời câu hỏi sau dựa trên các thông tin trên: ${input}`;
    }

    try {
      if (ai) {
        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: prompt,
        });
        setMessages((prev) => [...prev, { role: 'ai', text: response.text }]);
      } else {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            { role: 'ai', text: 'Đây là phản hồi mẫu. Vui lòng cấu hình API Key để sử dụng AI thật.' }
          ]);
          setLoading(false);
        }, 1200);
        setInput('');
        return;
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: 'ai', text: 'Có lỗi xảy ra khi kết nối với Gemini AI. Vui lòng thử lại.' }
      ]);
    }

    setLoading(false);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) handleSend();
  };

  const toggleChatbox = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (chatboxRef.current && !chatboxRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [chatboxRef]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 1000,
      }}
      ref={chatboxRef}
    >
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "#01bbbf",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          transition: "transform 0.2s",
          fontSize: 24,
          ...(isOpen ? { transform: "rotate(45deg)" } : {}),
        }}
        onClick={toggleChatbox}
      >
        {isOpen ? "x" : "💬"}
      </div>
      {isOpen && (
        <div
          style={{
            maxWidth: 400,
            borderRadius: 16,
            background: "#fff",
            boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
            display: "flex",
            flexDirection: "column",
            height: 400,
            overflow: "hidden",
            marginTop: 10,
          }}
        >
          <div
            style={{
              padding: "1rem",
              borderBottom: "1px solid #e0e0e0",
              background: "#01bbbf",
              color: "#fff",
              textAlign: "center",
              fontWeight: "600",
            }}
          >
            AI Giải Đáp
          </div>
          <div
            style={{
              flex: 1,
              padding: "1rem",
              overflowY: "auto",
              background: "#f8fafc",
            }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  margin: "0.5rem 0",
                  textAlign: msg.role === "user" ? "right" : "left",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "0.7rem 1.2rem",
                    borderRadius: 20,
                    background: msg.role === "user" ? "#01bbbf" : "#e0f7fa",
                    color: msg.role === "user" ? "#fff" : "#222",
                    maxWidth: "80%",
                    wordBreak: "break-word",
                    fontSize: "14px",
                    lineHeight: "1.4",
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}
            {loading && (
              <div
                style={{
                  textAlign: "left",
                  color: "#01bbbf",
                  margin: "0.5rem 0",
                  fontStyle: "italic",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "0.7rem 1.2rem",
                    borderRadius: 20,
                    background: "#e0f7fa",
                    color: "#01bbbf",
                  }}
                >
                  Đang trả lời...
                </span>
              </div>
            )}
          </div>
          <div
            style={{
              display: "flex",
              borderTop: "1px solid #e0e0e0",
              padding: "0.75rem",
              background: "#fff",
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập câu hỏi..."
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: 16,
                padding: "0.5rem 1rem",
                borderRadius: 20,
                background: "#f3f4f6",
              }}
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              style={{
                marginLeft: 8,
                background: loading || !input.trim() ? "#ccc" : "#01bbbf",
                color: "#fff",
                border: "none",
                borderRadius: 20,
                padding: "0.5rem 1.5rem",
                fontWeight: 600,
                fontSize: 16,
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                transition: "background 0.2s",
              }}
            >
              {loading ? "..." : "Gửi"}
            </button>
          </div>
          {!apiKey && (
            <div
              style={{
                padding: "0.5rem",
                background: "#fff3cd",
                color: "#856404",
                fontSize: "12px",
                textAlign: "center",
                borderTop: "1px solid #e0e0e0",
              }}
            >
              ⚠️ Chưa cấu hình API Key - đang dùng chế độ demo
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Gemini;