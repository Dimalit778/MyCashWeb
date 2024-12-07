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
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// CORS configuration
app.use(
  cors({
    origin: ["http://localhost:3000/"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", protectRoute, userRoutes);
app.use("/api/transactions", protectRoute, transactionRoutes);
app.use("/api/categories", protectRoute, categoryRoutes);
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
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
