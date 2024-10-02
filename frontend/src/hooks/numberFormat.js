export const numberFormat = (number) => {
  let format = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(number);
  return format;
};
