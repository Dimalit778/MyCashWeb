async function handlePasswordUpdate(user, currentPassword, newPassword) {
  // If either password field is provided, both must be present
  if ((!newPassword && currentPassword) || (newPassword && !currentPassword)) {
    throw new Error("Please provide both current password and new password");
  }

  // If no password update is requested, return
  if (!currentPassword && !newPassword) {
    return false;
  }
  console.log("user", user);
  console.log("currentPassword", currentPassword);
  console.log("newPassword", newPassword);
  // Validate current password
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  console.log("isMatch", isMatch);
  if (!isMatch) {
    throw new Error("Current password is incorrect");
  }

  // Validate new password
  if (newPassword.length < 6) {
    throw new Error("New password must be at least 6 characters long");
  }

  // Hash and set new password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  return false;
}
export default handlePasswordUpdate;
