import React, { useEffect } from "react";
import "./app.css";
import "./index.css";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Admin from "pages/admin/Admin";
import { ContactUs, Expenses, Incomes, Main, Settings } from "pages/user";
import { Login, SignUp, Welcome } from "pages/welcome";

import AppRoot from "components/AppRoot";
import ProtectedRoute from "components/ProtectedRoute";
import { setNavigate } from "utils/navigate";
import HomeRoot from "components/HomeRoot";
import { useSelector } from "react-redux";
import { isAuthenticated } from "store/authSlice";

function App() {
  const navigate = useNavigate();
  const auth = useSelector(isAuthenticated);
  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  return (
    <Routes>
      {!auth && (
        <Route path="/" element={<HomeRoot />}>
          <Route index element={<Welcome />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<SignUp />} />
        </Route>
      )}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppRoot />}>
          <Route path="main" element={<Main />} />
          <Route path="admin" element={<Admin />} />
          <Route path="settings" element={<Settings />} />
          <Route path="contact" element={<ContactUs />} />

          <Route path="expenses" element={<Expenses />} />
          <Route path="incomes" element={<Incomes />} />
        </Route>
      </Route>

      {/* Redirect to appropriate route based on auth status */}
      <Route path="*" element={isAuthenticated ? <Navigate to="/main" replace /> : <Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
