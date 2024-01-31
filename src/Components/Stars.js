import { ReactComponent as StarImage } from "../Assets/Images/Star.svg";
import style from "./Stars.module.css";

const DIFFICULTY = [1, 2, 3];

function Star({ selected = false, difficulty = 0, onSelect, onHover }) {
  function handleClick() {
    if (onSelect) {
      onSelect(difficulty);
    }
  }

  function handleMouesOver() {
    if (onHover) {
      onHover(difficulty);
    }
  }

  return (
    <StarImage
      className={`${style.star} ${selected ? style.selected : ""}`}
      style={onHover ? { cursor: "pointer" } : {}}
      onClick={handleClick}
      onMouseOver={handleMouesOver}
    />
  );
}

export default function Stars({
  className = "",
  value = 0,
  onSelect,
  onHover,
  onMouseOut,
}) {
  return (
    <div className={className} onMouseOut={onMouseOut}>
      {DIFFICULTY.map((difficulty) => (
        <Star
          key={difficulty}
          selected={value >= difficulty}
          difficulty={difficulty}
          onSelect={onSelect}
          onHover={onHover}
        />
      ))}
    </div>
  );
}
