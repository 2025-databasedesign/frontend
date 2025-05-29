import React from "react";
import { Routes, Route } from "react-router-dom";
import { AppRoutes } from "./AppRoutes";
import LoginPage from "../pages/LoginPage";
import SignUpPage from "../pages/SignUpPage";
import MovieListPage from "../pages/MovieListPage";
import MovieDetailPage from "../pages/MovieDetailPage";
import TheaterListPage from "../pages/TheaterListPage";
import SchedulePage from "../pages/SchedulePage/SchedulePage";
import ReservationPage from "../pages/ReservationPage/ReservationPage";
import SeatSelectionPage from "../pages/SeatSelectionPage/SeatSelectionPage";
import PaymentPage from "../pages/PaymentPage/PaymentPage";
import HomePage from "../pages/HomePage/HomePage";

const MyRoute: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path={AppRoutes.HOME} element={<HomePage />} />
        <Route path={AppRoutes.LOGIN_PAGE} element={<LoginPage />} />
        <Route path={AppRoutes.SIGN_UP_PAGE} element={<SignUpPage />} />
        <Route path={AppRoutes.MOVIELIST_PAGE} element={<MovieListPage />} />
        <Route
          path={AppRoutes.MOVIEDETAIL_PAGE}
          element={<MovieDetailPage />}
        />
        <Route
          path={AppRoutes.THEATERLIST_PAGE}
          element={<TheaterListPage />}
        />
        <Route path={AppRoutes.SCHEDULE_PAGE} element={<SchedulePage />} />
        <Route
          path={AppRoutes.RESERVATION_PAGE}
          element={<ReservationPage />}
        />
        <Route path={AppRoutes.SEAT_SELECTION_PAGE} element={<SeatSelectionPage />} />
        <Route path={AppRoutes.PAYMENT_PAGE} element={<PaymentPage />} />
      </Routes>
    </>
  );
};

export default MyRoute;
