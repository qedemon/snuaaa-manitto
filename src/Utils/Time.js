const DATE_TIMESTAMP_LIST = [
  "2024-02-02",
  "2024-02-03",
  "2024-02-04",
  "2024-02-05",
];
const TIME_TIMESTAMP_LIST = [
  "T09:00:00.000+09:00",
  "T12:00:00.000+09:00",
  "T18:00:00.000+09:00",
];

const DATE_LIST = ["1일차", "2일차", "3일차", "4일차"];
const TIME_LIST = ["아침", "점심", "저녁"];

export function getDateTimeStamp(idx) {
  return DATE_TIMESTAMP_LIST[idx] ?? DATE_TIMESTAMP_LIST;
}

export function getTimeTimeStamp(idx) {
  return TIME_TIMESTAMP_LIST[idx] ?? TIME_TIMESTAMP_LIST;
}

export function getDateList(start, end) {
  return DATE_LIST.slice(start, end);
}

export function getTimeList(start, end) {
  return TIME_LIST.slice(start, end);
}

export function timeToText(time) {
  const current = new Date(time);

  const currentDateIndex = DATE_TIMESTAMP_LIST.findLastIndex((val) => {
    const pivotDate = new Date(val + "T00:00:00.000Z");
    return current >= pivotDate;
  });
  const currentDate = DATE_LIST[currentDateIndex] ?? DATE_LIST[0];

  const currentTimeIndex = TIME_TIMESTAMP_LIST.findLastIndex((val) => {
    const time = Number(val.slice(1, 3));
    return current.getUTCHours() >= time;
  });
  const currentTime = TIME_LIST[currentTimeIndex] ?? TIME_LIST[0];

  return currentDate + " " + currentTime;
}

export function indexToTime(dateIndex, timeIndex) {
  return new Date(
    DATE_TIMESTAMP_LIST[dateIndex] + TIME_TIMESTAMP_LIST[timeIndex]
  );
}

export function indexToText(dateIndex, timeIndex) {
  return timeToText(indexToTime(dateIndex, timeIndex));
}
