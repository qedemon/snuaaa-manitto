import { useNavigate } from "react-router-dom";
import Arrow from "../Assets/Images/ArrowPurple.svg";
import style from "./BackButton.module.css";

export default function BackButton({ to }) {
  const navigate = useNavigate();

  return (
    <div
      className={style.backButton}
      onClick={() => {
        navigate(to);
      }}
    >
      <img src={Arrow} alt="back" />
    </div>
  );
}
