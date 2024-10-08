import Expense from "../models/expenseModel.js";
import Income from "../models/incomeModel.js";

export const getMonthlyTransactions = async (req, res) => {
  try {
    const userId = req.user._id;
    const { date, type } = req.query;

    // Input validation
    if (!date || !type) {
      return res.status(400).json({ message: "Date and type are required" });
    }

    if (type !== "income" && type !== "expense") {
      return res.status(400).json({ message: "Invalid transaction type" });
    }

    // Parse date
    const [year, month] = date.split("-");
    if (!year || !month) {
      return res.status(400).json({ message: "Invalid date format. Use YYYY-MM" });
    }

    // Create start and end date strings for the month
    const startDate = `${year}-${month}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${year}-${month}-${lastDay}`;
    const Model = type === "income" ? Income : Expense;

    const result = await Model.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $facet: {
          totalAmount: [
            {
              $group: {
                _id: null,
                total: { $sum: "$amount" },
              },
            },
          ],
          sortByCategory: [
            {
              $group: {
                _id: "$category",
                total: { $sum: "$amount" },
              },
            },
            { $sort: { total: -1 } },
          ],
          allData: [
            { $sort: { date: -1 } },
            {
              $project: {
                _id: 1,
                title: 1,
                amount: 1,
                category: 1,
                date: 1,
              },
            },
          ],
        },
      },
      {
        $project: {
          totalAmount: { $ifNull: [{ $arrayElemAt: ["$totalAmount.total", 0] }, 0] },
          sortByCategory: 1,
          allData: 1,
        },
      },
    ]);

    const response = result[0] || { totalAmount: 0, sortByCategory: [], allData: [] };

    res.json(response);
  } catch (error) {
    console.error("Error in getMonthlyTransactions:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
export const getYearlyTransactions = async (req, res) => {
  console.log("---------- getYearlyTransactions");
  try {
    const userId = req.user._id;
    const { year } = req.query;
    console.log("Year:", year);
    // Input validation
    if (!year) {
      return res.status(400).json({ message: "Date is required" });
    }

    // Define the aggregation pipeline
    const aggregationPipeline = [
      {
        $match: {
          user: userId,
          date: { $gte: `${year}-01-01`, $lte: `${year}-12-31` },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: { $dateFromString: { dateString: "$date" } } },
          },

          total: { $sum: "$amount" },
          transactions: {
            $push: { id: "$_id", title: "$title", amount: "$amount", date: "$date", category: "$category" },
          },
        },
      },
      {
        $sort: { "_id.month": 1 },
      },
    ];

    // Execute aggregation for both expenses and incomes
    const expensesPromise = Expense.aggregate(aggregationPipeline);
    const incomesPromise = Income.aggregate(aggregationPipeline);

    const [expenses, incomes] = await Promise.all([expensesPromise, incomesPromise]);

    // Process the results
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      expenses: 0,
      incomes: 0,
      balance: 0,
      expenseTransactions: [],
      incomeTransactions: [],
    }));

    let totalExpenses = 0;
    let totalIncomes = 0;

    expenses.forEach((item) => {
      const monthIndex = item._id.month - 1;
      monthlyData[monthIndex].expenses = item.total;
      monthlyData[monthIndex].expenseTransactions = item.transactions;
      totalExpenses += item.total;
    });

    incomes.forEach((item) => {
      const monthIndex = item._id.month - 1;
      monthlyData[monthIndex].incomes = item.total;
      monthlyData[monthIndex].incomeTransactions = item.transactions;
      totalIncomes += item.total;
    });

    // Calculate balance for each month and overall
    monthlyData.forEach((month) => {
      month.balance = month.incomes - month.expenses;
    });

    const yearlyBalance = totalIncomes - totalExpenses;

    res.json({
      year,
      monthlyData,
      yearSummary: {
        totalIncomes,
        totalExpenses,
        yearlyBalance,
      },
    });
  } catch (error) {
    console.error("Error in getYearlyTransactions:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
