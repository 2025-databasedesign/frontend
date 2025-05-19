import React from "react";
import { Routes, Route } from "react-router-dom";
import { AppRoutes } from "./AppRoutes";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import SignUpPage from "../pages/SignUpPage";
import MovieListPage from "../pages/MovieListPage";
import MovieDetailPage from "../pages/MovieDetailPage";
import SchedulePage from "../pages/SchedulePage";

const MyRoute: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path={AppRoutes.HOME} element={<HomePage />} />
        <Route path={AppRoutes.LOGIN_PAGE} element={<LoginPage />} />
        <Route path={AppRoutes.SIGN_UP_PAGE} element={<SignUpPage />} />
        <Route path={AppRoutes.MOVIELIST_PAGE} element={<MovieListPage />} />
        <Route path={AppRoutes.MOVIEDETAIL_PAGE} element={<MovieDetailPage />} />
        <Route path={AppRoutes.SCHEDULE_PAGE} element={<SchedulePage />} />
      </Routes>
    </>
  );
};

export default MyRoute;
