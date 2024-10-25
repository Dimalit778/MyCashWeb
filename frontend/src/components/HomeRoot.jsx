import { Helmet } from "react-helmet";
import { Toaster } from "react-hot-toast";
import { Navigate, Outlet } from "react-router-dom";
import TopBar from "./bars/TopBar";
import { useSelector } from "react-redux";
import { currentUser } from "store/authSlice";
const HomeRoot = () => {
  const user = useSelector(currentUser);

  if (user) {
    return <Navigate to="/main" replace />;
  }
  return (
    <div className="bg-black min-vh-100">
      <Helmet>
        <title>MyCash</title>
      </Helmet>
      <Toaster position="top-right" toastOptions={{ duration: 3000, style: { marginTop: "5rem" } }} />
      <TopBar className="sticky-top" />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};
export default HomeRoot;
