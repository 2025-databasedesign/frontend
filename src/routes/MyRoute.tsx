import React from "react";
import { Routes, Route } from "react-router-dom";
import { AppRoutes } from "./AppRoutes";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import SignUpPage from "../pages/SignUpPage";
import SchedulePage from "../pages/SchedulePage";
import ReservationPage from "../pages/ReservationPage";

const MyRoute: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path={AppRoutes.HOME} element={<HomePage />} />
        <Route path={AppRoutes.LOGIN_PAGE} element={<LoginPage />} />
        <Route path={AppRoutes.SIGN_UP_PAGE} element={<SignUpPage />} />
        <Route path={AppRoutes.SCHEDULE_PAGE} element={<SchedulePage />} />
        <Route path={AppRoutes.RESERVATION_PAGE} element={<ReservationPage />} />
      </Routes>
    </>
  );
};

export default MyRoute;
