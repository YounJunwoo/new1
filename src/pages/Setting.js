import React from "react"; 
import './Setting.css';
import { Link } from "react-router-dom";
import profileIcon from "../icons/lucide/profileIcon.svg";
import Settingbar from "../components/Settingbar";
import syncIcon from "../icons/lucide/sync.svg";
import userIcon from "../icons/lucide/user.svg";
import globeIcon from "../icons/lucide/globe.svg";
import hardDriveIcon from "../icons/lucide/hardDrive.svg";
import timerIcon from "../icons/lucide/timer.svg";
import { getLoggedInEmail } from "../utils/storage";

const Setting = () => {
  return (
    <div className="settingbar-row">
      <Settingbar />
      <div className="container">
        <div className="profileBox">
          <img src={profileIcon} alt="프로필" className="profileIcon" />
          <div className="profileInfo">
            <div className="email">{getLoggedInEmail()}님</div>
            <div className="mode">관리자 모드입니다</div>
          </div>
        </div>
        <div className="settingMenuCard">
          <ul>
            <li className="settingMenuRow">
              <Link to="/Setting" className="settingMenuInner">
                <img src={syncIcon} alt="동기화" className="settingMenuIcon" />
                <span className="settingMenuLabel">동기화</span>
              </Link>
            </li>
            <li className="settingMenuRow">
              <button type="button" className="settingMenuInner">
                <img src={userIcon} alt="개인 정보" className="settingMenuIcon" />
                <span className="settingMenuLabel">개인 정보</span>
              </button>
            </li>
            <li className="settingMenuRow">
              <button type="button" className="settingMenuInner">
                <img src={globeIcon} alt="네트워크" className="settingMenuIcon" />
                <span className="settingMenuLabel">네트워크</span>
              </button>
            </li>
            <li className="settingMenuRow">
              <Link to="/SettingAccount" className="settingMenuInner">
                <img src={hardDriveIcon} alt="계정 관리" className="settingMenuIcon" />
                <span className="settingMenuLabel">계정 관리</span>
              </Link>
            </li>
            <li className="settingMenuRow">
              <button type="button" className="settingMenuInner">
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
