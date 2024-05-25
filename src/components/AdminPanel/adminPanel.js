import React, { useEffect, useRef, useState } from "react";
import styles from "./adminPanel.module.css";
import { Notify } from "../Notification/notify";
import { Loader } from "../Loader/loader";
import { Cookie } from "../../common/Cookie";

export const AdminPanel = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [notification, setNotification] = useState(false);
  const [element, setElement] = useState(<></>);
  const [loader, setLoader] = useState(false);
  const messageRef = useRef();

  useEffect(() => {
    getFeedbacks("all");
  }, []);

  const handleTabs = (eve) => {
    eve.stopPropagation();
    const { id, className } = eve?.target;
    const tabs = document.getElementsByClassName(`${styles.tabs}`);
    for (let tab of tabs) {
      if (!className.includes(`${styles.active}`)) {
        if (tab.id === id) {
          eve.target.classList = `${styles.tabs} ${styles.active}`;
        } else {
          tab.classList.remove(`${styles.active}`);
          tab.classList.add(`${styles.inActive}`);
        }
      }
    }
  };

  const handleNotify = (data) => {
    setNotification(data);
  };

  const getFeedbacks = async (status) => {
    setLoader(true);
    try {
      var res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/feedback/data/${status}`,
        {
          method: "POST",
          headers: {
            Authorization: Cookie.getCookies("token"),
          },
        }
      );
      res = await res.json();
      if (res.status === "success") {
        setFeedbacks(res.data);
      } else {
        setNotification(true);
        setElement(
          <Notify
            status="failure"
            message="Try to refresh the page!!!"
            handleNotify={handleNotify}
          />
        );
      }
    } catch (error) {
      setNotification(true);
      setElement(
        <Notify
          status="failure"
          message={error.message}
          handleNotify={handleNotify}
        />
      );
    }
    setLoader(false);
  };

  const handleSave = async (issueId) => {
    setLoader(true);
    try {
      var res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/feedback/saveFeedback?issueId=${issueId}`,
        {
          method: "POST",
          headers: {
            Authorization: Cookie.getCookies("token"),
          },
        }
      );
      res = await res.json();
      setNotification(true);
      if (res.status === "success") {
        setElement(
          <Notify
            status="success"
            message="Archived successfully!"
            handleNotify={handleNotify}
          />
        );
      } else {
        setNotification(true);
        setElement(
          <Notify
            status="failure"
            message="Something went wrong.Try again!!!"
            handleNotify={handleNotify}
          />
        );
      }
    } catch (error) {
      setNotification(true);
      setElement(
        <Notify
          status="failure"
          message={error.message}
          handleNotify={handleNotify}
        />
      );
    }
    setLoader(false);
  };

  const sendMail = async (obj) => {
    if (!messageRef.current.value) {
      return;
    }
    setLoader(true);
    const { value } = messageRef.current;
    try {
      var res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/feedback/mail/resolve?client=user`,
        {
          method: "POST",
          headers: {
            Authorization: Cookie.getCookies("token"),
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            issueId: obj.issueId,
            issue: obj.issue,
            message: value,
            email: obj.email,
          }),
        }
      );
      res = await res.json();
      if (res.status === "success") {
        var res2 = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/feedback/mail/resolve?client=support`,
          {
            method: "POST",
            headers: {
              Authorization: Cookie.getCookies("token"),
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              issueId: obj.issueId,
              issue: obj.issue,
              message: value,
              email: obj.email,
            }),
          }
        );
        res2 = await res2.json();
        if (res2.status === "success") {
          var res3 = await fetch(
            `${process.env.REACT_APP_SERVER_URL}/feedback/resolve?issueId=${obj.issueId}`,
            {
              method: "POST",
              headers: {
                Authorization: Cookie.getCookies("token"),
              },
            }
          );
          res3 = await res3.json();
          if (res3.status === "success") {
            setNotification(true);
            setElement(
              <Notify
                status="success"
                message="Issue has been resolved!"
                handleNotify={handleNotify}
              />
            );
            messageRef.current.value = "";
            document.getElementById(`${styles.dialog}`).style.display = "none";
          } else {
            setNotification(true);
            setElement(
              <Notify
                status="failure"
                message="Something went wrong.Try again!!!"
                handleNotify={handleNotify}
              />
            );
          }
        } else {
          setNotification(true);
          setElement(
            <Notify
              status="failure"
              message="Something went wrong.Try again!!!"
              handleNotify={handleNotify}
            />
          );
        }
      } else {
        setNotification(true);
        setElement(
          <Notify
            status="failure"
            message="Something went wrong.Try again!!!"
            handleNotify={handleNotify}
          />
        );
      }
    } catch (error) {
      setNotification(true);
      setElement(
        <Notify
          status="failure"
          message={error.message}
          handleNotify={handleNotify}
        />
      );
    }
    setLoader(false);
  };

  const handleResolve = (eve, obj) => {
    var dialog = document.getElementById(`${styles.dialog}`);
    console.log(dialog);
    dialog.style.display = "flex";
    dialog.getElementsByTagName("input")[0].setAttribute("value", obj.email);
    var buttons = dialog.getElementsByTagName("div")[0];
    buttons.getElementsByTagName("button")[1].addEventListener("click", () => {
      sendMail(obj);
    });
  };

  return (
    <>
      {loader && <Loader />}
      {notification && element}
      <div className={styles.container}>
        <div id={styles.navigation}>
          <div
            id="tab1"
            className={`${styles.tabs} ${styles.active}`}
            onClick={(eve) => {
              handleTabs(eve);
              getFeedbacks("all");
            }}
          >
            All({feedbacks.length})
          </div>
          <div
            id="tab2"
            className={`${styles.tabs} ${styles.inActive}`}
            onClick={(eve) => {
              handleTabs(eve);
              getFeedbacks("resolved");
            }}
          >
            Resolved({feedbacks.length})
          </div>
          <div
            id="tab3"
            className={`${styles.tabs} ${styles.inActive}`}
            onClick={(eve) => {
              handleTabs(eve);
              getFeedbacks("pending");
            }}
          >
            Pending({feedbacks.length})
          </div>
          <div
            id="tab4"
            className={`${styles.tabs} ${styles.inActive}`}
            onClick={(eve) => {
              handleTabs(eve);
              getFeedbacks("archived");
            }}
          >
            Archived({feedbacks.length})
          </div>
        </div>
        <table id={styles.panel}>
          <thead id={styles.head}>
            <tr>
              <th className={styles.headers}>Issue Id</th>
              <th className={styles.headers} style={{ margin: "0 20px" }}>
                Customer name
              </th>
              <th className={styles.headers} style={{ margin: "0 95px" }}>
                Email
              </th>
              <th className={styles.headers}>Contact no.</th>
              <th className={styles.headers} style={{ margin: "0 16px" }}>
                Issue
              </th>
              <th
                className={styles.headers}
                style={{ margin: "0 72px 0 97px" }}
              >
                Description
              </th>
              <th
                className={styles.headers}
                style={{ margin: "0 17px 0 46px" }}
              >
                Date of issue
              </th>
              <th className={styles.headers}>Controls</th>
            </tr>
          </thead>
          <tbody id={styles.body}>
            {feedbacks.map((obj, ind) => {
              return (
                <tr className={styles.issues} key={`feedback_${ind + 1}`}>
                  <td className={styles.issueId}>{obj.issueId}</td>
                  <td className={styles.name}>{obj.name}</td>
                  <td className={styles.email}>{obj.email}</td>
                  <td className={styles.contact}>{obj.contact}</td>
                  <td className={styles.issue}>{obj.issue}</td>
                  <td className={styles.description}>{obj.description}</td>
                  <td className={styles.date}>{obj.date}</td>
                  <td className={styles.resolve}>
                    <button
                      type="button"
                      disabled={obj.status === "resolved"}
                      onClick={(eve) => {
                        handleResolve(eve, obj);
                      }}
                    >
                      {obj.status === "resolved" ? "Resolved" : "Resolve"}
                    </button>
                    <button
                      type="button"
                      disabled={obj.save}
                      onClick={() => {
                        handleSave(obj.issueId);
                      }}
                    >
                      {obj.save ? "Archived" : "Save"}
                    </button>
                  </td>
                </tr>
              );
            })}
            <tr id={styles.dialog}>
              <label htmlFor="email">To</label>
              <input type="text" name="email" disabled />
              <label htmlFor="message">Message</label>
              <textarea
                name="message"
                cols="30"
                rows="10"
                placeholder="Provide a message to customer..."
                ref={messageRef}
              ></textarea>
              <div id={styles.buttons}>
                <button
                  type="reset"
                  onClick={() => {
                    document.getElementById(`${styles.dialog}`).style.display =
                      "none";
                    messageRef.current.value = "";
                  }}
                >
                  Cancel
                </button>
                <button type="submit">Send mail</button>
              </div>
            </tr>
            {!feedbacks.length && (
              <tr id={styles.empty}>There are no feedbacks to load</tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};
