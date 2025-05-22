import React from "react";
import { useNavigate } from "react-router-dom";
import SendIconWhite from "../icons/AiButton.svg"; // ✅ 흰색 아이콘 사용
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleChatbotClick = () => {
    navigate('/chat');
  };

  return (
    <div className="topNavbar">
      <div className="logo">
        smartfarm <span className="logo-sub">ASAP</span>
      </div>

      {/* ✅ 아이콘을 오른쪽 끝으로 정렬 */}
      <div className="right-icons">
        <img
          className="send-button"
          src={SendIconWhite}
          alt="Send to Chat"
          onClick={handleChatbotClick}
        />
      </div>
    </div>
  );
};

export default Navbar;
