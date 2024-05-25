import React, { useState } from "react";
import styles from "./login.module.css";
import { Notify } from "../Notification";
import { Loader } from "../Loader";
import { appStore } from "../../store/appStore";
import { Cookie } from "../../common/Cookie";

export const Login = () => {
  const [data, setData] = useState({});
  const [notify, setNotify] = useState(false);
  const [element, setElement] = useState(<></>);
  const [loader, setLoader] = useState(false);

  const handleChange = (eve) => {
    const { name, value } = eve?.target;
    setData({ ...data, [name]: value });
  };

  var timer;
  const debounce = (eve) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      handleChange(eve);
    }, 1000);
  };

  const handleNotify = (data) => {
    setNotify(data);
  };

  const handleSubmit = async () => {
    setLoader(true);
    var count = 0;
    var inpCount = document.querySelectorAll(
      "input[type='text'],input[type='password']"
    ).length;
    for (let prop in data) {
      count++;
    }
    if (count === inpCount) {
      var res = await fetch(`${process.env.REACT_APP_SERVER_URL}/admin/login`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
      });
      res = await res.json();
      console.log(res);
      setNotify(true);
      if (res.auth) {
        appStore.dispatch({ type: "AUTH", payload: true });
        const { token } = res;
        Cookie.setCookies("token", token);
      } else {
        setElement(
          <Notify
            message="Invalid credentials. Try again!!!"
            status="failure"
            handleNotify={handleNotify}
          />
        );
      }
    } else {
      setElement(
        <Notify
          message="Please fill all the details!!!"
          status="failure"
          handleNotify={handleNotify}
        />
      );
    }
    setLoader(false);
  };

  return (
    <>
      {notify && element}
      {loader && <Loader />}
      <div className={styles.container}>
        <h1 className={styles.title}>Admin Login</h1>
        <div className={styles.form}>
          <label htmlFor="name">Username</label>
          <input type="text" name="name" onChange={debounce} />
          <label htmlFor="pwd">Password</label>
          <input type="password" name="pwd" onChange={debounce} />
          <input type="submit" value="Login" onClick={handleSubmit} />
        </div>
      </div>
    </>
  );
};
