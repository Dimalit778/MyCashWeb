// Get {-- list --} on incomes or expense And selected {-- date --}
// return Filtered list by the select date
export const filterByMonthAndYear = (list, date) => {
  const filterList = [];
  list.forEach((item) => {
    let d = new Date(item.date);
    if (
      d.getMonth() === date.getMonth() &&
      d.getFullYear() === date.getFullYear()
    ) {
      filterList.push(item);
    }
  });
  return filterList;
};
