import WelcomeNavBar from "components/bars/WelcomeNavbar";
import Footer from "components/footer/footer";
import { Helmet } from "react-helmet";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";
const WelcomeRoot = () => {
  return (
    <div className="homeRoot">
      <Helmet>
        <title>MyCash</title>
      </Helmet>
      <Toaster position="top-right" toastOptions={{ duration: 3000, style: { marginTop: "5rem" } }} />
      <WelcomeNavBar />
      <Outlet />
      <Footer />
    </div>
  );
};
export default WelcomeRoot;
