const timeSince = (dateTime) => {
  return `${dateTime.getDate()}/${
    dateTime.getMonth() + 1
  } ${dateTime.getHours()}:${dateTime.getMinutes()}`;
};

export { timeSince };
