const NAVER_API_BASE_URL = "http://localhost:8080/user/naver"; // 스프링 부트 네이버 로그인 API 경로
const KAKAO_API_BASE_URL = "http://localhost:8080/user/kakao"; // 스프링 부트 카카오 로그인 API 경로

/**
 * 네이버 로그인 URL 가져오기
 * 스프링부트에서 생성된 네이버 인증 URL을 요청합니다.
 */
export const getNaverAuthUrl = async () => {
  try {
    const response = await fetch(`${NAVER_API_BASE_URL}/auth-url`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const url = await response.text(); // 서버에서 반환한 네이버 로그인 URL
    return url;
  } catch (error) {
    console.error("네이버 로그인 URL 요청 실패:", error);
    throw error;
  }
};

/**
 * 카카오 로그인 URL 가져오기
 * 스프링부트에서 생성된 카카오 인증 URL을 요청합니다.
 */
export const getKakaoAuthUrl = async () => {
  try {
    const response = await fetch(`${KAKAO_API_BASE_URL}/auth-url`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const url = await response.text(); // 서버에서 반환한 카카오 로그인 URL
    return url;
  } catch (error) {
    console.error("카카오 로그인 URL 요청 실패:", error);
    throw error;
  }
};

/**
 * 네이버 콜백 처리: Access Token 및 사용자 정보 요청
 * 스프링부트로부터 Access Token과 사용자 정보를 가져옵니다.
 */
export const handleNaverCallback = async (code, state) => {
  try {
    const response = await fetch(
      `${NAVER_API_BASE_URL}/callback?code=${code}&state=${state}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const accessToken = data.accessToken; // Access Token
    const userInfo = data.userInfo; // 사용자 정보
    const userJwt = data.userJwt; // 사용자 JWT 토큰

    if (accessToken && userJwt) {
      localStorage.setItem("accessToken", accessToken); // Access Token 저장
      localStorage.setItem("userJwt", userJwt); // 사용자 JWT 저장
      console.log("네이버 Access Token과 JWT 저장 완료");
    } else {
      console.error("네이버 Access Token 또는 사용자 JWT가 없습니다!");
    }

    return { accessToken, userInfo };
  } catch (error) {
    console.error("네이버 콜백 처리 실패:", error);
    throw error;
  }
};

/**
 * 카카오 콜백 처리: Access Token 및 사용자 정보 요청
 * 스프링부트로부터 Access Token과 사용자 정보를 가져옵니다.
 */
export const handleKakaoCallback = async (code) => {
  try {
    const response = await fetch(`${KAKAO_API_BASE_URL}/callback?code=${code}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const accessToken = data.accessToken; // Access Token
    const userInfo = data.userInfo; // 사용자 정보
    const userJwt = data.userJwt; // 사용자 JWT 토큰

    if (accessToken && userJwt) {
      localStorage.setItem("accessToken", accessToken); // Access Token 저장
      localStorage.setItem("userJwt", userJwt); // 사용자 JWT 저장
      console.log("카카오 Access Token과 JWT 저장 완료");
    } else {
      console.error("카카오 Access Token 또는 사용자 JWT가 없습니다!");
    }

    return { accessToken, userInfo };
  } catch (error) {
    console.error("카카오 콜백 처리 실패:", error);
    throw error;
  }
};
