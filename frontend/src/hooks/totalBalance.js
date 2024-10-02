export const totalBalance = (expenses, incomes) => {
  let total = incomes - expenses;

  if (expenses > incomes) {
    return total;
  }
  return total;
};
