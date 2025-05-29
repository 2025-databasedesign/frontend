import React from "react";
import "./Grade.css";

type GradeType = { grade: string };

const Grade: React.FC<GradeType> = ({ grade }) => {
  
  function getGradeClass() {
    switch (grade) {
      case "19":
        return "grade-19";
      case "15":
        return "grade-15";
      case "12":
        return "grade-12";
      case "ALL":
        return "grade-all";
      default:
        return "grade-default";
    }
  }
  return (
    <div className={`grade-badge ${getGradeClass()}`}>{grade}</div>
  );
};

export default Grade;
