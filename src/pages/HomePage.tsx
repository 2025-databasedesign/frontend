import React, { useRef } from "react";
import Navbar from "../components/Navbar";
import PosterInfo from "../components/PosterInfo";
import "./HomePage.css";

const HomePage: React.FC = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0); //X position where the user first started dragging.
  const startScrollLeft = useRef(0); //scroll position (how far slider was scrolled) when the user started dragging.

  //////////////////////////// Handle slider's button click
  function handleNext() {
    const slider = sliderRef.current;
    if (!slider) return;

    const widthItem = slider.querySelector(".item-container")?.clientWidth || 0;
    //check if we are at the end
    if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth) { //if at the end, go to the first item in the slider
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
    if (slider.scrollLeft <= 20) {  //if at the start, go to the last item in the slider ; 20: because sometimes there’s a slight margin.
      slider.scrollLeft = (widthItem + 20) * (totalItems - 1);  //jump to the last item, 20 is margin
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
      (e.type === "touchstart"
        ? (e as React.TouchEvent).touches[0].pageX
        : (e as React.MouseEvent).pageX);
        startScrollLeft.current = sliderRef.current.scrollLeft;
  }

  function handleDragMove(
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) {
    if (!isDragging.current || !sliderRef.current) return;
    e.preventDefault(); // prevent highlighting text while dragging
    const x =
      (e.type === "touchmove"
        ? (e as React.TouchEvent).touches[0].pageX
        : (e as React.MouseEvent).pageX);
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
      <div className="slider-container">
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
            <div className="item-container">
              <PosterInfo
                movieName="거룩한 밤: 데몬 헌텃스 1"
                rating={26.7}
                star="8"
                image="/src/assets/movie1.jpg"
                grade="/src/assets/grade_15.png"
                isReservable={true}
                rank={1}
              />
            </div>
            <div className="item-container">
              <PosterInfo
                movieName="거룩한 밤: 데몬 헌텃스 2"
                rating={25.7}
                star="8"
                image="/src/assets/movie1.jpg"
                grade="/src/assets/grade_15.png"
                isReservable={true}
                rank={2}
              />
            </div>
            <div className="item-container">
              <PosterInfo
                movieName="거룩한 밤: 데몬 헌텃스 3"
                rating={24.7}
                star="8"
                image="/src/assets/movie1.jpg"
                grade="/src/assets/grade_15.png"
                isReservable={true}
                rank={3}
              />
            </div>
            <div className="item-container">
              <PosterInfo
                movieName="거룩한 밤: 데몬 헌텃스 4"
                rating={23.7}
                star="8"
                image="/src/assets/movie1.jpg"
                grade="/src/assets/grade_15.png"
                isReservable={true}
                rank={4}
              />
            </div>
            <div className="item-container">
              <PosterInfo
                movieName="거룩한 밤: 데몬 헌텃스 5"
                rating={22.7}
                star="8"
                image="/src/assets/movie1.jpg"
                grade="/src/assets/grade_15.png"
                isReservable={false}
                rank={5}
              />
            </div>
            <div className="item-container">
              <PosterInfo
                movieName="거룩한 밤: 데몬 헌텃스 6"
                rating={21.7}
                star="8"
                image="/src/assets/movie1.jpg"
                grade="/src/assets/grade_15.png"
                isReservable={true}
                rank={6}
              />
            </div>
            <div className="item-container">
              <PosterInfo
                movieName="거룩한 밤: 데몬 헌텃스 7"
                rating={20.7}
                star="8"
                image="/src/assets/movie1.jpg"
                grade="/src/assets/grade_15.png"
                isReservable={false}
                rank={7}
              />
            </div>
            <div className="item-container">
              <PosterInfo
                movieName="거룩한 밤: 데몬 헌텃스 8"
                rating={21.7}
                star="8"
                image="/src/assets/movie1.jpg"
                grade="/src/assets/grade_15.png"
                isReservable={false}
                rank={null}
              />
            </div>
            <div className="item-container">
              <PosterInfo
                movieName="거룩한 밤: 데몬 헌텃스 9"
                rating={22.7}
                star="8"
                image="/src/assets/movie1.jpg"
                grade="/src/assets/grade_15.png"
                isReservable={false}
                rank={null}
              />
            </div>
            <div className="item-container">
              <PosterInfo
                movieName="거룩한 밤: 데몬 헌텃스 10"
                rating={21.7}
                star="8"
                image="/src/assets/movie1.jpg"
                grade="/src/assets/grade_15.png"
                isReservable={false}
                rank={null}
              />
            </div>
          </div>
        </div>
        <div className="arrows-area">
          <div className="left-arrow" onClick={handlePrev}>
            <img src="/src/assets/arrow_left_white.png" alt="left arrow" />
          </div>
          <div className="right-arrow" onClick={handleNext}>
            <img src="/src/assets/arrow_right_white.png" alt="right arrow" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
