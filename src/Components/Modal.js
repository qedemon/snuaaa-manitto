import { motion } from "framer-motion";

import Close from "../Assets/Images/Close.svg";
import style from "./Modal.module.css";

export default function Modal({ height, children, onClose }) {
  function closeWindow(e) {
    e.stopPropagation();
    onClose();
  }

  function preventClose(e) {
    e.stopPropagation();
  }

  const variants = {
    open: {
      width: "80%",
      height: `${height}px`,
      maxWidth: "300px",
      opacity: 1,
    },
    close: {
      width: "100%",
      height: `${(height * 5) / 4}px`,
      maxWidth: "375px",
      opacity: 0,
    },
  };

  return (
    <div className={style.windowBackground} onClick={preventClose}>
      <div className={style.windowWrapper}>
        <motion.div
          className={style.window}
          variants={variants}
          initial="close"
          animate="open"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={style.contentWrapper}
          style={{ height }}
        >
          {children}
          <div className={style.closeButton} onClick={closeWindow}>
            <img src={Close} alt="close" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
