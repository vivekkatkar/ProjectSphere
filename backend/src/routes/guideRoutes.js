const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const { route } = require("./authRoutes");
const guideController = require("../controllers/guideController")

const router = express.Router();

// Profile
router.get("/profile", authenticateToken, guideController.profile);

// Teams
router.get("/teams", authenticateToken, guideController.getAllTeams);             
router.get("/teams/:id", authenticateToken, guideController.getTeam);           

// Idea, Report, Synopsis submission
router.get("/teams/:id/ideas", authenticateToken, guideController.getIdeas);        
router.post("/teams/:id/idea/:ideaId/status", authenticateToken, guideController.updateIdeaStatus); 

router.get("/teams/:id/reports", authenticateToken, guideController.getReports);    
// router.post("/teams/:id/report/status", authenticateToken, guideController.updateReportStatus);

router.get("/teams/:id/synopsis", authenticateToken, guideController.getSynopsis);
router.post("/teams/:id/synopsis/status", authenticateToken, guideController.updateSynopsisStatus);

// Notifications
// router.post("/teams/:id/notify", authenticateToken, guideController.notifyTeam);

// LA result update
// router.post("/teams/:id/la-results", authenticateToken, guideController.updateLAResults);



module.exports = router;
