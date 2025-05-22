import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './style.css';
import { setLoggedInEmail, setAccountInfo } from '../../utils/storage';
import { generateUniqueSerialIds } from '../../utils/serialIdGenerator';

const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = (e) => {
    e.preventDefault();
    const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const role = '관리자';
    const id = generateUniqueSerialIds([{ email }])[0];
    const active = true;
    setAccountInfo({ email, date, role, id, active });
    setLoggedInEmail(email);
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
          placeholder="비밀번호를 입력하세요."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label>전화번호</label>
        <input
          type="password"
          placeholder="전화번호를 입력하세요."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Link to="/" className="signup-button">
          회원가입
        </Link>
      </form>
    </div>
  );
};

export default SignUp;


