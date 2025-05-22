import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import logoutButton from '../icons/lucide/logoutButton.svg';
import Clock from './Clock';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 필요한 경우: localStorage.clear();
    navigate('/'); // 로그인 페이지로 이동
  };

  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to="/DashBoard">실시간 대시보드</Link>
        </li>
        <li>
          <Link to="/DataStatistics">데이터 통계</Link>
        </li>
        <li>
          <Link to="/chat">챗봇</Link>
        </li>
        <li>
          <Link to="/Setting">설정</Link>
        </li>
      </ul>
      <div className="sidebar-clock">
        <Clock />
      </div>
      <div
        className="logoutbutton"
        onClick={handleLogout}
        style={{ cursor: 'pointer' }}
      >
        <img alt="logoutButton" src={logoutButton} />
      </div>
    </div>
  );
};

export default Sidebar;
