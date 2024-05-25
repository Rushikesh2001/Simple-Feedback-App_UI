import React from "react";
import { useSelector } from "react-redux";
import { AdminPanel } from "../AdminPanel";
import { Login } from "../Login";

export const Admin = () => {
  const state = useSelector((state) => state.appReducer.isLoggedIn);
  return <>{state ? <AdminPanel /> : <Login />}</>;
};
