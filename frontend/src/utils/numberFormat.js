export const numberFormat = (number) => {
  if (!number) return "0.00";
  let format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(number);
  return format;
};
