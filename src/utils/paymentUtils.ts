import { PeopleCount } from "../stores/ScheduleRelatedStore";
import { PEOPLE_LABELS, TICKET_PRICES } from "./constant";

// "성인 1, 청소년 2"처럼 표시하는 문자열 생성
export const getPeopleDisplay = (people: PeopleCount): string => {
  return Object.entries(people)
    .filter(([, count]) => count > 0)
    .map(
      ([key, count]) => `${PEOPLE_LABELS[key as keyof PeopleCount]} ${count}`
    )
    .join(", ");
};

// A2, B3 형태로 좌석 표시 문자열 생성
export const getSeatDisplay = (seats: number[][]): string => {
  const getRowLabel = (row: number) => String.fromCharCode(64 + row); // 1 -> A, 2 -> B ...

  return [...seats]
    .sort((a, b) => a[0] - b[0] || a[1] - b[1]) // sort by row, then col
    .map(([row, col]) => `${getRowLabel(row)}${col}`)
    .join(", ");
};

export const getSeatSeparately= (seats: number[][]): string[] => {
  const getRowLabel = (row: number) => String.fromCharCode(64 + row); // 1 -> A, 2 -> B ...

    return [...seats]
    .sort((a, b) => a[0] - b[0] || a[1] - b[1]) // sort by row, then col
    .map(([row, col]) => `${getRowLabel(row)}${col}`);
};

// 각 인원별 가격 리스트 계산
export const getPeoplePrices = (people: PeopleCount) => {
  return Object.entries(people)
    .filter(([, count]) => count > 0)
    .map(([key, count]) => ({
      label: `${PEOPLE_LABELS[key as keyof PeopleCount]} ${count}`,
      price: TICKET_PRICES[key as keyof PeopleCount] * count,
    }));
};

// 총 금액 계산
export const getTotalPrice = (people: PeopleCount): number => {
  const prices = getPeoplePrices(people);
  return prices.reduce((sum, p) => sum + p.price, 0);
};

export const getPaymentMethod = (method:string | null) => {
  if(method == "card") {
    return "신용/체크카드";
  } else if(method == "easy") {
    return "간편결제";
  } else if(method == "phone") {
    return "휴대폰 결제";
  } else {
    return "알 수 없음";
  }
}