import Transaction from "../models/transactionSchema.js";
import Category from "../models/categorySchema.js";
import { TRANSACTION_TYPES } from "../config/config.js";

export const getMonthlyTransactions = async (req, res) => {
  try {
    const userId = req.user._id;
    const { year } = req.query;

    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31`);

    const result = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          date: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$date" },
            transactionType: "$transactionType",
            category: "$category",
          },
          categoryTotal: { $sum: "$amount" },
          transactions: { $push: "$$ROOT" },
        },
      },
      {
        $group: {
          _id: {
            month: "$_id.month",
            transactionType: "$_id.transactionType",
          },
          categories: {
            $push: {
              category: "$_id.category",
              total: "$categoryTotal",
            },
          },
          transactions: {
            $push: "$transactions",
          },
          totalAmount: { $sum: "$categoryTotal" },
        },
      },
      {
        $group: {
          _id: { month: "$_id.month" },
          expenses: {
            $push: {
              $cond: [
                {
                  $eq: ["$_id.transactionType", "expenses"],
                },
                {
                  total: "$totalAmount",
                  categories: "$categories",
                  transactions: {
                    $reduce: {
                      input: "$transactions",
                      initialValue: [],
                      in: {
                        $concatArrays: ["$$value", "$$this"],
                      },
                    },
                  },
                },
                null,
              ],
            },
          },
          incomes: {
            $push: {
              $cond: [
                {
                  $eq: ["$_id.transactionType", "incomes"],
                },
                {
                  total: "$totalAmount",
                  categories: "$categories",
                  transactions: {
                    $reduce: {
                      input: "$transactions",
                      initialValue: [],
                      in: {
                        $concatArrays: ["$$value", "$$this"],
                      },
                    },
                  },
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
          month: "$_id.month",
          expenses: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$expenses",
                  as: "expense",
                  cond: { $ne: ["$$expense", null] },
                },
              },
              0,
            ],
          },
          incomes: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$incomes",
                  as: "income",
                  cond: { $ne: ["$$income", null] },
                },
              },
              0,
            ],
          },
        },
      },
      {
        $sort: { month: 1 },
      },
    ]);
    res.json({
      result,
    });
  } catch (error) {
    console.error("Error in getMonthlyStats:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
export const getMonthlyData = async (req, res) => {
  try {
    const userId = req.user._id;
    const { year, month, type } = req.query;

    // Fetch transactions
    const transactions = await Transaction.find({
      user: userId,
      transactionType: type,
      date: {
        $gte: new Date(`${year}-${month}-01`),
        $lte: new Date(`${year}-${month}-31`),
      },
    });

    // Get total transaction count
    const total = await Transaction.countDocuments({
      user: userId,
      transactionType: type,
      date: {
        $gte: new Date(`${year}-${month}-01`),
        $lte: new Date(`${year}-${month}-31`),
      },
    });

    // Calculate total transaction amount
    const totalAmountData = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          transactionType: type,
          date: {
            $gte: new Date(`${year}-${month}-01`),
            $lte: new Date(`${year}-${month}-31`),
          },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);
    const totalAmount = totalAmountData.length > 0 ? totalAmountData[0].totalAmount : 0;

    // Group transactions by category and calculate totals
    const categoriesData = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          transactionType: type,
          date: {
            $gte: new Date(`${year}-${month}-01`),
            $lte: new Date(`${year}-${month}-31`),
          },
        },
      },
      {
        $group: {
          _id: "$category.name",
          total: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          total: 1,
        },
      },
    ]);

    res.json({
      transactions,

      total: totalAmount,
      categories: categoriesData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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
    const { name, amount, category, date, type } = req.body;

    // Validation
    if (!name || !date || !category || !type || !amount) {
      return res.status(400).json({
        message: "All required fields must be provided",
        required: ["name", "date", "category", "type", "amount"],
      });
    }
    if (amount <= 0) {
      return res.status(400).json({
        message: "Amount must be greater than 0",
      });
    }

    if (type !== TRANSACTION_TYPES.INCOME && type !== TRANSACTION_TYPES.EXPENSE) {
      return res.status(400).json({
        message: "Invalid transaction type",
      });
    }
    if (name.length > 20 || name.length < 1) {
      return res.status(400).json({
        message: "Name must be between 1 and 20 characters",
      });
    }

    // Find user's categories and verify category
    const userCategories = await Category.findOne({ user: userId });

    if (!userCategories) {
      return res.status(404).json({ message: "Categories not found" });
    }

    const isCategory = userCategories.categories.id(category);

    if (!isCategory) {
      return res.status(400).json({ message: "Invalid category" });
    }
    if (isCategory.type !== type) {
      return res.status(400).json({
        message: "Category type doesn't match transaction type",
      });
    }

    // Create transaction with just the category name
    const transaction = new Transaction({
      name,
      amount,
      date,
      transactionType: type,
      category: {
        id: isCategory._id,
        name: isCategory.name,
      },
      user: userId,
    });

    await transaction.save();

    res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      transaction,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateTransaction = async (req, res) => {
  try {
    const { _id, name, amount, date, type, category } = req.body;
    console.log(req.body);
    const userId = req.user._id;
    // First find the existing transaction
    const existingTransaction = await Transaction.findOne({
      _id,
      user: userId,
    });

    if (!existingTransaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    // // If category is being updated, get the new category label
    let updateData = { name, amount, date };

    if (category) {
      // Find user's categories and verify new category
      const userCategories = await Category.findOne({ user: userId });

      const newCategory = userCategories.categories.find((cat) => cat.name === category);

      console.log("newCategory", newCategory);

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
      updateData.categoryName = newCategory.name;
    }

    // Update transaction
    const updatedTransaction = await Transaction.findOneAndUpdate({ _id, user: userId }, updateData, {
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
export const getYearlyStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const { year } = req.query;

    if (!year) {
      return res.status(400).json({ message: "Date is required" });
    }

    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31`);

    const result = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          date: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $facet: {
          yearlyTotals: [
            {
              $group: {
                _id: "$transactionType",
                total: { $sum: "$amount" },
              },
            },
          ],
          // Calculate monthly breakdowns
          monthlyStats: [
            {
              $group: {
                _id: {
                  month: { $month: "$date" },
                  transactionType: "$transactionType",
                },
                total: { $sum: "$amount" },
              },
            },
          ],
        },
      },
      {
        $project: {
          yearlyTotals: 1,
          monthlyStats: 1,
        },
      },
    ]);

    // Process the aggregation results
    const yearlyTotals = result[0].yearlyTotals.reduce(
      (acc, curr) => {
        if (curr._id === "incomes") acc.totalIncomes = curr.total;
        if (curr._id === "expenses") acc.totalExpenses = curr.total;
        return acc;
      },
      { totalIncomes: 0, totalExpenses: 0 }
    );
    // Calculate balance
    const balance = yearlyTotals.totalIncomes - yearlyTotals.totalExpenses;
    yearlyTotals.balance = balance < 0 ? -Math.abs(balance) : balance;

    // Create an array for all 12 months with default values
    const monthlyStats = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      totalIncomes: 0,
      totalExpenses: 0,
    }));

    // Fill in the actual values from the aggregation
    result[0].monthlyStats.forEach((stat) => {
      const monthIndex = stat._id.month - 1;
      if (stat._id.transactionType === TRANSACTION_TYPES.INCOME) {
        monthlyStats[monthIndex].totalIncomes = stat.total;
      } else if (stat._id.transactionType === TRANSACTION_TYPES.EXPENSE) {
        monthlyStats[monthIndex].totalExpenses = stat.total;
      }
    });

    res.json({
      yearlyStats: yearlyTotals,
      monthlyStats,
    });
  } catch (error) {
    console.error("Error in getYearlyStats:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
export const getYear = async (req, res) => {
  try {
    const userId = req.user._id;
    const { year } = req.query;
    // Input validation
    if (!year) {
      return res.status(400).json({ message: "Date is required" });
    }
    const result = await Transaction.find({ user: userId, date: { $gte: `${year}-01-01`, $lte: `${year}-12-31` } });
    res.json({ result });
  } catch (error) {
    console.error("Error in getYearlyTransactions:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
