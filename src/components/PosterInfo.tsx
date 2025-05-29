import React from "react";
import { useNavigate } from "react-router-dom";
import "./PosterInfo.css";
import { PosterInfoProps } from "../types/ScheduleRelatedType";
// import Grade from "./Grade/Grade";

// const parseGradeNumber = (gradePath: string) => {
//   const match = gradePath.match(/grade_(\d+)\.png$/);
//   return match ? match[1] : "등급 정보 없음";
// };

const PosterInfo: React.FC<PosterInfoProps> = ({
  movieName,
  rating,
  star,
  image,
  grade,
  isReservable,
  rank,
}) => {
  const navigate = useNavigate();

  const handleDetailClick = () => {
    const encodedName = encodeURIComponent(movieName); // URL에 안전하게 포함되도록 인코딩
    navigate(`/movies/${encodedName}`);
  };

  return (
    <div className="item">
      <div className="top-info">
        <span className="poster-info">
          <img src={image} alt={movieName} />
        </span>
        <span className="rank">{rank}</span>
        <div className="over-box">
          {isReservable && <button className="outline">예매하기</button>}
          <button className="outline" onClick={handleDetailClick}>
            상세정보
          </button>
        </div>
      </div>
      <div className="bottom-info">
        <div className="title-info">
          {/* <Grade grade={parseGradeNumber(grade)} /> */}
          <img src={grade} />
          {movieName}
        </div>
        <div className="sub-info">
          <span className="rate-info">
            예매율 <span className="rate-percentage">{rating}%</span>
          </span>
          <span className="star-info">
            <img src="/src/assets/star.png" alt="star icon" />
            {star}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PosterInfo;
