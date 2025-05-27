import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';

const Logout = ({ className }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      const confirmLogout = window.confirm('정말 로그아웃하시겠습니까?');
      if (!confirmLogout) {
        navigate(-1); // 이전 페이지로 돌아가기
        return;
      }

      try {
        const res = await fetch('http://15.164.226.12:5000/api/logout', {
          method: 'POST',
          credentials: 'include',
        });

        const result = await res.json();
        alert(result.message);
      } catch (err) {
        console.error('로그아웃 실패:', err);
        alert('서버 오류로 로그아웃하지 못했습니다.');
      } finally {
        navigate('/'); // 로그인 페이지로 이동
      }
    };

    logout();
  }, [navigate]);

  return (
    <div className={`logout ${className}`}>
      <div className="overlap-group-3">
        <div className="text-wrapper-17">Logout</div>
        <img
          className="lucide-log-out"
          alt="Lucide log out"
          src="https://c.animaapp.com/kZX9QJ4w/img/lucide-log-out-1.svg"
        />
      </div>
    </div>
  );
};

export default Logout;
