const getInitials = (name) => {
  if (!name) return '--';

  const nameArray = name.split(' ');
  if (nameArray.length > 0) {
    return nameArray[0][0] + nameArray[1][0];
  }
  return nameArray[0][0];
};

export { getInitials };
