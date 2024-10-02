import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";
import transactionsRoute from "./routes/transactionsRoute.js";

import connectMongoDB from "./db/connectDB.js";
import bodyParser from "body-parser";
import { protectRoute } from "./middleware/protectRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

// Middleware
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true })); // to parse form data(urlencoded)
app.use(bodyParser.json());

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:3000", // your frontend URL
    // origin: "https://mzrc1wcg-3000.euw.devtunnels.ms",
    credentials: true, // this is important for sending cookies
    optionsSuccessStatus: 200,
  })
);

// app.set("trust proxy", 1);

// Routes
app.use("/api/users", protectRoute, userRoute);
app.use("/api/auth", authRoute);
app.use("/api/transactions", protectRoute, transactionsRoute);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectMongoDB();
});
