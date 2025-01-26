import { useEffect } from "react";
import { handleNaverCallback, handleKakaoCallback } from "./userApi";

const UserLoginSuccess = () => {
  useEffect(() => {
    // URL에서 code와 state 값 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code"); // 인증 코드
    const state = urlParams.get("state"); // state 값
    const provider = urlParams.get("provider"); // provider 값 (추가)
    alert("provider: " + provider);
    if (provider === "naver" && code && state) {
      // 네이버 콜백 처리
      handleNaverCallback(code, state)
        .then((data) => {
          console.log("네이버 사용자 정보:", data); // 사용자 정보 출력
          alert("네이버 로그인 성공: " + data.userInfo.name + "님 환영합니다.");
          window.history.go(-2); // 이전 페이지로 이동
        })
        .catch((error) => {
          console.error("네이버 콜백 처리 실패:", error);
        });
    }

    if (provider === "kakao" && code) {
      // 카카오 콜백 처리
      handleKakaoCallback(code)
        .then((data) => {
          console.log("카카오 사용자 정보:", data); // 사용자 정보 출력
          alert(
            "카카오 로그인 성공: " + data.userInfo.nickname + "님 환영합니다."
          );
          window.history.go(-2); // 이전 페이지로 이동
        })
        .catch((error) => {
          console.error("카카오 콜백 처리 실패:", error);
        });
    }
  }, []);

  return <></>;
};

export default UserLoginSuccess;
