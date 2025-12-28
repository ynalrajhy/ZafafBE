import dotenv from "dotenv";
dotenv.config();

import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import connectDB from "./config/database";

// Import routes
import authRoutes from "./api/Auth/auth.route";
import eventRoutes from "./api/Events/event.route";
import calendarRoutes from "./api/Calendar /Calendar.route";
import userRoutes from "./api/User/user.route";

// Initialize app
const app: Application = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/users", userRoutes);

// Health check
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "Server is running" });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
