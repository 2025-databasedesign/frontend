import React from "react";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../routes/AppRoutes";
import "./Navbar.css";
import logoImage from "../assets/image/logo-transparent-bg.png";
import { isTokenValid, logout } from "../utils/authUtils";
import { useScheduleRelatedStore } from "../stores/ScheduleRelatedStore";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  function handleLogout() {
    // Clear token from localStorage
    logout();
    // Reset Zustand booking state (in memory)
    useScheduleRelatedStore.getState().resetState();

    alert("로그아웃되었습니다.");
    navigate(AppRoutes.HOME);
  }

  return (
    <nav className="nav-bar container">
      <img
        src={logoImage}
        alt="cinema logo"
        onClick={() => navigate(AppRoutes.HOME)}
        className="logo"
      />
      <ul className="center-menu">
        <li className="li-center-menu">
          <div className="middle-navigation">
            <span
              className="span-nav-content"
              onClick={() => navigate(AppRoutes.MOVIELIST_PAGE)}
            >
              영화
            </span>
          </div>
        </li>
        <li className="li-center-menu">
          <div className="middle-navigation">
            <span className="span-nav-content">예매</span>
            <ul className="sub-tab">
              <li className="li-sub-tab">
                <a
                  className="sub-tab-navigation"
                  onClick={() => navigate(AppRoutes.RESERVATION_PAGE)}
                >
                  빠른예매
                </a>
              </li>
              <li className="li-sub-tab">
                <a
                  className="sub-tab-navigation"
                  onClick={() => navigate(AppRoutes.SCHEDULE_PAGE)}
                >
                  상영일정
                </a>
              </li>
            </ul>
          </div>
        </li>
        <li className="li-center-menu">
          <div
            className="middle-navigation"
            onClick={() => navigate(AppRoutes.THEATERLIST_PAGE)}
          >
            <span className="span-nav-content">상영관</span>
          </div>
        </li>
      </ul>
      <ul>
        {isTokenValid() ? (
          <>
            <li>
              <button onClick={handleLogout}>로그아웃</button>
            </li>
            <li>
              <button onClick={() => navigate(AppRoutes.MY_PAGE)} className="my-button">
                {/* 마이 */}
                <img src="/src/assets/image/my-icon.png" alt="my page" className="my-icon"/>
              </button>
            </li>
          </>
        ) : (
          <li>
            <button onClick={() => navigate(AppRoutes.LOGIN_PAGE)}>
              로그인
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
