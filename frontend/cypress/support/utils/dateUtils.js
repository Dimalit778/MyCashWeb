export const formatDate = (date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
  }).format(date);
};

export const getMonthParams = (date) => {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
  };
};
