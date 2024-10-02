// Get {-- list --} on incomes or expense And selected {-- date --}
// return Filtered list by year
export const filterByYear = (list, year) => {
  const filterList = [];
  list.forEach((item) => {
    let d = new Date(item.date);
    if (d.getFullYear() === year) {
      filterList.push(item);
    }
  });
  return filterList;
};
