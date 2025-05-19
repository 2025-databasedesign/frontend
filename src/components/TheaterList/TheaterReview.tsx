import React from "react";
import "./TheaterReview.css";

interface TheaterReviewProps {
  Reviews: string[];
}

const TheaterReview: React.FC<TheaterReviewProps> = ({ Reviews }) => {
  return (
    <div className="theater-layout">
      <div className="reviews right">
        {Reviews.map((content, i) => (
          <div key={i} className="review">
            <div className="review-header">
              <span className="nickname">익명 관람객</span>
              <span className="rating">⭐ 4.5</span>
            </div>
            <div className="date">2025-05-18</div>
            <div className="content">{content}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TheaterReview;
