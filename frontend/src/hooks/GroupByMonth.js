export const groupByMonth = (data) => {
  const groupedData = {};

  data.forEach((item) => {
    const date = new Date(item.date);
    const monthName = new Intl.DateTimeFormat('en-US', {
      month: 'long',
    }).format(date);
    groupedData[monthName] = (groupedData[monthName] || 0) + item.amount;
  });

  return groupedData;
};
