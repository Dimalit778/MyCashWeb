import { MainSkeleton } from "components/main";
import MainLayout from "layout/MainLayout";
import PublicLayout from "layout/PublicLayout";
import Login from "pages/auth/Login";
import SignUp from "pages/auth/SignUp";
import ContactUs from "pages/contact/ContactUs";
import Landing from "pages/landing/Landing";
import Main from "pages/main/Main";
import Settings from "pages/settings/Settings";
import Expenses from "pages/transactions/Expenses";
import Incomes from "pages/transactions/Incomes";
import FinanceSkeleton from "pages/transactions/skeleton/FinanceSkeleton";
import { Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Landing />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="login" element={<Login />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route
            path="main"
            element={
              <Suspense fallback={<MainSkeleton />}>
                <Main />
              </Suspense>
            }
          />
          <Route
            path="expenses"
            element={
              <Suspense fallback={<FinanceSkeleton />}>
                <Expenses />
              </Suspense>
            }
          />
          <Route
            path="incomes"
            element={
              <Suspense fallback={<FinanceSkeleton />}>
                <Incomes />
              </Suspense>
            }
          />
          <Route path="settings" element={<Settings />} />
          <Route path="contact" element={<ContactUs />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
