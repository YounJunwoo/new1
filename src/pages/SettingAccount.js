import React, { useEffect, useState } from "react";
import "./SettingAccount.css";
import Settingbar from "../components/Settingbar";
import syncIcon from "../icons/lucide/sync.svg";

const SettingAccount = () => {
  const [accounts, setAccounts] = useState([]);

  const fetchAccounts = async () => {
    try {
      const res = await fetch("http://15.164.226.12:5000/api/users", {
        method: "GET",
        credentials: "include"
      });
      const data = await res.json();
      if (data.success) {
        setAccounts(data.users || []);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("계정 목록 불러오기 실패:", err);
      alert("서버 연결 실패");
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div className="settingbar-row">
      <Settingbar />
      <div className="accountCard">
        <div className="accountHeader">
          <span className="accountTitle">계정 관리</span>
          <div className="accountActions">
            <button className="accountAdd">계정 등록</button>
            <button className="accountDelete">삭제</button>
            <button className="accountSync" onClick={fetchAccounts}>
              <img src={syncIcon} alt="sync" className="synoIcon" />
            </button>
          </div>
        </div>
        <table className="accountTable">
          <thead>
            <tr>
              <th><input type="checkbox" /></th>
              <th>계정</th>
              <th>등록일</th>
              <th>권한</th>
              <th>일련번호</th>
              <th>활성화</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((acc) => (
              <tr key={acc.email}>
                <td><input type="checkbox" /></td>
                <td>{acc.email}</td>
                <td>{acc.date || "-"}</td>
                <td>{acc.role || "관리자"}</td>
                <td>{acc.id || "-"}</td>
                <td>
                  {acc.active ? (
                    <span className="accountActive"><span className="dot" /> 활성화</span>
                  ) : (
                    <span className="accountInactive"><span className="dotInactive" /> 비활성화</span>
                  )}
                </td>
              </tr>
            ))}
            {Array.from({ length: 6 - accounts.length }).map((_, i) => (
              <tr key={`empty-${i}`}>
                <td><input type="checkbox" disabled /></td>
                <td colSpan={5}></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SettingAccount;
