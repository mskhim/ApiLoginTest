import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleRegister } from './userApi';
const UserInsert = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: '',
    phone: '',
    gender: '',
    birth: '',
    region: '',
    provider: '',
    name: '',
    email: '',
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (!storedUser) {
      alert('잘못된 접근입니다.');
      navigate('/');
      return;
    }

    // SNS 데이터 추출
    const snsData = storedUser.response || storedUser.kakao_account || {};

    // 생년월일 처리
    const birthYear = snsData.birthyear || '';
    const birthMonth = snsData.birthday?.slice(0, 2) || '';
    const birthDay = snsData.birthday?.slice(-2) || '';
    const birthDate =
      birthYear && birthMonth && birthDay
        ? `${birthYear}-${birthMonth}-${birthDay}`
        : '';

    // 전화번호 처리
    const phoneNumber =
      snsData.mobile ||
      (snsData.phone_number ? `0${snsData.phone_number.slice(4)}  ` : '');

    // 성별 처리
    const gender =
      snsData.gender === 'male' ? 'M' : snsData.gender === 'female' ? 'F' : '';

    // SNS 제공자
    const provider = storedUser.response
      ? 'naver'
      : storedUser.kakao_account
      ? 'kakao'
      : '';

    // Form 데이터 설정
    setFormData({
      id: storedUser.response?.id || storedUser.id || '', // SNS 고유 ID
      phone: phoneNumber, // 전화번호
      gender: gender, // 성별
      birth: birthDate, // 생년월일
      region: '', // 지역 (직접 입력)
      provider: provider, // SNS 프로바이더
      name: snsData.name || '', // 이름
      email: snsData.email || '', // 이메일
    });
    //컴포넌트 언마운트 시 localStorage에서 'user' 삭제
    const handleUnload = () => {
      console.log('🚨 페이지를 떠남! localStorage에서 user & accessToken 삭제');
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
    };

    window.addEventListener('beforeunload', handleUnload);

    // ✅ 컴포넌트 언마운트 시 localStorage에서 'user' 삭제 (SPA 환경에서도 동작)
    return () => {
      console.log(
        '🚨 컴포넌트 언마운트! localStorage에서 user & accessToken 삭제'
      );
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [navigate]);

  //제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault(); // 기본 제출 동작 방지
    handleRegister(formData); // formData를 handleRegister로 전달
  };
  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  if (!formData.provider) return <p>Loading...</p>;

  return (
    <div>
      <h1>회원가입 페이지</h1>
      <form onSubmit={handleSubmit}>
        {/* Hidden 필드 */}
        <input type="hidden" name="id" value={formData.id} />
        <input type="hidden" name="provider" value={formData.provider} />
        <input type="hidden" name="role" value="2" />

        <label>
          이름:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          이메일:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          전화번호:
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          성별:
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">선택 없음</option>
            <option value="M">남성</option>
            <option value="F">여성</option>
          </select>
        </label>
        <br />
        <label>
          생년월일:
          <input
            type="date"
            name="birth"
            value={formData.birth}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          지역 코드:
          <input
            type="number"
            name="region"
            value={formData.region}
            onChange={handleChange}
            placeholder="지역 코드를 입력하세요"
          />
        </label>
        <br />
        <button type="submit">회원가입 완료</button>
      </form>
    </div>
  );
};

export default UserInsert;
