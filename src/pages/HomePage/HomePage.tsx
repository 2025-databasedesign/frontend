import React, { useEffect, useRef, useState } from "react";
import "./HomePage.css";
import leftArrow from "../../assets/image/arrow_left_white.png";
import rightArrow from "../../assets/image/arrow_right_white.png";
import { PosterInfoProps } from "../../types/ScheduleRelatedType";
import Navbar from "../../components/Navbar";
import PosterInfo from "../../components/PosterInfo";
// import { useCinemaRelatedStore } from "../../stores/CinemaRelatedStore";

const HomePage: React.FC = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0); //X position where the user first started dragging.
  const startScrollLeft = useRef(0); //scroll position (how far slider was scrolled) when the user started dragging.
  // const { movieList, setMovieList, setTheaterList } = useCinemaRelatedStore();
  const [movieInfo, setMovieInfo] = useState<PosterInfoProps[]>([]);

  /////fetch mock movie's info
  const getMovieInfo = async () => {
    try {
      const response = await fetch("/src/assets/cinema_info/mock_cinema.json");
      if (!response.ok) {
        throw new Error("Failed to fetch cinema's info");
      }
      const data = await response.json();
      setMovieInfo(data);
      return data;
    } catch (error) {
      console.log("error: ", error);
    }
  };

  useEffect(() => {
    getMovieInfo();
  }, []);

  //real API
  // useEffect(() => {
  //   const fetchAll = async () => {
  //     try {
  //       const [moviesRes, theatersRes, ] = await Promise.all([
  //         fetch("http://54.180.117.246/api/movies"),
  //         fetch("http://54.180.117.246/api/theaters"),
  //       ]);

  //       const [movies, theaters] = await Promise.all([
  //         moviesRes.json(),
  //         theatersRes.json(),
  //       ]);

  //       setMovieList(movies.data);
  //       setTheaterList(theaters.data);
  //     } catch (err) {
  //       console.error("Error fetching data:", err);
  //     }
  //   };
  //   fetchAll();
  // }, [setMovieList, setTheaterList]);

  //////////////////////////// Handle slider's button click
  function handleNext() {
    const slider = sliderRef.current;
    if (!slider) return;

    const widthItem = slider.querySelector(".item-container")?.clientWidth || 0;
    //check if we are at the end
    if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth) {
      //if at the end, go to the first item in the slider
      slider.scrollLeft = 0;
    } else {
      slider.scrollLeft += widthItem + 20; //20px is margin
    }
  }

  function handlePrev() {
    const slider = sliderRef.current;
    if (!slider) return;

    const widthItem = slider.querySelector(".item-container")?.clientWidth || 0;
    const totalItems = slider.querySelectorAll(".item-container").length;
    //check if we are at the start
    if (slider.scrollLeft <= 20) {
      //if at the start, go to the last item in the slider ; 20: because sometimes there’s a slight margin.
      slider.scrollLeft = (widthItem + 20) * (totalItems - 1); //jump to the last item, 20 is margin
    } else {
      slider.scrollLeft -= widthItem + 20; //20px is margin
    }
  }

  //////////////////////////// Dragging on Mouse event or Touch event
  function handleDragStart(
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) {
    if (!sliderRef.current) return;
    isDragging.current = true;
    startX.current =
      e.type === "touchstart"
        ? (e as React.TouchEvent).touches[0].pageX
        : (e as React.MouseEvent).pageX;
    startScrollLeft.current = sliderRef.current.scrollLeft;
  }

  function handleDragMove(
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) {
    if (!isDragging.current || !sliderRef.current) return;
    e.preventDefault(); // prevent highlighting text while dragging
    const x =
      e.type === "touchmove"
        ? (e as React.TouchEvent).touches[0].pageX
        : (e as React.MouseEvent).pageX;
    const walk = (x - startX.current) * 1; // walk>0:user drags to the right, <0: drags to the left ; 1: speed multiplier
    sliderRef.current.scrollLeft = startScrollLeft.current - walk;
  }

  function handleDragEnd() {
    isDragging.current = false;
  }

  return (
    <div>
      <div className="navbar-wrapper">
        <Navbar />
      </div>
      <div
        className="slider"
        ref={sliderRef}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        <div className="posters-area">
          {/* {movieList.map((movie, index) => ( */}
          {movieInfo.map((movie, index) => (
            <div className="item-container" key={index}>
              <PosterInfo
                movieName={movie.movieName}
                rating={movie.rating}
                star={movie.star}
                image={movie.image}
                grade={movie.grade}
                isReservable={movie.isReservable}
                rank={movie.rank}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="arrows-area">
        <div className="left-arrow" onClick={handlePrev}>
          <img src={leftArrow} alt="left arrow" />
        </div>
        <div className="right-arrow" onClick={handleNext}>
          <img src={rightArrow} alt="right arrow" />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
