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
};
export type PosterInfoProps = {
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