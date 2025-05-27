// src/pages/Chatting/Chatting.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './style.css';
import SendIcon from '../../icons/AiButton.svg';
import CloseIcon from '../../icons/CloseIcon.svg';

const Chatting = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const chatEndRef = useRef(null);

  const userCommand = location.state?.userCommand;

  useEffect(() => {
    if (userCommand) {
      sendToServer(userCommand);
      setMessage('');
    }
  }, [userCommand]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  const sendToServer = async (msg) => {
    const userMsg = { sender: 'user', text: msg };
    setChatHistory((prev) => [...prev, userMsg]);

    try {
      const res = await fetch("http://15.164.226.12:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: msg }),
      });

      const data = await res.json();
      const botMsg = { sender: 'bot', text: data.answer || '응답 없음' };
      setChatHistory((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("서버 통신 실패:", error);
      const errorMsg = { sender: 'bot', text: '서버 연결에 실패했습니다.' };
      setChatHistory((prev) => [...prev, errorMsg]);
    }
  };

  const handleSend = () => {
    if (!message.trim()) return;
    sendToServer(message);
    setMessage('');
  };

  return (
    <div className="screen-2">
      <div className="screen-4">
        <button className="button-close" onClick={() => navigate('/dashboard')}>
          <img src={CloseIcon} alt="close" style={{ width: '16px', height: '16px' }} />
        </button>

        <div className="chat-area">
          {chatHistory.map((msg, index) =>
            msg.sender === 'user' ? (
              <div className="user-message" key={index}>
                <div className="message-bubble">{msg.text}</div>
              </div>
            ) : (
              <div className="AI-message" key={index}>
                <img className="AI-icon" src={SendIcon} alt="AI" />
                <div className="message-bubble">{msg.text}</div>
              </div>
            )
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="input-area">
          <input
            className="chat-input"
            type="text"
            placeholder="무엇이든 물어보세요"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <img
            className="send-icon"
            src={SendIcon}
            alt="send"
            onClick={handleSend}
            style={{ cursor: 'pointer', width: '24px', height: '24px', marginLeft: '10px' }}
          />
        </div>
      </div>
    </div>
  );
};

export default Chatting;

