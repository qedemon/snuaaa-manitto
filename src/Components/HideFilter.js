import { motion, AnimatePresence } from "framer-motion";

import style from "./HideFilter.module.css";

const variants = {
  container: {
    open: {
      backdropFilter: "blur(30px)",
    },
    close: {
      backdropFilter: "blur(0px)",
    },
  },
  text: {
    open: {
      opacity: 1,
      bottom: "0px",
    },
    close: {
      opacity: 0,
      bottom: "20px",
    },
  },
};

export default function HideFilter({ hide }) {
  return (
    <AnimatePresence>
      {hide && (
        <motion.div
          variants={variants.container}
          initial="close"
          animate="open"
          exit="close"
          className={style.hideFilterContainer}
        >
          <motion.div
            className={style.hideFilterText}
            variants={variants.text}
            initial="close"
            animate="open"
            exit="close"
          >
            <h1>Stealth Mode</h1>
            <p>터치해서 숨기기 취소</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
