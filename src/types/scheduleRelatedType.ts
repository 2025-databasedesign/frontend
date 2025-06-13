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
  subDub: string | null;
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


