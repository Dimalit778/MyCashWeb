import React from "react";
import "./app.css";
import "./index.css";
import { Navigate, Route, Routes } from "react-router-dom";

//Routes
import HomeRoot from "components/HomeRoot";
import ProtectedRoute from "components/ProtectedRoute";
import AppRoot from "components/AppRoot";
import Settings from "pages/user/Settings";
import ContactUs from "pages/user/ContactUs";
import { Login, SignUp, Welcome } from "pages/welcome";
// Lazy load routes
import { lazy, Suspense } from "react";
import { MainSkeleton } from "components/main";
import FinanceSkeleton from "components/loader/FinanceSkeleton";
const Expenses = lazy(() => import("pages/user/Expenses"));
const Incomes = lazy(() => import("pages/user/Incomes"));
const Main = lazy(() => import("pages/user/Main"));

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRoot />}>
        <Route index element={<Welcome />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="login" element={<Login />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppRoot />}>
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
      </Route>

      {/* Redirect to appropriate route based on auth status */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
