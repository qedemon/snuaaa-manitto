import { useEffect, useState } from "react";
import { useAuth } from "../Contexts/AuthContext";
import useAsync from "../Hooks/useAsync";

import Button from "./Button";

import style from "./LoginForm.module.css";

export default function LoginForm() {
  const { login } = useAuth();
  const [isLoginPending, loginError, loginAsync] = useAsync(login);
  const [loginData, setLoginData] = useState({
    id: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [inputError, setInputError] = useState(false);

  function handleShowPassword(e) {
    e.stopPropagation();
    setShowPassword(true);
  }

  function handleChange(e) {
    setInputError(false);
    const { name, value } = e.target;
    setLoginData((prevLoginData) => ({
      ...prevLoginData,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!loginData.id || !loginData.password) {
      setInputError(true);
      return;
    }
    await loginAsync(loginData);
  }

  // 패스워드에 있는 Show 버튼 누를 시, 1초 동안 비밀번호 보여줌
  useEffect(() => {
    if (showPassword) {
      const timerId = setTimeout(() => {
        setShowPassword(false);
      }, 1000);

      return () => clearTimeout(timerId);
    }
  }, [showPassword]);

  // 로그인 도중 에러 발생 시, 인풋박스에 빨간 테두리 삽입
  useEffect(() => {
    if (loginError) {
      setInputError(true);
    }
  }, [loginError]);

  return (
    <form className={style.loginForm} onSubmit={handleSubmit}>
      <div className={style.loginInputContainer}>
        <input
          className={`${style.loginInput} ${
            inputError && !isLoginPending ? style.error : ""
          }`}
          name="id"
          type="text"
          value={loginData.id}
          onChange={handleChange}
          placeholder="아이디"
        />
      </div>
      <div className={style.loginInputContainer}>
        <input
          className={`${style.loginInput} ${
            inputError && !isLoginPending ? style.error : ""
          }`}
          name="password"
          type={showPassword ? "text" : "password"}
          value={loginData.password}
          onChange={handleChange}
          placeholder="패스워드"
        />
        <p className={style.passwordShowButton} onClick={handleShowPassword}>
          Show
        </p>
      </div>
      <p className={style.loginDescription}>
        로그인 정보는 서울대학교 아마추어 천문회(
        <a href="https://our.snuaaa.net">our.snuaaa.net</a>) 커뮤니티와
        동일합니다.
      </p>
      <a
        className={style.loginFind}
        href="https://our.snuaaa.net/page/auth/login"
      >
        아이디/비밀번호 찾기
      </a>
      <div className={style.buttonContainer}>
        <Button className={style.loginButton} disabled={isLoginPending}>
          로그인
        </Button>
        <p className={style.errorMessage}>
          {inputError &&
            !isLoginPending &&
            (loginError
              ? loginError.message
              : "아이디 및 패스워드를 입력해 주세요.")}
        </p>
      </div>
    </form>
  );
}
