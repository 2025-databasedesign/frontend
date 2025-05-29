import React from "react";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../routes/AppRoutes";
import "./Navbar.css";
import logoImage from '../assets/image/logo-transparent-bg.png'

const Navbar: React.FC = () => {
  const navigate = useNavigate();
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
            <span className="span-nav-content" onClick={() => navigate(AppRoutes.MOVIELIST_PAGE)}>영화</span>
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
          <div className="middle-navigation" onClick={() => navigate(AppRoutes.THEATERLIST_PAGE)}>
            <span className="span-nav-content">상영관</span>
          </div>
        </li>
      </ul>
      <ul>
        <li>
          <button onClick={() => navigate(AppRoutes.LOGIN_PAGE)}>로그인</button>
        </li>
        <li>
          <button>사용자 정보</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
