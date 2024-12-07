import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectMongoDB from "./db/connectDB.js";
import bodyParser from "body-parser";
// Routes
import authRoutes from "./routes/authRoute.js";
import userRoutes from "./routes/userRoute.js";
import transactionRoutes from "./routes/transactionsRoute.js";
import categoryRoutes from "./routes/categoryRoute.js";
// Middleware
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
    origin: ["http://localhost:3000"], // your frontend URL
    credentials: true, // this is important for sending cookies
    optionsSuccessStatus: 200,
  })
);

// app.set("trust proxy", 1);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", protectRoute, userRoutes);
app.use("/api/transactions", protectRoute, transactionRoutes);
app.use("/api/categories", protectRoute, categoryRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectMongoDB();
});
