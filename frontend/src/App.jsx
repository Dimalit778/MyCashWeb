import { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

// Layouts
import MainLayout from "layout/MainLayout";
import PublicLayout from "layout/PublicLayout";

// Components for immediate loading
import MainSkeleton from "components/main/skeleton";
import FinanceSkeleton from "components/transactions/skeleton/TransactionSkeleton";

// Pages
import Landing from "pages/Landing";
import SignUp from "pages/auth/SignUp";
import Login from "pages/auth/Login";
import Settings from "pages/dashboard/Settings";
import ContactUs from "pages/dashboard/ContactUs";
// Lazy loaded components

const Home = lazy(() => import("pages/dashboard/Home"));
const Transactions = lazy(() => import("pages/dashboard/Transactions"));

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
            path="home"
            element={
              <Suspense fallback={<MainSkeleton />}>
                <Home />
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
