import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import tz from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(tz);

const checkTimeIsExpired = (timeArg) => {
  const currentTime = Date.now();
  const time = new Date(timeArg).getTime() - +process.env.TIME_BUFFER;
  return time < currentTime;
};

const calculateRemainingTime = (timeArg) => {
  const currentTime = Date.now();
  const time = new Date(timeArg).getTime() - +process.env.TIME_BUFFER;
  const remainingTime = time - currentTime;

  return remainingTime;
};

const formatISTDateTime = (time) => {
  return dayjs(time).tz('Asia/Calcutta').format('MM/DD/YYYY, h:mm A');
};

const formatISTDate = (time) => {
  return dayjs(time).tz('Asia/Calcutta').format('MM/DD/YYYY');
};

const formatDateTimeInput = (time) => {
  const date = new Date(time);
  return (
    date.getFullYear().toString() +
    '-' +
    ('0' + (date.getMonth() + 1)).slice(-2) +
    '-' +
    ('0' + date.getDate()).slice(-2) +
    'T' +
    date.toTimeString().slice(0, 5)
  );
};

export {
  checkTimeIsExpired,
  calculateRemainingTime,
  formatISTDateTime,
  formatISTDate,
  formatDateTimeInput,
};
