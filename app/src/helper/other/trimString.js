export const trimString = (string, length) => {
  const newString = string.toString();
  return newString.length > length ? newString.substring(0, length) : newString;
};
