import React from "react";
import { Routes, Route } from "react-router-dom";
import { AppRoutes } from "./AppRoutes";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import SignUpPage from "../pages/SignUpPage";

const MyRoute: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path={AppRoutes.HOME} element={<HomePage />} />
        <Route path={AppRoutes.LOGIN_PAGE} element={<LoginPage />} />
        <Route path={AppRoutes.SIGN_UP_PAGE} element={<SignUpPage />} />
      </Routes>
    </>
  );
};

export default MyRoute;
