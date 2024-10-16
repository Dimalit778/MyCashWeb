let navigateFunction;

export const setNavigate = (nav) => {
  navigateFunction = nav;
};

export const getNavigate = () => {
  if (!navigateFunction) {
    throw new Error("Navigate function not set. Ensure setNavigate is called before using navigation.");
  }
  return navigateFunction;
};
