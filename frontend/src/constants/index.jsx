import homeIcon from "assets/icons/homeIcon.svg";
import expenseIcon from "assets/icons/expenseIcon.svg";
import incomeIcon from "assets/icons/incomeIcon.svg";
import contactIcon from "assets/icons/contactIcon.svg";
import settingsIcon from "assets/icons/settingsIcon.svg";
export const sidebarLinks = [
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
