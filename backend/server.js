import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import routes from "./routes/routes.js"; // your unified routes file

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Connect to MongoDB
connectDB(process.env.MONGODB_URI || "mongodb://localhost:27017/housery_pos");

// API routes
app.use("/api", routes);

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Error handlers
app.use(notFound);
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
