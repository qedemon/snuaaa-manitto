import Spinner from "./Spinner";
import style from "./Button.module.css";

export default function Button({
  className = "",
  children = "",
  onClick,
  disabled,
}) {
  return (
    <button
      className={`${style.button} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {disabled ? <Spinner /> : children}
    </button>
  );
}
