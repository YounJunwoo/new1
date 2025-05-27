import React from 'react';
import { Link } from 'react-router-dom';
import './Settingbar.css';
import userRoundPen from '../icons/lucide/user-round-pen.svg';
import globeIcon from '../icons/lucide/globe.svg';
import hardDriveIcon from '../icons/lucide/hardDrive.svg';
import timerIcon from '../icons/lucide/timer.svg';
import vegeAddIcon from '../icons/VegeAdd.svg';

const Settingbar = () => {
  return (
    <div className="settingbar">
      <div className="settingbarTitle">설정</div>
      <ul className="settingbarMenu">
        <li>
          <Link to="/Setting" className="settingbarMenu-btn">
            <img src={userRoundPen} alt="프로필" className="settingbarIcon" />
            프로필
          </Link>
        </li>
        <li>
          <button className="settingbarMenu-btn">
            <img src={globeIcon} alt="네트워크" className="settingbarIcon" />
            네트워크
          </button>
        </li>
        <li>
          <Link to="/SettingAccount" className="settingbarMenu-btn">
            <img
              src={hardDriveIcon}
              alt="계정 관리"
              className="settingbarIcon"
            />
            계정 관리
          </Link>
        </li>
        <li>
          <Link to="/PersonalInformation" className="settingbarMenu-btn">
            <img
              src={hardDriveIcon}
              alt="개인 정보"
              className="settingbarIcon"
            />
            개인 정보
          </Link>
        </li>
        <li>
          <button className="settingbarMenu-btn">
            <img src={vegeAddIcon} alt="작물 추가" className="settingbarIcon" />
            작물 추가
          </button>
        </li>
        <li>
          <button className="settingbarMenu-btn">
            <img src={timerIcon} alt="시간" className="settingbarIcon" />
            시간
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Settingbar;
