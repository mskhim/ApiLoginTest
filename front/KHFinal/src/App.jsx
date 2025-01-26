import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import AdminMain from "./page/admin/AdminMain.jsx";
import UserLoginPage from "./page/user/UserLoginPage.jsx";
import UserLoginSuccess from "./page/user/UserLoginSuccess.jsx";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* 스프링부트, db, 리액트 연동 확인용 페이지 */}
          <Route path="/" element={<AdminMain />} />
          <Route path="/userLoginPage" element={<UserLoginPage />} />
          <Route path="/userLoginSuccess" element={<UserLoginSuccess />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
