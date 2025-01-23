export const testUser = {
  firstName: "cy-user",
  lastName: "cy-Test",
  email: "cy@example.com",
  password: "144695",
  profileImage: null,
  subscription: "free",
  role: "user",
};

// Test categories linked to test user

export const testCategories = {
  user: "USER_ID_WILL_BE_SET",
  categories: [
    {
      name: "Entertainment",
      type: "expenses",
      isDefault: false,
      user: "USER_ID_WILL_BE_SET",
    },
    {
      name: "Bills",
      type: "expenses",
      isDefault: false,
      user: "USER_ID_WILL_BE_SET",
    },

    {
      name: "Shopping",
      type: "expenses",
      isDefault: true,
      user: "USER_ID_WILL_BE_SET",
    },
    {
      name: "Other",
      type: "expenses",
      isDefault: true,
      user: "USER_ID_WILL_BE_SET",
    },
    {
      name: "Work",
      type: "incomes",
      isDefault: true,
      user: "USER_ID_WILL_BE_SET",
    },
    {
      name: "Other",
      type: "incomes",
      isDefault: true,
      user: "USER_ID_WILL_BE_SET",
    },
    {
      name: "Savings",
      type: "incomes",
      isDefault: false,
      user: "USER_ID_WILL_BE_SET",
    },
  ],
};
export const testTransactions = [
  // ------ 2025 ------
  // January
  {
    name: "Groceries",
    amount: 450,
    date: new Date("2025-01-03"),
    transactionType: "expenses",
    category: "Shopping",
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Internet Bill",
    amount: 350,
    date: new Date("2025-01-03"),
    transactionType: "expenses",
    category: { id: null, name: "Bills" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Restaurant",
    amount: 650,
    date: new Date("2025-01-15"),
    transactionType: "expenses",
    category: { id: null, name: "Entertainment" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Gas",
    amount: 350,
    date: new Date("2025-01-20"),
    transactionType: "expenses",
    category: { id: null, name: "Other" },
    user: "USER_ID_WILL_BE_SET",
  },

  // February
  {
    name: "Electricity",
    amount: 500,
    date: new Date("2025-02-01"),
    transactionType: "expenses",
    category: { id: null, name: "Bills" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Cinema",
    amount: 250,
    date: new Date("2025-02-10"),
    transactionType: "expenses",
    category: { id: null, name: "Entertainment" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Groceries",
    amount: 180,
    date: new Date("2025-02-15"),
    transactionType: "expenses",
    category: { id: null, name: "Shopping" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Car Service",
    amount: 250,
    date: new Date("2025-02-20"),
    transactionType: "expenses",
    category: { id: null, name: "Other" },
    user: "USER_ID_WILL_BE_SET",
  },

  //March
  {
    name: "Electricity",
    amount: 500,
    date: new Date("2025-03-05"),
    transactionType: "expenses",
    category: { id: null, name: "Bills" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Cinema",
    amount: 350,
    date: new Date("2025-03-01"),
    transactionType: "expenses",
    category: { id: null, name: "Entertainment" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Groceries",
    amount: 650,
    date: new Date("2025-03-03"),
    transactionType: "expenses",
    category: { id: null, name: "Shopping" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Car Service",
    amount: 250,
    date: new Date("2025-03-28"),
    transactionType: "expenses",
    category: { id: null, name: "Other" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Electricity",
    amount: 300,
    date: new Date("2025-03-01"),
    transactionType: "expenses",
    category: { id: null, name: "Bills" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Cinema Movie",
    amount: 150,
    date: new Date("2025-03-13"),
    transactionType: "expenses",
    category: { id: null, name: "Entertainment" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Groceries",
    amount: 180,
    date: new Date("2025-03-15"),
    transactionType: "expenses",
    category: { id: null, name: "Shopping" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "TV fix",
    amount: 250,
    date: new Date("2025-03-20"),
    transactionType: "expenses",
    category: { id: null, name: "Other" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Visa",
    amount: 2500,
    date: new Date("2025-03-15"),
    transactionType: "expenses",
    category: { id: null, name: "Bills" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Gym",
    amount: 450,
    date: new Date("2025-03-03"),
    transactionType: "expenses",
    category: { id: null, name: "Other" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Food",
    amount: 450,
    date: new Date("2025-03-16"),
    transactionType: "expenses",
    category: { id: null, name: "Shopping" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Loan",
    amount: 1250,
    date: new Date("2025-03-20"),
    transactionType: "expenses",
    category: { id: null, name: "Bills" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Wedding",
    amount: 750,
    date: new Date("2025-03-09"),
    transactionType: "expenses",
    category: { id: null, name: "Entertainment" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Pizza",
    amount: 150,
    date: new Date("2025-03-11"),
    transactionType: "expenses",
    category: { id: null, name: "Shopping" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Party",
    amount: 600,
    date: new Date("2025-03-15"),
    transactionType: "expenses",
    category: { id: null, name: "Entertainment" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Home",
    amount: 1250,
    date: new Date("2025-03-20"),
    transactionType: "expenses",
    category: { id: null, name: "Shopping" },
    user: "USER_ID_WILL_BE_SET",
  },
  //Incomes
  // January
  {
    name: "Salary",
    amount: 5000,
    date: new Date("2025-01-01"),
    transactionType: "incomes",
    category: { id: null, name: "Work" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Freelance Project",
    amount: 2000,
    date: new Date("2025-01-15"),
    transactionType: "incomes",
    category: { id: null, name: "Other" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Salary",
    amount: 7000,
    date: new Date("2025-02-01"),
    transactionType: "incomes",
    category: { id: null, name: "Work" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Freelance Project",
    amount: 2500,
    date: new Date("2025-02-15"),
    transactionType: "incomes",
    category: { id: null, name: "Other" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Salary",
    amount: 15000,
    date: new Date("2025-03-01"),
    transactionType: "incomes",
    category: { id: null, name: "Work" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Freelance Project",
    amount: 3500,
    date: new Date("2025-03-10"),
    transactionType: "incomes",
    category: { id: null, name: "Other" },
    user: "USER_ID_WILL_BE_SET",
  },
  // ----- 2024 -----
  // May
  {
    name: "Groceries",
    amount: 1500,
    date: new Date("2024-05-03"),
    transactionType: "expenses",
    category: { id: null, name: "Shopping" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Internet Bill",
    amount: 750,
    date: new Date("2024-05-03"),
    transactionType: "expenses",
    category: { id: null, name: "Bills" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Restaurant",
    amount: 2500,
    date: new Date("2024-05-15"),
    transactionType: "expenses",
    category: { id: null, name: "Entertainment" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Gas",
    amount: 350,
    date: new Date("2024-05-20"),
    transactionType: "expenses",
    category: { id: null, name: "Other" },
    user: "USER_ID_WILL_BE_SET",
  },

  // August
  {
    name: "Electricity",
    amount: 950,
    date: new Date("2024-08-01"),
    transactionType: "expenses",
    category: { id: null, name: "Bills" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Cinema",
    amount: 600,
    date: new Date("2024-08-10"),
    transactionType: "expenses",
    category: { id: null, name: "Entertainment" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Groceries",
    amount: 180,
    date: new Date("2024-08-15"),
    transactionType: "expenses",
    category: { id: null, name: "Shopping" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Car Service",
    amount: 250,
    date: new Date("2024-08-20"),
    transactionType: "expenses",
    category: { id: null, name: "Other" },
    user: "USER_ID_WILL_BE_SET",
  },

  //October
  {
    name: "Electricity",
    amount: 500,
    date: new Date("2024-11-05"),
    transactionType: "expenses",
    category: { id: null, name: "Bills" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Cinema",
    amount: 350,
    date: new Date("2024-11-01"),
    transactionType: "expenses",
    category: { id: null, name: "Entertainment" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Groceries",
    amount: 650,
    date: new Date("2024-11-11"),
    transactionType: "expenses",
    category: { id: null, name: "Shopping" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Car Service",
    amount: 250,
    date: new Date("2024-11-28"),
    transactionType: "expenses",
    category: { id: null, name: "Other" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Electricity",
    amount: 300,
    date: new Date("2024-11-01"),
    transactionType: "expenses",
    category: { id: null, name: "Bills" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Cinema Movie",
    amount: 150,
    date: new Date("2024-11-13"),
    transactionType: "expenses",
    category: { id: null, name: "Entertainment" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Groceries",
    amount: 180,
    date: new Date("2024-11-15"),
    transactionType: "expenses",
    category: { id: null, name: "Shopping" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "TV fix",
    amount: 250,
    date: new Date("2024-11-20"),
    transactionType: "expenses",
    category: { id: null, name: "Other" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Visa",
    amount: 2500,
    date: new Date("2024-11-15"),
    transactionType: "expenses",
    category: { id: null, name: "Bills" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Gym",
    amount: 450,
    date: new Date("2024-11-11"),
    transactionType: "expenses",
    category: { id: null, name: "Other" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Food",
    amount: 450,
    date: new Date("2024-11-16"),
    transactionType: "expenses",
    category: { id: null, name: "Shopping" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Loan",
    amount: 1250,
    date: new Date("2024-11-20"),
    transactionType: "expenses",
    category: { id: null, name: "Bills" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Wedding",
    amount: 750,
    date: new Date("2024-11-09"),
    transactionType: "expenses",
    category: { id: null, name: "Entertainment" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Pizza",
    amount: 150,
    date: new Date("2024-11-11"),
    transactionType: "expenses",
    category: { id: null, name: "Shopping" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Party",
    amount: 600,
    date: new Date("2024-11-15"),
    transactionType: "expenses",
    category: { id: null, name: "Entertainment" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Home",
    amount: 1250,
    date: new Date("2024-11-20"),
    transactionType: "expenses",
    category: { id: null, name: "Shopping" },
    user: "USER_ID_WILL_BE_SET",
  },
  // December
  {
    name: "Electricity",
    amount: 500,
    date: new Date("2024-12-05"),
    transactionType: "expenses",
    category: { id: null, name: "Bills" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Cinema",
    amount: 500,
    date: new Date("2024-12-02"),
    transactionType: "expenses",
    category: { id: null, name: "Entertainment" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Groceries",
    amount: 1350,
    date: new Date("2024-12-16"),
    transactionType: "expenses",
    category: { id: null, name: "Shopping" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Car Service",
    amount: 550,
    date: new Date("2024-12-27"),
    transactionType: "expenses",
    category: { id: null, name: "Other" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Electricity",
    amount: 300,
    date: new Date("2024-12-05"),
    transactionType: "expenses",
    category: { id: null, name: "Bills" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Cinema Movie",
    amount: 350,
    date: new Date("2024-12-24"),
    transactionType: "expenses",
    category: { id: null, name: "Entertainment" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Electricity",
    amount: 500,
    date: new Date("2024-11-05"),
    transactionType: "expenses",
    category: { id: null, name: "Bills" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Cinema",
    amount: 350,
    date: new Date("2024-11-01"),
    transactionType: "expenses",
    category: { id: null, name: "Entertainment" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Groceries",
    amount: 650,
    date: new Date("2024-11-11"),
    transactionType: "expenses",
    category: { id: null, name: "Shopping" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Car Service",
    amount: 250,
    date: new Date("2024-11-28"),
    transactionType: "expenses",
    category: { id: null, name: "Other" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Electricity",
    amount: 300,
    date: new Date("2024-11-01"),
    transactionType: "expenses",
    category: { id: null, name: "Bills" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Birthday Party",
    amount: 850,
    date: new Date("2024-11-13"),
    transactionType: "expenses",
    category: { id: null, name: "Entertainment" },
    user: "USER_ID_WILL_BE_SET",
  },

  //Incomes
  {
    name: "Salary",
    amount: 9000,
    date: new Date("2024-11-01"),
    transactionType: "incomes",
    category: { id: null, name: "Work" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Freelance Project",
    amount: 2500,
    date: new Date("2024-11-15"),
    transactionType: "incomes",
    category: { id: null, name: "Other" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Salary",
    amount: 7000,
    date: new Date("2024-12-05"),
    transactionType: "incomes",
    category: { id: null, name: "Work" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Freelance Project",
    amount: 1000,
    date: new Date("2024-12-15"),
    transactionType: "incomes",
    category: { id: null, name: "Other" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Salary",
    amount: 15000,
    date: new Date("2024-08-01"),
    transactionType: "incomes",
    category: { id: null, name: "Work" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Freelance Project",
    amount: 3500,
    date: new Date("2024-08-10"),
    transactionType: "incomes",
    category: { id: null, name: "Other" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Online",
    amount: 12000,
    date: new Date("2024-09-01"),
    transactionType: "incomes",
    category: { id: null, name: "Other" },
    user: "USER_ID_WILL_BE_SET",
  },
  {
    name: "Online Business",
    amount: 4500,
    date: new Date("2024-08-10"),
    transactionType: "incomes",
    category: { id: null, name: "Other" },
    user: "USER_ID_WILL_BE_SET",
  },
];
