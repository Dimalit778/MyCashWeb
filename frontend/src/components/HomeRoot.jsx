import useAuth from "hooks/useAuth";
import { Helmet } from "react-helmet";
import { Toaster } from "react-hot-toast";
import { Navigate, Outlet } from "react-router-dom";
import TopBar from "./bars/TopBar";
const HomeRoot = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/main" replace />;
  }
  return (
    <div className="homeRoot min-vh-100">
      <Helmet>
        <title>MyCash</title>
      </Helmet>
      <Toaster position="top-right" toastOptions={{ duration: 3000, style: { marginTop: "5rem" } }} />
      <TopBar className="sticky-top" />

      <Outlet />
    </div>
  );
};
export default HomeRoot;
