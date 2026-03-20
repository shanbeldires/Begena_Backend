const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const classScheduleRoutes = require("./routes/classScheduleRoutes");
const studentRoutes = require("./routes/studentRoutes");
const sectionRoutes = require("./routes/sectionRoutes");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log("Incoming body:", req.body);
  next();
});
const PORT = process.env.PORT || PORT;

// Routes middleware
app.use("/api/auth", authRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/class-schedules", classScheduleRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/sections", sectionRoutes);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Failed to start server:", err);
  }
};

startServer();

module.exports = app;
