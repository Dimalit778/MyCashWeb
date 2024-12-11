import jwt from "jsonwebtoken";
import User from "../models/userSchema.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
export const protectRoute = asyncHandler(async (req, res, next) => {
  const { token, refreshToken } = req.cookies;

  // If access token exists, verify it
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.TOKEN);
      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        throw new ApiError(401, "Unauthorized: User not found");
      }

      req.user = user;
      return next();
    } catch (error) {
      // Token verification failed, continue to refresh token logic
      console.log("Access token verification failed:", error.message);
    }
  }

  // No token or token verification failed - try refresh token
  if (!refreshToken) {
    throw new ApiError(401, "Unauthorized: No tokens available");
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user || user.refreshToken !== refreshToken) {
      throw new ApiError(401, "Unauthorized: Invalid refresh token");
    }

    // Generate new access token
    const newAccessToken = jwt.sign({ userId: user._id }, process.env.TOKEN, { expiresIn: process.env.TOKEN_EXPIRY });

    // Set new access token in cookie
    res.cookie("token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
    });

    // Set user in request and continue
    req.user = user;
    return next();
  } catch (error) {
    // Clear cookies and throw error
    res.clearCookie("token");
    res.clearCookie("refreshToken");
    throw new ApiError(401, "Invalid refresh token");
  }
});
