import React from "react";

export default function Toaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: { marginTop: "5rem" },
      }}
    />
  );
}
