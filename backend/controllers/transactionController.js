import Transaction from "../models/transactionSchema.js";
import Category from "../models/categorySchema.js";
import { TRANSACTION_TYPES } from "../config/config.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const getYearlyData = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { year } = req.query;

  if (!year) {
    throw new ApiError(400, "Year is required");
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
  yearlyTotals.totalBalance = balance < 0 ? -Math.abs(balance) : balance;

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
  return res.json(
    new ApiResponse(200, { yearlyStats: yearlyTotals, monthlyStats }, "Yearly data retrieved successfully")
  );
});
export const getMonthlyData = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { year, month, type } = req.query;

  if (!year || !month || !type) {
    throw new ApiError(400, "Year, month, and type parameters are required");
  }

  const dateStart = new Date(`${year}-${month}-01`);
  const dateEnd = new Date(`${year}-${month}-31`);

  // Get transactions with populated category
  const transactions = await Transaction.find({
    user: userId,
    transactionType: type,
    date: {
      $gte: dateStart,
      $lte: dateEnd,
    },
  })
    .populate("category", "description type") // Get category details
    .lean();

  const total = transactions.reduce((sum, t) => sum + t.amount, 0);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        transactions,
        total,
      },
      "Monthly data retrieved successfully"
    )
  );
});

export const getOneTransaction = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const transaction = await Transaction.findOne({
    _id: id,
    user: userId,
  });
  if (!transaction) {
    throw new ApiError(404, "Transaction not found");
  }
  return res.status(200).json(new ApiResponse(200, { transaction }, "Transaction retrieved successfully"));
});

export const addTransaction = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { description, amount, category, date, type } = req.body;

  if (!description || !date || !category || !type || !amount) {
    throw new ApiError(400, "All required fields must be provided", [
      "description",
      "date",
      "category",
      "type",
      "amount",
    ]);
  }

  if (amount <= 0) {
    throw new ApiError(400, "Amount must be greater than 0");
  }
  if (amount > 1000000) {
    throw new ApiError(400, "Amount must be less than 1000000");
  }

  if (type !== TRANSACTION_TYPES.INCOME && type !== TRANSACTION_TYPES.EXPENSE) {
    throw new ApiError(400, "Invalid transaction type");
  }

  if (description.length > 20 || description.length < 1) {
    throw new ApiError(400, "Description must be between 1 and 20 characters");
  }

  // Create transaction with just the category description
  const transaction = new Transaction({
    description,
    amount,
    date,
    transactionType: type,
    category,
    user: userId,
  });

  await transaction.save();

  return res.status(201).json(new ApiResponse(201, { transaction }, "Transaction created successfully"));
});

export const updateTransaction = asyncHandler(async (req, res) => {
  const { _id, description, amount, date, type, category } = req.body;
  const userId = req.user._id;

  const existingTransaction = await Transaction.findOne({
    _id,
    user: userId,
  });

  if (!existingTransaction) {
    throw new ApiError(404, "Transaction not found");
  }

  let updateData = { description, amount, date };
  console.log("updateData", updateData);

  if (category) {
    const categoryToUpdate = await Category.findOne({ user: userId, type: type, name: category });

    if (!categoryToUpdate) {
      throw new ApiError(400, "Invalid category");
    }

    if (categoryToUpdate.type !== type && type !== existingTransaction.transactionType) {
      throw new ApiError(400, "Category type doesn't match transaction type");
    }

    updateData.category = categoryToUpdate.name;
  }

  // Update transaction
  const updatedTransaction = await Transaction.findOneAndUpdate({ _id, user: userId }, updateData, {
    new: true,
    runValidators: true,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { transaction: updatedTransaction }, "Transaction updated successfully"));
});
export const deleteTransaction = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const transaction = await Transaction.findOneAndDelete({
    _id: id,
    user: userId,
  });

  if (!transaction) {
    throw new ApiError(404, "Transaction not found");
  }

  return res.status(200).json(new ApiResponse(200, { transactionId: id }, "Transaction deleted successfully"));
});
