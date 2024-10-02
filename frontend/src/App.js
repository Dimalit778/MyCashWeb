import React, { useEffect } from "react";
import "./app.css";

import "bootstrap/dist/css/bootstrap.css";
import { Navigate, Route, createRoutesFromElements, useLocation } from "react-router-dom";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import NotFound from "screen/NotFound";
import Admin from "screen/admin/Admin";

import { ContactUs, Expenses, Incomes, Main, Settings } from "screen/user";
import { About, EmailVerify, ForgotPassword, Home, Login, ResetPassword, SignUp } from "screen/welcome";

import RootLayout from "screen/RootLayout";
import WelcomeRoot from "screen/WelcomeRoot";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "api/slicesApi/authSlice";

function App() {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (!storedUserInfo && userInfo) {
      dispatch(logout());
    }
  }, [dispatch, userInfo]);

  const ProtectedRoute = ({ children }) => {
    const location = useLocation();
    if (!userInfo) {
      return <Navigate to="/" state={{ from: location }} replace />;
    }
    return children;
  };

  const PublicRoute = ({ children }) => {
    if (userInfo) {
      return <Navigate to="/main" replace />;
    }
    return children;
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="">
        <Route
          element={
            <PublicRoute>
              <WelcomeRoot />
            </PublicRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="/api/auth/verify-email/:emailToken" element={<EmailVerify />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/api/auth/reset-password/:id/:token" element={<ResetPassword />} />
          <Route path="register" element={<SignUp />} />
          <Route path="about" element={<About />} />
        </Route>
        <Route
          element={
            <ProtectedRoute>
              <RootLayout />
            </ProtectedRoute>
          }
        >
          <Route path="main" element={<Main />} />
          <Route path="admin" element={<Admin />} />
          <Route path="settings" element={<Settings />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="incomes" element={<Incomes />} />
          <Route path="contact" element={<ContactUs />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
