import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole, endpoint }) => {
  const [isAuthorized, setIsAuthorized] = useState(null); // 권한 여부
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태

  useEffect(() => {
    const token = localStorage.getItem('userJwt'); // JWT 토큰 가져오기
    alert('토큰: ' + token);
    if (!token) {
      setIsAuthorized(false); // 토큰이 없으면 권한 없음
      setIsLoading(false);
      return;
    }

    // 서버에 권한 확인 요청
    alert('엔드포인트: ' + endpoint);
    alert('토큰: ' + token);
    fetch(`http://localhost:8080/auth/${endpoint}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`, // Authorization 헤더에 JWT 추가
      },
    })
      .then((response) => {
        alert('응답: ' + response.ok);
        if (response.ok) {
          setIsAuthorized(true); // 권한 있음
        } else {
          setIsAuthorized(false); // 권한 없음
        }
      })
      .catch(() => {
        setIsAuthorized(false); // 요청 실패 시 권한 없음
      })
      .finally(() => {
        setIsLoading(false); // 로딩 종료
      });
  }, [endpoint]);

  if (isLoading) return <div>로딩 중...</div>; // 로딩 상태 표시
  if (!isAuthorized) return <Navigate to="/unauthorized" />; // 권한 없으면 리 다이렉트

  return <>{children}</>; // 권한이 있으면 자식 컴포넌트 렌더링
};

export default ProtectedRoute;
