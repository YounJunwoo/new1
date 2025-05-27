import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';
import { setLoggedInEmail, setAccountInfo } from '../../utils/storage';
import { generateUniqueSerialIds } from '../../utils/serialIdGenerator';

const SignUp = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const response = await fetch("http://15.164.226.12:5000/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        username: firstName,
        nickname: lastName,
        email,
        password,
        phone,
      }),
    });

    const result = await response.json();
    alert(result.message);

    if (result.success) {
      const date = new Date().toISOString().slice(0, 10);
      const role = '관리자';
      const id = generateUniqueSerialIds([{ email }])[0];
      const active = true;
      setAccountInfo({ email, date, role, id, active });
      setLoggedInEmail(email);
      navigate("/");
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSignUp}>
        <label>이름</label>
        <input
          type="text"
          placeholder="이름을 입력하세요."
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <label>닉네임</label>
        <input
          type="text"
          placeholder="닉네임을 입력하세요."
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <label>이메일</label>
        <input
          type="email"
          placeholder="이메일을 입력하세요."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>비밀번호</label>
        <input
          type="password"
          placeholder="비밀번호를 입력하세요."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label>비밀번호 재확인</label>
        <input
          type="password"
          placeholder="비밀번호를 다시 입력하세요."
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <label>전화번호</label>
        <input
          type="text"
          placeholder="전화번호를 입력하세요."
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button type="submit" className="signup-button">회원가입</button>
      </form>
    </div>
  );
};

export default SignUp;
