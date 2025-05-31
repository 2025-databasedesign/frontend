import { PeopleCount } from "../stores/ScheduleRelatedStore";

export const EMPTY_PEOPLE_COUNT = {
  adult: 0,
  teen: 0,
  senior: 0,
  kid: 0,
  disabled: 0,
};

export const PEOPLE_LABELS: Record<keyof PeopleCount, string> = {
  adult: "성인",
  teen: "청소년",
  senior: "경로",
  kid: "어린이",
  disabled: "장애인",
};

// 티켓 가격 정의
export const TICKET_PRICES: Record<keyof PeopleCount, number> = {
  adult: 15000,
  teen: 10000,
  senior: 8000,
  kid: 7000,
  disabled: 6000,
};