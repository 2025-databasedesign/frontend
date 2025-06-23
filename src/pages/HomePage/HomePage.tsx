import React, { useEffect, useRef, useState } from "react";
import "./HomePage.css";
import leftArrow from "../../assets/image/arrow_left_white.png";
import rightArrow from "../../assets/image/arrow_right_white.png";
import { PosterInfoProps } from "../../types/scheduleRelatedType";
import Navbar from "../../components/Navbar";
import PosterInfo from "../../components/PosterInfo";
// import { useCinemaRelatedStore } from "../../stores/CinemaRelatedStore";

const HomePage: React.FC = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0); //X position where the user first started dragging.
  const startScrollLeft = useRef(0); //scroll position (how far slider was scrolled) when the user started dragging.
  const [movieInfo, setMovieInfo] = useState<PosterInfoProps[]>([]);
  // ------------------------- Access store
  // const movieList = useCinemaRelatedStore(
  //   (state) => state.movieList
  // );
  // const setMovieList = useCinemaRelatedStore(
  //   (state) => state.setMovieList
  // );
  // const setTheaterList = useCinemaRelatedStore(
  //   (state) => state.setTheaterList
  // );
  // ------------------------- Access store

  /////fetch mock movie's info
  // const getMovieInfo = async () => {
  //   try {
  //     const response = await fetch("/src/assets/cinema_info/mock_cinema.json");
  //     if (!response.ok) {
  //       throw new Error("Failed to fetch cinema's info");
  //     }
  //     const data = await response.json();
  //     setMovieInfo(data);
  //     return data;
  //   } catch (error) {
  //     console.log("error: ", error);
  //   }
  // };

  // const getUserInfo = async () => {
  //   try {
  //     const response = await fetch("http://54.180.117.246/api/users/")
  //   }
  // }

  // useEffect(() => {
  //   getMovieInfo();
  // }, []);

  //real API
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("http://54.180.117.246/api/movies");
        if (!response.ok) {
          throw new Error("Failed to fetch movies info");
        }
        const result = await response.json();
        if (result?.result && Array.isArray(result.data)) {
            // Fetch star ratings for each movie
            // Fetch revenue data first
            const revenueRes = await fetch("http://54.180.117.246/api/revenue/movie");
            let revenueData: Record<string, number> = {};
            if (revenueRes.ok) {
            const revenueJson = await revenueRes.json();
            if (revenueJson?.result && revenueJson.data) {
              revenueData = revenueJson.data;
            }
            }

            const mapped = await Promise.all(
            result.data.map(async (item: any) => {
              let star = null;
              let rating = null;
              try {
              const reviewRes = await fetch(
                `http://54.180.117.246/api/reviews?type=MOVIE&targetId=${item.movieId}`
              );
              if (reviewRes.ok) {
                const reviewData = await reviewRes.json();
                if (
                Array.isArray(reviewData.data) &&
                reviewData.data.length > 0
                ) {
                // Calculate average rating
                const ratings = reviewData.data.map((r: any) => r.rating);
                const avg =
                  ratings.reduce(
                  (sum: number, cur: number) => sum + cur,
                  0
                  ) / ratings.length;
                star = avg;
                }
              }
              } catch (e) {
              // ignore error, star remains null
              }

              // Calculate 예매수 (rating) from revenue API
              const revenue = revenueData[item.title] || 0;
              rating = Math.ceil(revenue / 15000);

              return {
                movieId: item.movieId,
                movieName: item.title,
                rating,
                star,
                image: item.posterPath
                  ? `http://54.180.117.246${item.posterPath.replace(
                      /^\/images\/posters\//,
                      "/Images/"
                    )}`
                  : "",
                grade:
                  item.grade === "15"
                    ? "/src/assets/grade_15.png"
                    : item.grade === "19"
                    ? "/src/assets/grade_19.png"
                    : "/src/assets/grade_all.png",
                isReservable: true,
                // rank: reviewData.data.length, // 예매수로 변경
                releaseDate: item.releaseDate,
                runningTime: item.runningTime,
                director: item.director,
                actors: item.actors,
                formats: item.formats,
                genreIds: item.genreIds,
                genreNames: item.genreNames,
              };
            })
          );
          setMovieInfo(mapped);
        }
      } catch (error) {
        console.log("error: ", error);
      }
    };
    fetchMovies();
  }, []);

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
      <div className="home-page-main">
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
                  movieId={movie.movieId}
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
    </div>
  );
};

export default HomePage;
