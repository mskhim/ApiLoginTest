const NAVER_API_BASE_URL = 'http://localhost:8080/user/naver'; // 스프링 부트 네이버 로그인 API 경로
const KAKAO_API_BASE_URL = 'http://localhost:8080/user/kakao'; // 스프링 부트 카카오 로그인 API 경로

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
    console.error('네이버 로그인 URL 요청 실패:', error);
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
    console.error('카카오 로그인 URL 요청 실패:', error);
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

    const { accessToken, userInfo, userJwt, isRegist } = data; // 응답 데이터 구조 분해

    return { accessToken, userInfo, isRegist, userJwt }; // isRegist 추가 반환
  } catch (error) {
    console.error('네이버 콜백 처리 실패:', error);
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
    const { accessToken, userInfo, userJwt, isRegist } = data; // 응답 데이터 구조 분해

    return { accessToken, userInfo, isRegist, userJwt }; // isRegist 추가 반환
  } catch (error) {
    console.error('카카오 콜백 처리 실패:', error);
    throw error;
  }
};
/**
 * 회원가입 처리
 */
export const handleRegister = async (formData) => {
  try {
    alert(formData.name);
    const response = await fetch('http://localhost:8080/user/insert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData), // 순환 참조 방지
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    alert('회원가입이 완료되었습니다. 이전페이지로 이동합니다.');
    window.history.go(-31); // 이전 페이지로 이동
    return data;
  } catch (error) {
    console.error('회원가입 요청 실패:', error);
    alert('회원가입 중 오류가 발생했습니다. ' + error.message);
    throw error;
  }
};
