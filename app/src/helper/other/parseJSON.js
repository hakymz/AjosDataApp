export const parseJSON = data => {
  return typeof data == 'string' ? JSON.parse(data) : data;
};
