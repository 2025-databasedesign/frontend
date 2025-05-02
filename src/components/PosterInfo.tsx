import React from 'react'
import './PosterInfo.css'

type PosterInfoProps = {
  movieName: string;
  rating: number;
  star: string;
  image: string;
  grade: string;
  isReservable: boolean;
  rank: number | null;
};

const PosterInfo:React.FC<PosterInfoProps> = ({movieName, rating, star, image, grade, isReservable, rank}) => {
  return (
    <div className='item'>
      <div className="top-info">
        <span className="poster-info">
          <img src={image} alt={movieName} />
        </span>
        <span className='rank'>{rank}</span>
        <div className="over-box">
          {isReservable && 
            <button className='outline'>예매하기</button>
          }
          <button className='outline'>상세정보</button>
        </div>
      </div>
      <div className="bottom-info">
        <div className="title-info">
          <img src={grade} />
          {movieName}
        </div>
        <div className="sub-info">
          <span className="rate-info">예매율 <span className='rate-percentage'>{rating}%</span></span>
          <span className="star-info"><img src="/src/assets/star.png" alt="star icon" />{star}</span>
        </div>
      </div>
    </div>
  )
}

export default PosterInfo
