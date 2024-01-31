import { useState } from "react";
import { motion } from "framer-motion";

import style from "./ButtonSelector.module.css";

export default function ButtonSelector({
  className = "",
  initialValue,
  valuesList = [],
  onChange,
}) {
  const numberOfValues = valuesList.length;
  const initialIndex = valuesList.findIndex((val) => val === initialValue);
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  const width = 100 / numberOfValues;

  function handleClick(e) {
    const idx = Number(e.target.value);
    setSelectedIndex(idx);
    onChange(valuesList[idx], idx);
  }

  return (
    <div className={`${style.buttonSelectContainer} ${className}`}>
      <motion.div
        className={style.buttonSelectSlider}
        initial={{ left: `${(selectedIndex / numberOfValues) * 100}%` }}
        animate={{ left: `${(selectedIndex / numberOfValues) * 100}%` }}
        style={{ width: `${width}%` }}
      ></motion.div>
      {valuesList.map((val, idx) => (
        <button
          key={idx}
          value={idx}
          className={`${style.selectButton} ${
            selectedIndex === idx ? style.selected : ""
          }`}
          onClick={handleClick}
          style={{ flexBasis: `${width}%` }}
        >
          {val}
        </button>
      ))}
    </div>
  );
}
