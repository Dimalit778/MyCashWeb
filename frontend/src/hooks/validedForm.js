const validEmail = (email) => {
  const valid = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
  if (valid) return true;
  return false;
};

export { validEmail };
