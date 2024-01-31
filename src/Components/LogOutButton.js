import { useAuth } from "../Contexts/AuthContext";

import style from "./LogOutButton.module.css";

export default function LogOutButton() {
  const { logout } = useAuth();

  return (
    <div className={style.logoutButton} onClick={logout}>
      로그아웃
    </div>
  );
}
