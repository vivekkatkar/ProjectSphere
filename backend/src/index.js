require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require ("./routes/studentRoutes")
const { authenticateToken } = require("./middleware/authMiddleware");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/auth", authRoutes);
app.use("/student", studentRoutes);
// Protected route example
app.get("/profile", authenticateToken, (req, res) => {
    res.json({ message: "Welcome to your profile", user: req.user });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
