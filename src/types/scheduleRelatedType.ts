export type Seat = {
  seatId: number;
  seatNumber: string;
  rowNo: number;
  colNo: number;
  status: string;
  theater: string;
};


//used in ScheduleSelectArea.tsx
export type FullSchedule = {
  date: string;
  schedules: fullScheduleProps[];
};
export type fullScheduleProps = {
  movieId: number;
  movieName: string;
  durationMinutes: number;
  grade: string;
  theaters: TheaterInSchedule[];
};
export type TheaterInSchedule = {
  theaterId: string;
  theaterName: string;
  format: string;
  subDub: string;
  availSeat: number;
  totalSeat: number;
  startTimes: string[];
  endTimes: string[];
  scheduleIds: number[];
};
export type PosterInfoProps = {
  movieId: number;
  movieName: string;
  rating: number;
  star: number | null;
  image: string;
  grade: string;
  isReservable: boolean;
  rank: number | null;
};


//--------------------------- Admin의 SCHEDULE 관리
// ScheduleManage.tsx
export type ScheduleForRegister = {
  movieId: number;
  theaters: TheaterInSchedule[];
};
export type RegisterSchedule = {
  date: string;
  schedules: ScheduleForRegister[];
};

export type RealMovie = {
  actors?: string[];
  director?: string;
  formats?: string[];
  genreIds?: number[];
  genreNames?: string[];
  grade: string;
  movieId: number;
  posterPath: string;
  releaseDate?: string;
  runningTime?: number;
  title: string;
  rating: number;
  star: number | null;
  isReservable: boolean;
  rank: number | null;
};

export type CertainMovie = {
  format: string;
  movieTitle: string;
  scheduleIds: number;
  startTime: string;
  subDub: string;
  theaterName: string;
}

//--------------------------- Admin의 THEATER 관리
// TheaterManage.tsx
export type TheaterForRegister = {
  theaterId: string;
  theaterName: string;
  totalSeats: number;
  format: string;
  price: number;
  seats: Seat[];
};
