import React, { useEffect } from "react";
import './AdminPage.css'
import { AppRoutes } from "../../routes/AppRoutes";
import { useNavigate } from "react-router-dom";
import { useAdminStore } from "../../stores/AdminStore";
import logoImage from "../../assets/image/logo-transparent-bg1.png";
import Dashboard from "../../components/AdminRelated/Dashboard";
import MovieManage from "../../components/AdminRelated/MovieManage";
import TheaterManage from "../../components/AdminRelated/TheaterManage";
import UserManage from "../../components/AdminRelated/UserManage";

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const viewType = useAdminStore((state) => state.viewType);
  const setViewType = useAdminStore((state) => state.setViewType);

  useEffect(() => {
    setViewType("dashboard");
  }, [setViewType])

  return (
    <div className="sales-page">
      <div className="side-bar">
        <span className="logo-wrapper">
          <img
            src={logoImage}
            alt="cinema logo"
            onClick={() => navigate(AppRoutes.HOME)}
            className="logo"
          />
        </span>
        <ul>
          <li onClick={() => navigate(AppRoutes.HOME)}>HOME</li>
          <li
            className={`${viewType == "dashboard" ? "selected-tab" : ""}`}
            onClick={() => setViewType("dashboard")}
          >
            DASHBOARD
          </li>
          <li
            className={`${viewType == "movie-manage" ? "selected-tab" : ""}`}
            onClick={() => setViewType("movie-manage")}
          >
            MOVIE
          </li>
          <li
            className={`${viewType == "theater-manage" ? "selected-tab" : ""}`}
            onClick={() => setViewType("theater-manage")}
          >
            THEATER
          </li>
          <li
            className={`${viewType == "user-manage" ? "selected-tab" : ""}`}
            onClick={() => setViewType("user-manage")}
          >
            USER
          </li>
        </ul>
      </div>
      <div className="sales-page-main">
        {viewType == "dashboard" && <Dashboard />}
        {viewType == "movie-manage" && <MovieManage />}
        {viewType == "theater-manage" && <TheaterManage />}
        {viewType == "user-manage" && <UserManage />}
      </div>
    </div>
  );
};

export default AdminPage;
