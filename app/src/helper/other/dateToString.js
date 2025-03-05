export const dateToString = date => {
  console.log(date);
  return date?.toLocaleString('en-GB').split(',')[0];
};
