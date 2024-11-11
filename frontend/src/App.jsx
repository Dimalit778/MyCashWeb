import MainSkeleton from "pages/main/skeleton";
import MainLayout from "layout/MainLayout";
import PublicLayout from "layout/PublicLayout";
import Login from "pages/auth/Login";
import SignUp from "pages/auth/SignUp";
import ContactUs from "pages/contact/ContactUs";
import Landing from "pages/landing";
import Main from "pages/main";
import Settings from "pages/settings";
import Transactions from "pages/transactions";
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
            path="transactions/:type"
            element={
              <Suspense fallback={<FinanceSkeleton />}>
                <Transactions />
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
