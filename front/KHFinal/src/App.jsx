import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import AdminMain from "./page/admin/AdminMain.jsx";
import UserLoginPage from "./page/user/UserLoginPage.jsx";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/adminMain" element={<AdminMain />} />
          <Route path="/userLoginPage" element={<UserLoginPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
