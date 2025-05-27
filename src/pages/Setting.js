import React, { useEffect, useState } from 'react';
import './Setting.css';
import { Link } from 'react-router-dom';
import profileIcon from '../icons/lucide/profileIcon.svg';
import Settingbar from '../components/Settingbar';
import syncIcon from '../icons/lucide/sync.svg';
import userIcon from '../icons/lucide/user.svg';
import globeIcon from '../icons/lucide/globe.svg';
import hardDriveIcon from '../icons/lucide/hardDrive.svg';
import timerIcon from '../icons/lucide/timer.svg';
import { io } from 'socket.io-client';

const socket = io('http://15.164.226.12:5000');

const Setting = () => {
  const [email, setEmail] = useState('로딩 중...');

  // ✅ 동기화 버튼 클릭 시 MQTT 전송
  const handleSync = async () => {
    try {
      const res = await fetch('http://15.164.226.12:5000/api/sync', {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        alert('✅ 동기화 요청 전송됨: ' + data.message);
      } else {
        alert('⚠️ 실패: ' + data.message);
      }
    } catch (err) {
      alert('❌ 서버 연결 실패 또는 예외 발생');
      console.error('동기화 요청 실패:', err);
    }
  };

  // ✅ Socket으로 MQTT 응답 수신 처리
  useEffect(() => {
    socket.on('sync_response', (data) => {
      if (data.status === 'success') {
        alert('📡 라즈베리 응답: 동기화 성공');
      } else {
        alert('❌ 라즈베리 응답: 동기화 실패');
      }
    });

    return () => {
      socket.off('sync_response');
    };
  }, []);

  // ✅ 로그인 사용자 이메일 조회
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('http://15.164.226.12:5000/api/check', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await res.json();
        if (data.loggedIn) {
          setEmail(data.username || '알 수 없음');
        } else {
          setEmail('로그인 필요');
        }
      } catch (err) {
        console.error('사용자 정보 불러오기 실패:', err);
        setEmail('오류 발생');
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="settingbar-row">
      <Settingbar />
      <div className="container">
        <div className="profileBox">
          <img src={profileIcon} alt="프로필" className="profileIcon" />
          <div className="profileInfo">
            <div className="email">{email}님</div>
            <div className="mode">관리자 모드입니다</div>
          </div>
        </div>

        <div className="settingMenuCard">
          <ul>
            <li className="settingMenuRow">
              <button className="settingMenuInner" onClick={handleSync}>
                <img src={syncIcon} alt="동기화" className="settingMenuIcon" />
                <span className="settingMenuLabel">동기화</span>
              </button>
            </li>

            <li className="settingMenuRow">
              <Link to="/PersonalInformation" className="settingMenuInner">
                <img
                  src={userIcon}
                  alt="개인 정보"
                  className="settingMenuIcon"
                />
                <span className="settingMenuLabel">개인 정보</span>
              </Link>
            </li>

            <li className="settingMenuRow">
              <button type="button" className="settingMenuInner" disabled>
                <img
                  src={globeIcon}
                  alt="네트워크"
                  className="settingMenuIcon"
                />
                <span className="settingMenuLabel">네트워크</span>
              </button>
            </li>

            <li className="settingMenuRow">
              <Link to="/SettingAccount" className="settingMenuInner">
                <img
                  src={hardDriveIcon}
                  alt="계정 관리"
                  className="settingMenuIcon"
                />
                <span className="settingMenuLabel">계정 관리</span>
              </Link>
            </li>

            <li className="settingMenuRow">
              <button type="button" className="settingMenuInner" disabled>
                <img src={timerIcon} alt="시간" className="settingMenuIcon" />
                <span className="settingMenuLabel">시간</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Setting;
