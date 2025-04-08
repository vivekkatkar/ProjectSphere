const express = require("express");
const { signup, login, profile, createTeam, getAll } = require ('../controllers/studentControllers');
const { authenticateToken } = require("../middleware/authMiddleware");
const { route } = require("./authRoutes");

const router = express.Router();

router.get("/profile", authenticateToken, profile);
router.get ("/getAll", authenticateToken, getAll);
router.post ("/createTeam", authenticateToken, createTeam);
router.get("/idea", authenticateToken, getAllIdeas);
router.get ("/weeklyReport", authenticateToken, getAllReports);
router.post ("/weeklyReport/upload", authenticateToken, uploadReport);
router.get ("/notification", authenticateToken, getNotifications);

module.exports = router;
