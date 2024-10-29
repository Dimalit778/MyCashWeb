let navigate = null;

export const setNavigate = (navigateFunc) => {
  navigate = navigateFunc;
};

export const getNavigate = () => {
  if (!navigate) {
    throw new Error("Navigation function not initialized. Call setNavigate first.");
  }
  return navigate;
};
