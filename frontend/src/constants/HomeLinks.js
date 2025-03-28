import homeIcon from "assets/icons/homeIcon.svg";
import expenseIcon from "assets/icons/expenseIcon.svg";
import incomeIcon from "assets/icons/incomeIcon.svg";
import contactIcon from "assets/icons/contactIcon.svg";
import settingsIcon from "assets/icons/settingsIcon.svg";

export const HOME_LINKS = [
  {
    imgURL: homeIcon,
    route: "/home",
    label: "Home",
    dataCy: "link-home",
  },
  {
    imgURL: expenseIcon,
    route: "/transactions/expenses",
    label: "Expenses",
    dataCy: "link-expenses",
  },
  {
    imgURL: incomeIcon,
    route: "/transactions/incomes",
    label: "Incomes",
    dataCy: "link-incomes",
  },
  {
    imgURL: contactIcon,
    route: "/contact",
    label: "Contact",
    dataCy: "link-contact",
  },
  {
    imgURL: settingsIcon,
    route: "/settings",
    label: "Settings",
    dataCy: "link-settings",
  },
];
