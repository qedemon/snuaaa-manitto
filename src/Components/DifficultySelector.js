import { useState } from "react";

import Stars from "./Stars";

import style from "./DifficultySelector.module.css";

export default function DifficultySelector({ value, onChange }) {
  const [difficulty, setDifficulty] = useState(value);

  function handleSelect(nextValue) {
    onChange(nextValue);
  }

  function handleMouseOut() {
    setDifficulty(value);
  }

  return (
    <Stars
      className={style.difficultySelector}
      value={difficulty}
      onSelect={handleSelect}
      onHover={setDifficulty}
      onMouseOut={handleMouseOut}
    />
  );
}
