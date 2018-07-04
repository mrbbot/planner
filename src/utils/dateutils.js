export const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

export const longDayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

export const shortDayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function dateEqual(a, b) {
  return (
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  );
}

export function formatDate(v, addFullDate = true) {
  if (v === "") return "";

  const date = new Date(v);

  const day = date.getDate();
  const monthIndex = date.getMonth();

  const today = new Date();
  const tomorrow = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1
  );
  const yesterday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 1
  );

  let dayName = "";
  let addDayName = false;

  if (dateEqual(today, date)) {
    dayName = "Today";
    addDayName = true;
  } else if (dateEqual(tomorrow, date)) {
    dayName = "Tomorrow";
    addDayName = true;
  } else if (dateEqual(yesterday, date)) {
    dayName = "Yesterday";
    addDayName = true;
  } else {
    dayName = longDayNames[date.getDay()];
  }

  return (
    dayName +
    (addFullDate
      ? " <span class='light'>" +
        (addDayName ? shortDayNames[date.getDay()] + " " : "") +
        day +
        " " +
        monthNames[monthIndex] +
        "</span>"
      : "")
  );
}

export function getCurrentDate() {
  const now = new Date();

  let month = now.getMonth();
  month++;
  if (month < 10) month = "0" + month;

  let date = now.getDate();
  if (date < 10) date = "0" + date;

  return now.getFullYear() + "-" + month + "-" + date;
}
