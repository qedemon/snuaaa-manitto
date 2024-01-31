import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import Find from "../Assets/Images/Find.svg";
import style from "./UsersList.module.css";

const listVariants = {
  hidden: { opacity: 0, x: -100, y: 100, rotate: -10 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    rotate: 0,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    x: -100,
    y: 100,
    rotate: -10,
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    rotate: 0,
    transition: {
      ease: "easeOut",
      duration: 0.2,
    },
  },
};

function UserCard({ value, selected, onClick }) {
  function handleClick() {
    onClick(value);
  }

  return (
    <motion.li
      className={`${style.userListItem} ${selected ? style.selected : ""}`}
      variants={itemVariants}
      onClick={handleClick}
    >
      <p className={style.userListItemName}>{value.name}</p>
      <p className={style.userListItemMajor}>
        {value.col_no} - {value.major}
      </p>
    </motion.li>
  );
}

export default function UsersList({
  className = "",
  values: initialValues,
  value: selectedValue,
  onClick,
}) {
  const [query, setQuery] = useState("");
  const [filteredValues, setFilteredValues] = useState(initialValues);

  function handleChange(e) {
    setQuery(e.target.value);
  }

  useEffect(() => {
    if (query) {
      setFilteredValues(
        initialValues.filter((val) => val.name.includes(query))
      );
    } else {
      setFilteredValues(initialValues);
    }
  }, [query, initialValues]);

  return (
    <div className={`${style.searchContainer} ${className}`}>
      <div className={style.searchInputContainer}>
        <input
          className={style.searchInput}
          value={query}
          onChange={handleChange}
          placeholder="이름으로 찾기"
        />
        <img src={Find} alt="find" />
      </div>
      <motion.ul
        className={style.userList}
        initial="hidden"
        animate="visible"
        variants={listVariants}
      >
        {filteredValues.map((el, idx) => (
          <UserCard
            key={idx}
            value={el}
            selected={selectedValue === el}
            onClick={onClick}
          />
        ))}
      </motion.ul>
    </div>
  );
}
