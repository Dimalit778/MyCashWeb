import Category from "./../models/categorySchema.js";
import Transaction from "./../models/transactionSchema.js";
import { faker } from "@faker-js/faker";

const seedUserWithTransactions = async (user, count, targetMonth) => {
  try {
    let categories = await Category.find({ user: user._id });

    if (categories.length === 0) {
      categories = await Category.insertMany([
        { user: user._id, name: "Home", type: "expenses" },
        { user: user._id, name: "Other", type: "expenses" },
        { user: user._id, name: "Job", type: "incomes" },
        { user: user._id, name: "Other", type: "incomes" },
      ]);
    }

    const transactions = [];
    const current = new Date();

    for (let i = 0; i < count; i++) {
      const transactionType = i % 2 === 0 ? "incomes" : "expenses";
      const category = categories.find((cat) => cat.type === transactionType);

      const day = Math.floor(Math.random() * 28);
      const transactionDate = new Date(current.getFullYear(), targetMonth ? targetMonth : current.getMonth(), day);

      transactions.push({
        description: faker.lorem.sentence({ min: 1, max: 3 }),
        amount: faker.number.int({ min: 10, max: 1000 }),
        date: transactionDate,
        transactionType,
        category: category.name,
        user: user._id,
      });
    }

    await Transaction.insertMany(transactions);

    return {
      transactionsCount: transactions.length,
      transactions: transactions,
    };
  } catch (error) {
    console.error("Error seeding transactions:", error);
    throw error;
  }
};
export { seedUserWithTransactions };
