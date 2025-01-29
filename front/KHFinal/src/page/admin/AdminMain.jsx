import { useState, useEffect } from 'react';
import Header from '../../components/Header';
const AdminMain = () => {
  const [test, setTest] = useState('');
  const [inputValue, setInputValue] = useState(''); // input 필드 값
  const [userJWt, setUserJWT] = useState(localStorage.getItem('userJwt'));
  const [userAccessToken, setUserAccessToken] = useState(
    localStorage.getItem('accessToken')
  );
  const [user, setUser] = useState(localStorage.getItem('user'));
  useEffect(() => {
    setUserJWT(localStorage.getItem('userJwt'));
    setUserAccessToken(localStorage.getItem('accessToken'));
    fetch('http://localhost:8080/admin/test', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', // 요청 헤더 설정
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json(); // JSON 응답 처리
      })
      .then((data) => {
        setTest(data.test); // 서버에서 "test" 키의 값을 설정
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  // 버튼 클릭 이벤트 핸들러
  const handleInsertClick = (e) => {
    e.preventDefault(); // 폼의 기본 동작(페이지 새로고침)을 막음

    if (!inputValue.trim()) {
      alert('Input field cannot be empty!');
      return;
    }

    fetch('http://localhost:8080/admin/insert', {
      method: 'POST', // POST 요청으로 데이터 전송
      headers: {
        'Content-Type': 'application/json', // JSON 형식으로 데이터 전송
      },
      body: JSON.stringify({ name: inputValue }), // 입력 값 전송
    });
  };

  return (
    <div>
      <Header />
      {test ? `Test Data: ${test}` : 'Loading...'}
      <form action=""></form>
      <form onSubmit={handleInsertClick}>
        <input
          type="text"
          name="name"
          placeholder="Enter name"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)} // 입력 필드 값 업데이트
        />
        <button type="submit">Submit</button>
        {userJWt ? <h1>JWT: {userJWt}</h1> : <h1>JWT 없음</h1>}
        {userAccessToken ? (
          <h1>AccessToken: {userAccessToken}</h1>
        ) : (
          <h1>AccessToken 없음</h1>
        )}
        {user ? <h1>User: {user}</h1> : <h1>User 없음</h1>}
      </form>
    </div>
  );
};

export default AdminMain;
