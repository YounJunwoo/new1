import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';

const FormForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("이메일을 입력하세요.");
      return;
    }

    const response = await fetch("http://15.164.226.12:5000/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    const result = await response.json();
    alert(result.message);
    if (result.success) navigate('/'); // 로그인 페이지로 이동
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="forgot-password">
      <form onSubmit={handleSubmit} className="forgot-password-form">
        <label>전화번호</label>
        <input
          type="text"
          placeholder="전화번호를 입력하세요."
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <div className="button-group">
          <button type="button" onClick={handleCancel}>
            취소
          </button>
        </div>
      </form>

      <form onSubmit={handleSubmit} className="forgot-password-form">
        <label>이메일</label>
        <input
          type="email"
          placeholder="이메일을 입력하세요."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="button-group">
          <button type="button" onClick={handleCancel}>
            취소
          </button>
          <button type="submit">비밀번호 재설정</button>
        </div>
      </form>
    </div>
  );
};

export default FormForgotPassword;
