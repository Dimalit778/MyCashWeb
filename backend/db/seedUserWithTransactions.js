import Category from "./../models/categorySchema.js";
import Transaction from "./../models/transactionSchema.js";
import { faker } from "@faker-js/faker";

const seedUserWithTransactions = async (user, count, targetMonth, type) => {
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
    const currentDate = new Date();

    const filteredCategories = type ? categories.filter((category) => category.type === type) : categories;

    if (filteredCategories.length === 0) {
      throw new Error(`No categories found for type: ${type}`);
    }

    for (let i = 0; i < count; i++) {
      const transactionType = type || (i % 2 === 0 ? "expenses" : "incomes");

      const typeCategories = categories.filter((cat) => cat.type === transactionType);

      // Select a random category from the available ones
      const randomIndex = Math.floor(Math.random() * typeCategories.length);
      const selectedCategory = typeCategories[randomIndex];

      const day = Math.floor(Math.random() * 27) + 1;
      const month = targetMonth !== undefined ? targetMonth : Math.floor(Math.random() * 12);

      const transactionDate = new Date(currentDate.getFullYear(), month, day);

      transactions.push({
        description: faker.lorem.sentence({ min: 1, max: 3 }),
        amount: faker.number.int({ min: 10, max: 1000 }),
        date: transactionDate,
        transactionType,
        category: selectedCategory.name,
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
