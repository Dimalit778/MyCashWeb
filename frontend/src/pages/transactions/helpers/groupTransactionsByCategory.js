// // Helper function to group transactions by category
export function groupTransactionsByCategory(transactions) {
  if (!transactions) return [];

  return Object.values(
    transactions.reduce((acc, transaction) => {
      const { category, amount } = transaction;
      if (!acc[category]) {
        acc[category] = { category, total: 0 };
      }
      acc[category].total += amount;
      return acc;
    }, {})
  ).sort((a, b) => b.total - a.total);
}
