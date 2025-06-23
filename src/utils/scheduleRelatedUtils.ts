export const getTheatersInfo = async () => {
  try {
    const response = await fetch("/src/assets/theater_info/mock_theater.json");
    if (!response.ok) {
      throw new Error("Failed to fetch theater's info");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("error: ", error);
  }
};

export const getMovieInfo = async () => {
  try {
    const response = await fetch("/src/assets/cinema_info/mock_cinema.json");
    if (!response.ok) {
      throw new Error("Failed to fetch theater's info");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("error: ", error);
  }
};

export const getfullSchedule = async () => {
  try {
    const response = await fetch("/src/assets/schedule/mock_schedule.json");
    if (!response.ok) {
      throw new Error("Failed to fetch schedule");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("error: ", error);
  }
};

//will be deleted later when fetch with real api
export const mockDates = [
  { date: "2025-06-11" },
  { date: "2025-06-12" },
  { date: "2025-06-13" },
  { date: "2025-06-14" },
  { date: "2025-06-15" },
  { date: "2025-06-16" },
  { date: "2025-06-17" },
  { date: "2025-06-18" },
  { date: "2025-06-19" },
  { date: "2025-06-20" },
  { date: "2025-06-21" },
  { date: "2025-06-22" },
  { date: "2025-06-23" },
  { date: "2025-06-24" },
  { date: "2025-06-25" },
  { date: "2025-06-26" },
  { date: "2025-06-27" },
  { date: "2025-06-28" },
  { date: "2025-06-29" },
  { date: "2025-06-30" },
  { date: "2025-07-01" },
  { date: "2025-07-02" },
  { date: "2025-07-03" },
  { date: "2025-07-04" },
  { date: "2025-07-05" },
];
//will be deleted later when fetch with real api
export const mockDateList = mockDates.map((entry) => {
  const dateObj = new Date(entry.date);
  return {
    date: entry.date,
    day: dateObj.getDate(),
    month: dateObj.getMonth() + 1,
    weekday: dateObj.toLocaleDateString("ko-KR", { weekday: "short" }), // "토", "일", ...
  };
});

//get days' info from today to 'count' days later, getDaysWithWeekday(20): get 20 days' info from today
export function getDaysWithWeekday(
  count: number
): { day: number; weekday: string; month: number }[] {
  const today = new Date();
  const result = [];

  for (let i = 0; i <= count; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const day = date.getDate();
    const month = date.getMonth() + 1; // getMonth() is 0-based (0 = Jan, so add 1)
    const weekday = date.toLocaleDateString("ko-KR", { weekday: "short" });

    result.push({ day, weekday, month });
  }
  return result;
}

export function getWeekday(dateStr: string) {
  const date = new Date(dateStr);
  const weekday = date.toLocaleDateString("ko-KR", { weekday: "short" });
  return weekday;
}

export function getMonthAndDay(dateStr: string) {
  const date = new Date(dateStr);

  const month = String(date.getMonth() + 1).padStart(2, "0"); // "06"
  const day = String(date.getDate()).padStart(2, "0"); // "03"
  return `${month}/${day}`;
}

export function getTodayDay() {
  const today = new Date().toISOString().split('T')[0];
  return today;
}

export const extractGradeValue = (grade: string | undefined | null): string => {
  const matched = grade?.match(/\d+/)?.[0];
  return matched || "all";
};
