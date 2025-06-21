export type MovieInfo = {
  title: string;
  runningTime: string;
  releaseDate: string;
  director: string;
  actors: string[];
  grade: string;
  formats: string[];
  genreNames: string[];
};

export type BannedListType = {
  id: number;
  name: string;
  email: string;
  password: string;
  gender: string;
  birthDate: string;
  phone: string;
  money: number;
  status: string;
};
