import React, { useRef } from "react";
import styles from "./notify.module.css";

export const Notify = ({ message, status, handleNotify }) => {
  const notifyRef = useRef();
  const handleClose = () => {
    handleNotify(false);
  };

  return (
    <div className={styles.container} ref={notifyRef}>
      <div className={styles.status}>
        <i
          className={`fa-solid fa-${status === "success" ? "check" : "xmark"}`}
        ></i>
      </div>
      <div className={styles.message}>{message}</div>
      <div className={styles.cancel} onClick={handleClose}>
        <i className="fa-solid fa-xmark"></i>
      </div>
    </div>
  );
};
