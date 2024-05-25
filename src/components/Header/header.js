import React from "react";
import styles from "./header.module.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { appStore } from "../../store/appStore";
import { Cookie } from "../../common/Cookie";

export const Header = () => {
  const navigate = useNavigate();
  const state = useSelector((state) => state.appReducer.isLoggedIn);

  const handleNavigation = () => {
    navigate("/admin");
  };

  const handleLogout = () => {
    appStore.dispatch({ type: "AUTH", payload: false });
    Cookie.deleteCookie("token");
  };

  return (
    <nav className={styles.navbar}>
      <h1 className={styles.heading}>
        <a href="/" target="_blank">
          User feedback
        </a>
      </h1>
      {!state && (
        <button className={styles.btn} onClick={handleNavigation}>
          Admin Panel
        </button>
      )}
      {state && (
        <button type="reset" className={styles.btn} onClick={handleLogout}>
          Logout
        </button>
      )}
    </nav>
  );
};
