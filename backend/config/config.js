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
  { label: "Work", type: "incomes", isDefault: true },
  { label: "Other", type: "incomes", isDefault: true },

  { label: "Shopping", type: "expenses", isDefault: true },
  { label: "Bills", type: "expenses", isDefault: false },
  { label: "Other", type: "expenses", isDefault: true },
];
export const CATEGORY_COLORS = {
  INCOME: {
    DEFAULT: "#4CAF50", // Green
    DELETED: "#E0E0E0", // Light gray
    PALETTE: [
      "#4CAF50", // Green
      "#8BC34A", // Light Green
      "#CDDC39", // Lime
      "#009688", // Teal
      "#00BCD4", // Cyan
      "#2196F3", // Blue
      "#3F51B5", // Indigo
      "#673AB7", // Deep Purple
    ],
  },
  EXPENSE: {
    DEFAULT: "#F44336", // Red
    DELETED: "#E0E0E0", // Light gray
    PALETTE: [
      "#F44336", // Red
      "#E91E63", // Pink
      "#9C27B0", // Purple
      "#FF5722", // Deep Orange
      "#FF9800", // Orange
      "#FFC107", // Amber
      "#795548", // Brown
      "#607D8B", // Blue Grey
    ],
  },
};
