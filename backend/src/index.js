require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const guideAuthRoutes = require("./routes/guideAuthRoutes");
const studentRoutes = require ("./routes/studentRoutes")
const { authenticateToken } = require("./middleware/authMiddleware");
const guideRouter = require("./routes/guideRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/student-auth", authRoutes);
app.use("/guide-auth", guideAuthRoutes);
app.use("/student", studentRoutes);
// Protected route example
// app.get("/profile", authenticateToken, (req, res) => {
//     res.json({ message: "Welcome to your profile", user: req.user });
// });

app.use("/guide" ,guideRouter);

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
