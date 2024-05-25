import React, { useState } from "react";
import styles from "./form.module.css";
import { Loader } from "../Loader";
import { Notify } from "../Notification";

export const Form = () => {
  const [data, setData] = useState({});
  const [loader, setLoader] = useState(false);
  const [notify, setNotification] = useState(false);
  const [element, setElement] = useState(<></>);

  const handleData = (eve) => {
    const { name, value } = eve?.target;
    if (value !== "") {
      setData({ ...data, [name]: value });
    }
  };

  const handleNotify = (data) => {
    setNotification(data);
  };

  const clearInputs = (allInputs) => {
    for (let inp of allInputs) {
      inp.value = "";
    }
    setData({});
  };

  const handleSubmit = async (eve) => {
    setLoader(true);
    // setLoader(true);
    const inps = document.querySelectorAll(
      "input[type='text'], input[type='email'], textarea"
    );
    console.log(data);
    const inpCount = inps.length;
    var count = 0;
    for (let property in data) {
      if (data[property]) {
        count++;
      }
    }
    if (count === inpCount) {
      var res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/feedback/save`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      res = await res.json();
      console.log(res);
      const { issueId } = res;
      if (res.status === "failure") {
        setNotification(true);
        setElement(
          <Notify
            message="Failed to save feedback. Try again!!"
            status="failure"
            handleNotify={handleNotify}
          />
        );
      } else {
        async function sendMail(data, issueId) {
          var mailResponse = await fetch(
            `${process.env.REACT_APP_SERVER_URL}/feedback/mail`,
            {
              method: "POST",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify({
                issue: data.issue,
                description: data.description,
                issueId,
              }),
            }
          );
          mailResponse = await mailResponse.json();
          return mailResponse;
        }
        const mailResponse = await sendMail(data, issueId);
        if (mailResponse.status === "success") {
          setNotification(true);
          setElement(
            <Notify
              message="Form submitted successfully"
              status="success"
              handleNotify={handleNotify}
            />
          );
        } else {
          sendMail(data, issueId);
        }
      }
      clearInputs(inps);
    } else {
      setNotification(true);
      setElement(
        <Notify
          message="Please fill all the details"
          status="error"
          handleNotify={handleNotify}
        />
      );
    }
    setLoader(false);
  };

  return (
    <>
      {loader && <Loader />}
      {notify && element}
      <div className={styles.container}>
        <h3 className={styles.title}>Contact form</h3>
        <div className={styles.form}>
          <label htmlFor="name">Name</label>
          <input type="text" name="name" onChange={handleData} />
          <label htmlFor="email">Email</label>
          <input type="email" name="email" onChange={handleData} />
          <label htmlFor="contact">Mobile number</label>
          <input type="text" name="contact" onChange={handleData} />
          <label htmlFor="issue">What is your issue?</label>
          <input type="text" name="issue" onChange={handleData} />
          <label htmlFor="description">Brief description</label>
          <textarea
            name="description"
            cols="30"
            rows="10"
            placeholder="Describe the issue in detail....."
            onChange={handleData}
          ></textarea>
          <input type="submit" value="Submit" onClick={handleSubmit} />
        </div>
      </div>
    </>
  );
};
