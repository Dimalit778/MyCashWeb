import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: false,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    domain: "http://localhost:3000",
  });

  return token;
};

export const generateRefreshToken = (res, id) => {
  const refToken = jwt.sign({ id }, process.env.REFRESH_JWT, {
    expiresIn: "30d",
  });
  res.cookie("refToken", refToken, {
    path: "/",
    httpOnly: true,
    sameSite: "None", // Prevent CSRF attacks
    secure: true, // Use secure cookies in production
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};
