const getShortMonthName = (date) => {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
};
const filterByMonthAndYear = (list, date) => {
  const filterList = [];
  list.forEach((item) => {
    let d = new Date(item.date);
    if (d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear()) {
      filterList.push(item);
    }
  });
  return filterList;
};
const filterByYear = (list, year) => {
  const filterList = [];
  list.forEach((item) => {
    let d = new Date(item.date);
    if (d.getFullYear() === year) {
      filterList.push(item);
    }
  });
  return filterList;
};
const groupByMonth = (data) => {
  const groupedData = {};

  data.forEach((item) => {
    const date = new Date(item.date);
    const monthName = new Intl.DateTimeFormat("en-US", {
      month: "long",
    }).format(date);
    groupedData[monthName] = (groupedData[monthName] || 0) + item.amount;
  });

  return groupedData;
};

export { getShortMonthName, filterByMonthAndYear, filterByYear, groupByMonth };
