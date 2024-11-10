import homeIcon from "assets/icons/homeIcon.svg";
import expenseIcon from "assets/icons/expenseIcon.svg";
import incomeIcon from "assets/icons/incomeIcon.svg";
import contactIcon from "assets/icons/contactIcon.svg";
import settingsIcon from "assets/icons/settingsIcon.svg";
export const appLinks = [
  {
    imgURL: homeIcon,
    route: "/main",
    label: "Home",
  },
  {
    imgURL: expenseIcon,
    route: "/expenses",
    label: "Expense",
  },
  {
    imgURL: incomeIcon,
    route: "/incomes",
    label: "Income",
  },
  {
    imgURL: contactIcon,
    route: "/contact",
    label: "Contact",
  },
  {
    imgURL: settingsIcon,
    route: "/settings",
    label: "Setting",
  },
];
export const Theme = {
  red: "#f8876d",
  dark: "#343a40",
  secondary: "#6c757d",
  light: "#ECDFCC",
  orange: "#fd7e14",
  cardLinear: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
};
