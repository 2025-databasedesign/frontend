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
        <li>
          <a className="middle-navigation" onClick={() => navigate(AppRoutes.MOVIELIST_PAGE)}>영화</a>
        </li>
        <li>
          <a className="middle-navigation" onClick={() => navigate(AppRoutes.SCHEDULE_PAGE)}>예매</a>
        </li>
        <li>
          <a className="middle-navigation">상영관</a>
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
