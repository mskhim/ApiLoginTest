import './App.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import AdminMain from './page/admin/AdminMain.jsx';
import UserLoginPage from './page/user/UserLoginPage.jsx';
import UserLoginSuccess from './page/user/UserLoginSuccess.jsx';
import UserInsert from './page/user/UserInsert.jsx';
import UserDelete from './page/user/UserDelete.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import AdminStats from './page/admin/AdminStats';
import AdminLayout from './page/layout/AdminLayout.jsx';
import UserLayout from './page/layout/UserLayout.jsx';
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* 스프링부트, db, 리액트 연동 확인용 페이지 */}
          <Route path="/" element={<AdminMain />} />

          <Route path="/userLoginPage" element={<UserLoginPage />} />
          <Route path="/userLoginSuccess" element={<UserLoginSuccess />} />
          <Route path="/userInsert" element={<UserInsert />} />
          <Route path="/unauthorized" element={<AdminMain />} />

          {/* ProtectedRoute 내부에서 여러 개의 경로 관리 */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute requiredRole={0} endpoint="jwtAdmin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="adminStats" element={<AdminStats />} />
          </Route>
          {/* ProtectedRoute 내부에서 여러 개의 경로 관리 */}
          <Route
            path="/user/*"
            element={
              <ProtectedRoute requiredRole={2} endpoint="jwtUser">
                <UserLayout />
              </ProtectedRoute>
            }
          >
            <Route path="userDelete" element={<UserDelete />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
