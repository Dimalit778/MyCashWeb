// Gets Filtered By Month List of Incomes or Expenses

// RETURN the SUM amount of the list
export const calculateTotal = (list) => {
  let total = 0;
  list.forEach((e) => {
    total += e.amount;
  });
  return total;
};
