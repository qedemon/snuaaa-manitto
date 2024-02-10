import Cycle from "../Assets/Images/Cycle.svg";
import style from "./RefreshButton.module.css";

export default function RefreshButton({ onClick }) {
  return (
    <div className={style.refreshButton} onClick={onClick}>
      <img src={Cycle} alt="refresh" />
    </div>
  );
}
