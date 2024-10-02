import { Toaster } from "react-hot-toast";
import RootLayout from "screen/RootLayout";

export default function Dashboard() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            marginTop: "5rem",
            border: "1px solid #713200",
            padding: "13px",
            color: "#713200",
          },
        }}
      />
      <RootLayout />
    </>
  );
}
