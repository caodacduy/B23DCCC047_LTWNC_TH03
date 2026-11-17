export const LIBRARY_TIME_ZONE = 'Asia/Ho_Chi_Minh';

const clock = new Intl.DateTimeFormat('vi-VN', {
  timeZone: LIBRARY_TIME_ZONE,
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
});

export function localTime() {
  return clock.format();
}
