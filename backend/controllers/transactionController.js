import Transaction from "../models/transactionSchema.js";
import Category from "../models/categorySchema.js";
import mongoose from "mongoose";
import { TRANSACTION_TYPES } from "../config/config.js";

export const getMonthlyTransactions = async (req, res) => {
  try {
    const userId = req.user._id;
    const { date, type } = req.query;

    // Input validation
    if (!date || !["income", "expense"].includes(type)) {
      return res.status(400).json({
        message: "Valid date and type (income/expense) are required",
      });
    }

    // Parse date
    const [year, month] = date.split("-");
    if (!year || !month) {
      return res.status(400).json({
        message: "Invalid date format. Use YYYY-MM",
      });
    }

    const response = await Transaction.getMonthlyStats(userId, type, parseInt(year), parseInt(month));

    res.json(response);
  } catch (error) {
    console.error("Error in getMonthlyTransactions:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
export const getYearlyStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const { year } = req.query;
    const currentYear = new Date().getFullYear();

    if (!year || isNaN(year) || year < 2000 || year > currentYear) {
      return res.status(400).json({
        success: false,
        message: `Year must be between 2000 and ${currentYear}`,
      });
    }

    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);

    const result = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$date" },
            type: "$type",
          },
          totalSum: { $sum: "$amount" },
          transactions: {
            $push: {
              _id: "$_id",
              label: "$label",
              amount: "$amount",
              categoryLabel: "$categoryLabel",
              description: "$description",
              date: "$date",
            },
          },
          categoryTotals: {
            $push: {
              categoryLabel: "$categoryLabel",
              total: "$amount",
            },
          },
        },
      },
      {
        $group: {
          _id: "$_id.month",
          incomes: {
            $push: {
              $cond: [
                { $eq: ["$_id.type", "income"] },
                {
                  totalSum: "$totalSum",
                  categoryTotals: "$categoryTotals",
                  transactions: "$transactions",
                },
                null,
              ],
            },
          },
          expenses: {
            $push: {
              $cond: [
                { $eq: ["$_id.type", "expense"] },
                {
                  totalSum: "$totalSum",
                  categoryTotals: "$categoryTotals",
                  transactions: "$transactions",
                },
                null,
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id",
          incomes: { $arrayElemAt: ["$incomes", 0] },
          expenses: { $arrayElemAt: ["$expenses", 0] },
        },
      },
      {
        $group: {
          _id: null,
          months: { $push: "$$ROOT" },
          totalIncomes: { $sum: "$incomes.totalSum" },
          totalExpenses: { $sum: "$expenses.totalSum" },
        },
      },
    ]);

    res.json(result[0]);
  } catch (error) {
    console.error("Error in getYearlyStats:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
// try {
//   const userId = req.user._id;
//   const { year } = req.query;
//   const currentYear = new Date().getFullYear();

//   if (!year || isNaN(year) || year < 2000 || year > currentYear) {
//     return res.status(400).json({
//       success: false,
//       message: `Year must be between 2000 and ${currentYear}`,
//     });
//   }

//   const startDate = new Date(year, 0, 1);
//   const endDate = new Date(year, 11, 31, 23, 59, 59);

//   const monthlyData = await Transaction.aggregate([
//     {
//       $match: {
//         user: new mongoose.Types.ObjectId(userId),
//         date: { $gte: startDate, $lte: endDate },
//       },
//     },
//     {
//       $group: {
//         _id: {
//           month: { $month: "$date" },
//           type: "$type",
//         },
//         total: { $sum: "$amount" },
//         transactions: {
//           $push: {
//             _id: "$_id",
//             label: "$label",
//             amount: "$amount",
//             date: "$date",
//             categoryLabel: "$categoryLabel",
//             description: "$description",
//           },
//         },
//         sortByCategory: {
//           $push: {
//             $group: {
//               _id: "$categoryLabel",
//               total: { $sum: "$amount" },
//             },
//           },
//         },
//         avgTransaction: { $avg: "$amount" },
//         minTransaction: { $min: "$amount" },
//         maxTransaction: { $max: "$amount" },
//         count: { $sum: 1 },
//       },
//     },
//     { $sort: { "_id.month": 1 } },
//   ]);

//   // Initialize data structure
//   const stats = {
//     monthlyData: Array.from({ length: 12 }, (_, index) => ({
//       month: index + 1,
//       monthName: new Date(year, index).toLocaleString("default", { month: "long" }),
//       [TRANSACTION_TYPES.INCOME]: 0,
//       [TRANSACTION_TYPES.EXPENSE]: 0,
//       balance: 0,
//       [`${TRANSACTION_TYPES.INCOME}Transactions`]: [],
//       [`${TRANSACTION_TYPES.EXPENSE}Transactions`]: [],
//       statistics: {
//         avgTransaction: 0,
//         minTransaction: 0,
//         maxTransaction: 0,
//         transactionCount: 0,
//       },
//     })),
//     totals: {
//       [TRANSACTION_TYPES.INCOME]: 0,
//       [TRANSACTION_TYPES.EXPENSE]: 0,
//       transactions: 0,
//     },
//     highestMonth: {
//       [TRANSACTION_TYPES.INCOME]: { month: null, amount: 0 },
//       [TRANSACTION_TYPES.EXPENSE]: { month: null, amount: 0 },
//     },
//   };

//   // Process data
//   monthlyData.forEach((item) => {
//     const monthIndex = item._id.month - 1;
//     const type = item._id.type;
//     const monthName = stats.monthlyData[monthIndex].monthName;

//     // Update monthly amounts and transactions
//     stats.monthlyData[monthIndex].sortByCategory = item.sortByCategory;
//     stats.monthlyData[monthIndex][type] = item.total;
//     stats.monthlyData[monthIndex][`${type}Transactions`] = item.transactions;
//     stats.monthlyData[monthIndex].statistics = {
//       avgTransaction: item.avgTransaction,
//       minTransaction: item.minTransaction,
//       maxTransaction: item.maxTransaction,
//       transactionCount: item.count,
//     };

//     // Update totals
//     stats.totals[type] += item.total;
//     stats.totals.transactions += item.count;

//     // Update highest months
//     if (item.total > stats.highestMonth[type].amount) {
//       stats.highestMonth[type] = { month: monthName, amount: item.total };
//     }

//     // Calculate monthly balance
//     stats.monthlyData[monthIndex].balance =
//       stats.monthlyData[monthIndex][TRANSACTION_TYPES.INCOME] -
//       stats.monthlyData[monthIndex][TRANSACTION_TYPES.EXPENSE];
//   });

//   res.json({
//     success: true,
//     data: {
//       year: parseInt(year),
//       monthlyData: stats.monthlyData,
//       summary: {
//         ...stats.totals,
//         yearlyBalance: stats.totals[TRANSACTION_TYPES.INCOME] - stats.totals[TRANSACTION_TYPES.EXPENSE],
//         highestMonths: stats.highestMonth,
//       },
//     },
//   });
// } catch (error) {
//   console.error("Error getting yearly stats:", error);
//   res.status(500).json({
//     success: false,
//     message: "Error fetching yearly statistics",
//     error: error.message,
//   });
// }

export const getOneTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    const userId = req.user._id;
    const transaction = await Transaction.findOne({
      _id: id,
      user: userId,
    });

    res.json(transaction);
  } catch (error) {
    console.error("Error in transaction:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const addTransaction = async (req, res) => {
  try {
    const userId = req.user._id;
    const { label, amount, categoryId, date, description, type } = req.body;

    // Validation
    if (!label || !date || !categoryId || !type || !amount) {
      return res.status(400).json({
        message: "All required fields must be provided",
        required: ["label", "date", "categoryId", "type", "amount"],
      });
    }
    // Find user's categories and verify category
    const userCategories = await Category.findOne({ user: userId });
    if (!userCategories) {
      return res.status(404).json({ message: "Categories not found" });
    }

    const category = userCategories.categories.id(categoryId);
    if (!category) {
      return res.status(400).json({ message: "Invalid category" });
    }

    if (category.type !== type) {
      return res.status(400).json({
        message: "Category type doesn't match transaction type",
      });
    }
    // Create transaction with just the category label
    const transaction = new Transaction({
      label,
      amount,
      date,
      description: description || "",
      type,
      categoryLabel: category.label,
      user: userId,
    });

    await transaction.save();

    res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      transaction,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { label, amount, date, description, type, categoryId } = req.body;
    const userId = req.user._id;

    // First find the existing transaction
    const existingTransaction = await Transaction.findOne({
      _id: id,
      user: userId,
    });

    if (!existingTransaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    // If category is being updated, get the new category label
    let updateData = { label, amount, date, description };

    if (categoryId) {
      // Find user's categories and verify new category
      const userCategories = await Category.findOne({ user: userId });
      const newCategory = userCategories.categories.id(categoryId);

      if (!newCategory) {
        return res.status(400).json({
          success: false,
          message: "Invalid category",
        });
      }

      // Verify category type matches transaction type
      if (newCategory.type !== type && type !== existingTransaction.type) {
        return res.status(400).json({
          success: false,
          message: "Category type doesn't match transaction type",
        });
      }

      // Add category label to update data
      updateData.categoryLabel = newCategory.label;
    }

    // Update transaction
    const updatedTransaction = await Transaction.findOneAndUpdate({ _id: id, user: userId }, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: "Transaction updated successfully",
      transaction: updatedTransaction,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    console.error("Update transaction error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating transaction",
      error: error.message,
    });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const transaction = await Transaction.findOneAndDelete({
      _id: id,
      user: userId,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({
      message: "Transaction deleted successfully",
      transactionId: id,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
