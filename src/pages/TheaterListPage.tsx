import { useState } from "react";
import Navbar from "../components/Navbar";
import TheaterListHeader from "../components/TheaterList/TheaterListHeader";
import "./TheaterListPage.css";

export default function TheaterListPage() {
  return (
    <div>
      <div className="navbar-wrapper">
        <Navbar />
      </div>
      <div className="movie-list-page__container">
        <TheaterListHeader />
      </div>
    </div>
  );
}
