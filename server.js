const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const app = express();

dotenv.config();

// Routes
const userRoutes = require("./routes/auth");
const flatRoutes = require("./routes/flat-details");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static files
app.use(express.static(path.join(__dirname, "frontend")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API routes
app.use("/api", userRoutes);
app.use("/api/flats-details", flatRoutes); // fixed spelling from deatils -> details

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log("MongoDB connected successfully.");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
