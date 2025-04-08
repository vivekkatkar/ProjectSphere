const express = require("express");
const { signup, login, profile, createTeam, getAll } = require ('../controllers/studentControllers');
const { authenticateToken } = require("../middleware/authMiddleware");
const { route } = require("./authRoutes");
const {getTeamDetails} = require ("../controllers/studentControllers")
const router = express.Router();

router.get("/profile", authenticateToken, profile);
router.get ("/getAll", authenticateToken, getAll);

// team
router.post ("/createTeam", authenticateToken, createTeam);
router.get ("/team/:id", authenticateToken, getTeamDetails);

router.get("/idea", authenticateToken);
router.get ("/weeklyReport", authenticateToken);
router.get ("/notification", authenticateToken);
router.post ('/addIdea', authenticateToken);
router.get ('post', authenticateToken);

module.exports = router;
