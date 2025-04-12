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

router.get('/report/:id/download', authenticateToken, async (req, res) => {
    const reportId = parseInt(req.params.id);
    try {
      const report = await prisma.report.findUnique({
        where: { id: reportId },
      });
  
      if (!report) {
        return res.status(404).send('Report not found');
      }
  
      res.setHeader('Content-Type', 'application/pdf'); // or detect dynamically
      res.setHeader('Content-Disposition', `attachment; filename=report-${reportId}.pdf`);
      res.end(report.file);
    } catch (error) {
      console.error(error);
      res.status(500).send('Failed to download report');
    }
  });

// router.get ("/team/:id", authenticateToken, getTeamDetails);

router.get ('post', authenticateToken);

// router.get ("/notification", authenticateToken, getNotifications);

module.exports = router;
