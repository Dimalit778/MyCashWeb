export const TRANSACTION_TYPES = {
  INCOME: "incomes",
  EXPENSE: "expenses",
};
export const SUBSCRIPTION_TYPES = {
  FREE: "free",
  PREMIUM: "premium",
};
export const CATEGORY_LIMITS = {
  [SUBSCRIPTION_TYPES.FREE]: 5,
  [SUBSCRIPTION_TYPES.PREMIUM]: 10,
};

export const DEFAULT_CATEGORIES = [
  { name: "Work", type: "incomes", isDefault: true },
  { name: "Other", type: "incomes", isDefault: true },

  { name: "Shopping", type: "expenses", isDefault: true },
  { name: "Bills", type: "expenses", isDefault: false },
  { name: "Other", type: "expenses", isDefault: true },
];
