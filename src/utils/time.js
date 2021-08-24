export const getSeconds = (ms) => {
  return twoDigits(Math.floor(ms / 1000) % 60);
};
export const getMinutes = (ms) => {
  return twoDigits(Math.floor(ms / 60000));
};

const twoDigits = (num) => {
  if (num < 10) {
    return `0${num}`;
  } else {
    return `${num}`;
  }
};

export const isPast = (date) => {
  const currentDate = new Date();
  const testDate = new Date(date);

  if (testDate.toISOString() > currentDate.toISOString()) {
    return false;
  } else {
    return true;
  }
};
