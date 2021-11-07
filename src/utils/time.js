export const localeString = value => {
  return new Date(value).toLocaleString();
};

export const plocaleString = value => {
  return new Date(parseInt(value)).toLocaleString();
};
