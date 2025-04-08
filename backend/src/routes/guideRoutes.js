const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const { route } = require("./authRoutes");

const router = express.Router();

// Profile
router.get("/profile", authenticateToken, profile);

// Teams
router.get("/teams", authenticateToken, getAllTeams);             
router.get("/teams/:id", authenticateToken, getTeam);           

// Idea, Report, Synopsis submission
router.get("/teams/:id/ideas", authenticateToken, getIdeas);        
router.post("/teams/:id/idea/:ideaId/status", authenticateToken, updateIdeaStatus); 

router.get("/teams/:id/reports", authenticateToken, getReports);    
// router.post("/teams/:id/report/status", authenticateToken, updateReportStatus);

router.get("/teams/:id/synopsis", authenticateToken, getSynopsis);
router.post("/teams/:id/synopsis/status", authenticateToken, updateSynopsisStatus);

// Notifications
router.post("/teams/:id/notify", authenticateToken, notifyTeam);

// LA result update
router.post("/teams/:id/la-results", authenticateToken, updateLAResults);



module.exports = router;
