import Spinner from "./Spinner";

import style from "./Loader.module.css";

export default function Loader() {
  function preventClick(e) {
    e.stopPropagation();
  }

  return (
    <div className={style.loader} onClick={preventClick}>
      <Spinner />
    </div>
  );
}
