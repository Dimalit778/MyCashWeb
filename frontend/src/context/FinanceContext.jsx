// src/contexts/FinanceContext.js
import React, { createContext, useContext, useState, useMemo } from "react";

import { format } from "date-fns";
import { useGetCategoriesQuery } from "api/slicesApi/userApiSlice";
import { useGetMonthlyTransactionsQuery } from "api/slicesApi/transactionsApiSlice";

const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const [date, setDate] = useState(new Date());
  const formattedDate = useMemo(() => format(date, "yyyy-MM-dd"), [date]);

  const { data: categoriesData } = useGetCategoriesQuery();
  const { data: expenseData, isLoading: expenseLoading } = useGetMonthlyTransactionsQuery({
    date: formattedDate,
    type: "Expense",
  });
  const { data: incomeData, isLoading: incomeLoading } = useGetMonthlyTransactionsQuery({
    date: formattedDate,
    type: "Income",
  });

  const value = {
    date,
    setDate,
    categoriesData,
    expenseData,
    incomeData,
    isLoading: expenseLoading || incomeLoading,
  };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
};

export const useFinance = () => useContext(FinanceContext);
