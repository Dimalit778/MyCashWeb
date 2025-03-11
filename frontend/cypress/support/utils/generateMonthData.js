export const generateCurrentMonthTransactions = (count = 15) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  // Get days in current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const userId = "67952bc8edea680fb371e84c";
  const transactions = [];
  let total = 0;

  // Generate transactions
  for (let i = 1; i <= count; i++) {
    // Random amount between 100 and 2000
    const amount = Math.floor(Math.random() * 1900) + 100;
    total += amount;

    // Random date within current month
    const day = Math.floor(Math.random() * daysInMonth) + 1;
    const transactionDate = new Date(year, month, day);

    transactions.push({
      _id: `id_${i}`,
      description: `item ${i}`,
      amount: amount,
      category: "Home",
      date: transactionDate.toISOString(),
      transactionType: "expenses",
      user: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __v: 0,
    });
  }

  return {
    success: {
      message: "Monthly data retrieved successfully",
      statusCode: 200,
    },
    data: {
      transactions: transactions,
      total: total,
    },
  };
};
