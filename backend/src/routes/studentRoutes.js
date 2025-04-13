const express = require("express");
const { signup, login, profile, createTeam, getAll, addIdea, getAllIdeas, displayAllReports, addReport } = require ('../controllers/studentControllers');
const { authenticateToken } = require("../middleware/authMiddleware");
const {getTeamDetails} = require ("../controllers/studentControllers");
const prisma = require("../config/prisma");
const router = express.Router();
const multer = require("multer");
const upload = multer();

router.get("/profile", authenticateToken, profile);
router.get ("/getAll", authenticateToken, getAll);

// team
router.post ("/createTeam", authenticateToken, createTeam);
router.get ("/team/:id", authenticateToken, getTeamDetails);

router.post('/addIdea', authenticateToken, addIdea);

router.get('/ideas', authenticateToken, getAllIdeas);

router.get('/reports', authenticateToken, displayAllReports);
router.post('/upload', authenticateToken, upload.single("file"), addReport);

// router.get ("/team/:id", authenticateToken, getTeamDetails);

router.get ('post', authenticateToken);

// router.get ("/notification", authenticateToken, getNotifications);

module.exports = router;
