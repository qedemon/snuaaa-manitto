import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";

import LoginForm from "../Components/LoginForm";

import Moon from "../Assets/Images/Moon.svg";
import style from "./LoginPage.module.css";

export default function LoginPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // 로그인 되어있는 상태면 마니또페이지로 이동
  useEffect(() => {
    if (user?.valid) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className={style.loginContainer}>
      <img className={style.loginImage} src={Moon} alt="Moon" />
      <h1 className={style.loginHeader}>Log In</h1>
      <LoginForm />
    </div>
  );
}
