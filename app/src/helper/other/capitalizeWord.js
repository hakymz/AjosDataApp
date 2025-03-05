export const capitalizeWord = txt => {
  if (!txt) return '';
  let text = txt.toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
};
