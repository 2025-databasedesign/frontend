import React from "react";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../routes/AppRoutes";
import "./Navbar.css";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  return (
    <nav className="nav-bar container">
      <img
        src="/src/assets/logo-transparent-bg.png"
        alt="cinema logo"
        onClick={() => navigate(AppRoutes.HOME)}
        className="logo"
      />
      <ul className="center-menu">
        <li className="li-center-menu">
          <a className="middle-navigation">
            <span className="span-nav-content">영화</span>
            <ul className="sub-tab">
              <li className="li-sub-tab">
                <a className="sub-tab-navigation">영화A(temp)</a>
              </li>
              <li className="li-sub-tab">
                <a className="sub-tab-navigation">영화B(temp)</a>
              </li>
            </ul>
          </a>
        </li>
        <li className="li-center-menu">
          <a className="middle-navigation">
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
          </a>
        </li>
        <li className="li-center-menu">
          <a className="middle-navigation">
            <span className="span-nav-content">상영관</span>
          </a>
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
