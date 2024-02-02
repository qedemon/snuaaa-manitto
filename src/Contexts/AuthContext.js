import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import loginConnect from "../Connections/MainConnection";
import dataConnect from "../Connections/NovaConnection";

import { deleteToken, setToken } from "../Utils/Cookie";

const INVALID_USER = {
  valid: false,
};

const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  register: () => {},
  getUser: () => {},
  updateUser: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  async function getUser() {
    try {
      const response = await dataConnect.get("/user/whoami/");

      setUser({
        valid: true,
        ...response.data.userInfo,
        isEnrolled: response.data.origin === "local",
      });
    } catch {
      setUser(INVALID_USER);
      throw new Error(
        "서버에서 유저 데이터를 불러오는 도중 에러가 발생했습니다. 잠시 후 다시 시도해 주세요."
      );
    }
  }

  async function login({ id, password }) {
    try {
      // const response = await loginConnect.post("/auth/login/", {
      const response = await loginConnect.post("/", {
        id,
        password,
      });

      const { token } = response.data;
      setToken(token);
    } catch (error) {
      if (error?.response?.status === 403) {
        throw new Error("아이디 및 비밀번호가 일치하지 않습니다.");
      } else {
        throw new Error(
          "로그인 도중 에러가 발생했습니다. 잠시 후 다시 시도해 주세요."
        );
      }
    }
    await getUser();
  }

  function logout() {
    setUser(INVALID_USER);
    deleteToken();
  }

  async function register(data) {
    try {
      const response = await dataConnect.post("/user/registerUser/", data);

      setUser({
        valid: true,
        ...response.data.user,
        isEnrolled: true,
      });
    } catch {
      throw new Error(
        "마니또를 등록하는 데 실패하였습니다. 잠시 후 다시 시도해주세요."
      );
    }
  }

  async function updateUser(name, value) {
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  }

  useEffect(() => {
    (async () => {
      try {
        await getUser();
      } catch {}
    })();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        getUser,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(loginAuthRequired) {
  const context = useContext(AuthContext);
  const navigate = useNavigate();

  if (!context) {
    throw new Error("반드시 AuthProvider 안에서 사용해야 합니다.");
  }

  useEffect(() => {
    if (loginAuthRequired && context.user && !context.user.valid) {
      navigate("/login");
    }
  }, [loginAuthRequired, context.user, navigate]);

  return context;
}
