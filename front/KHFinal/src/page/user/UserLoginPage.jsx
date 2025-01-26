import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useEffect } from "react";

import ApiLogin from "./components/ApiLogin";
const UserLoginPage = () => {
  return (
    <>
      <Header />
      <h1>UserLoginPage</h1>
      <ApiLogin />
      <Footer />
    </>
  );
};

export default UserLoginPage;
