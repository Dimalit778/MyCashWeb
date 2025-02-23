export const customUserFields = (user) => {
  console.log("customUserFields", user);
  return {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    subscription: user.subscription,
    imageUrl: user.imageUrl,
    role: user.role,
  };
};
