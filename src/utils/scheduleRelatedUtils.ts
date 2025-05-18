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
  { date: "2025-05-17" },
  { date: "2025-05-18" },
  { date: "2025-05-19" },
  { date: "2025-05-20" },
  { date: "2025-05-21" },
  { date: "2025-05-22" },
  { date: "2025-05-23" },
  { date: "2025-05-24" },
  { date: "2025-05-25" },
  { date: "2025-05-26" },
  { date: "2025-05-27" },
  { date: "2025-05-28" },
  { date: "2025-05-29" },
  { date: "2025-05-30" },
  { date: "2025-05-31" },
  { date: "2025-06-01" },
  { date: "2025-06-02" },
  { date: "2025-06-03" },
  { date: "2025-06-04" },
  { date: "2025-06-05" },
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
