import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { ReactComponent as Arrow } from "../Assets/Images/Arrow.svg";
import style from "./DropDown.module.css";

const variants = {
  close: {
    opacity: 0,
    top: 0,
  },
  open: {
    opacity: 1,
    top: 59,
  },
};

export default function DropDown({
  className = "",
  img: Svg,
  initialValue = null,
  valuesList = [],
  placeholder,
  onChange,
  disabled,
}) {
  const [index, setIndex] = useState(initialValue);
  const [isOpen, setIsOpen] = useState(false);
  const dropDownRef = useRef();

  const rotateArrow = {
    transform: `rotateZ(${isOpen ? "-180deg" : "0deg"})`,
  };

  function handleClick() {
    if (!disabled) {
      setIsOpen((prevIsOpen) => !prevIsOpen);
    }
  }

  function handleChange(e) {
    e.stopPropagation();
    if (!disabled) {
      const idx = Number(e.target.value);
      onChange(valuesList[idx], idx);
      setIndex(idx);
      setIsOpen(false);
    }
  }

  // 드롭다운이 오픈되었을 때 바깥 부분을 누르면 닫게 만들기
  useEffect(() => {
    if (isOpen) {
      const closeWindow = (e) => {
        if (!dropDownRef.current.contains(e.target)) {
          e.stopPropagation();
          setIsOpen(false);
        }
      };

      document.addEventListener("click", closeWindow);

      return () => {
        document.removeEventListener("click", closeWindow);
      };
    }
  }, [isOpen]);

  // 드롭다운 비활성화 되었을 때 드롭다운 닫기
  useEffect(() => {
    if (disabled) {
      setIsOpen(false);
    }
  }, [disabled]);

  return (
    <div
      ref={dropDownRef}
      className={`${disabled ? style.disabled : ""} ${
        style.dropDownContainer
      } ${className}`}
    >
      <button className={style.dropDownButton} onClick={handleClick}>
        {Svg && <Svg className={style.dropDownButtonImage} />}
        <p className={style.dropDownButtonPlaceHolder}>
          {index !== null ? valuesList[index] : placeholder}
        </p>
        <motion.div
          className={style.dropDownButtonArrowWrapper}
          animate={rotateArrow}
        >
          <Arrow className={style.dropDownButtonArrow} src={Arrow} />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={style.dropDownListContainer}
            variants={variants}
            initial="close"
            animate="open"
            exit="close"
          >
            <ul className={style.dropDownList}>
              {valuesList.map((val, idx) => (
                <li key={idx} className={style.dropDownListItem}>
                  <button
                    value={idx}
                    className={style.dropDownListItemButton}
                    onClick={handleChange}
                    disabled={!isOpen}
                  >
                    {val}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
