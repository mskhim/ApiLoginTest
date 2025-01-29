import { useEffect } from 'react';
import {
  handleNaverCallback,
  handleKakaoCallback,
  handleLogin,
} from './userApi';

const UserLoginSuccess = () => {
  useEffect(() => {
    // URL에서 code와 state 값 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code'); // 인증 코드
    const state = urlParams.get('state'); // state 값
    const provider = urlParams.get('provider'); // provider 값 (추가)

    if (provider === 'naver' && code && state) {
      // 네이버 콜백 처리
      handleNaverCallback(code, state)
        .then((data) => {
          console.log('네이버 사용자 정보:', data); // 전체 응답 데이터 출력
          // isRegist 값 확인
          alert('isRegist: ' + JSON.parse(data.userInfo).response.id);
          if (data.isRegist == true) {
            alert('회원가입이 필요합니다. 회원가입 페이지로 이동합니다.');
            localStorage.setItem('user', data.userInfo); // 사용자 정보 저장
            localStorage.setItem('accessToken', data.accessToken); // Access Token 저장
            window.location.href = '/userInsert'; // 회원가입 페이지로 리다이렉트
          } else {
            localStorage.setItem('accessToken', data.accessToken); // Access Token 저장
            handleLogin(JSON.parse(data.userInfo).response.id, 'naver');
          }
        })
        .catch((error) => {
          console.error('네이버 콜백 처리 실패:', error);
          alert('로그인 처리 중 오류가 발생했습니다.');
        });
    }

    if (provider === 'kakao' && code) {
      // 카카오 콜백 처리
      handleKakaoCallback(code)
        .then((data) => {
          console.log('카카오 사용자 정보:', data); // 전체 응답 데이터 출력
          console.log(data.userInfo);
          // isRegist 값 확인
          console.log('isRegist:', data.isRegist);
          if (data.isRegist == true) {
            // 회원가입이 필요한 경우
            alert('회원가입이 필요합니다. 회원가입 페이지로 이동합니다.');
            localStorage.setItem('user', data.userInfo); // 사용자 정보 저장
            localStorage.setItem('accessToken', data.accessToken); // Access Token 저장
            window.location.href = '/userInsert'; // 회원가입 페이지로 리다이렉트
          } else {
            localStorage.setItem('accessToken', data.accessToken); // Access Token 저장
            handleLogin(JSON.parse(data.userInfo).id, 'kakao');
          }
        })
        .catch((error) => {
          console.error('카카오 콜백 처리 실패:', error);
          alert('로그인 처리 중 오류가 발생했습니다.');
        });
    }
  }, []);

  return <></>;
};

export default UserLoginSuccess;
