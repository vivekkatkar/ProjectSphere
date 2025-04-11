const express = require("express");
const { signup, login, profile, createTeam, getAll } = require ('../controllers/studentControllers');
const { authenticateToken } = require("../middleware/authMiddleware");
const { route } = require("./authRoutes");
const {getTeamDetails} = require ("../controllers/studentControllers");
const prisma = require("../config/prisma");
const router = express.Router();


router.get("/profile", authenticateToken, profile);
router.get ("/getAll", authenticateToken, getAll);

// team
router.post ("/createTeam", authenticateToken, createTeam);
router.get ("/team/:id", authenticateToken, getTeamDetails);

router.post('/addIdea', authenticateToken, async (req, res) => {
    console.log("Inside Add idea");
    try {
      const email = req.user.email;
      const student = await prisma.student.findUnique({
        where: { email },
      });
      
      console.log("Fetched student data", student);

      if (!student || !student.teamId) {
        return res.status(400).json({ message: "Student or team not found" });
      }
  
      const { topic } = req.body;
      
      console.log("Extracted topic ", topic);

      if (!topic || topic.trim() === "") {
        return res.status(400).json({ message: "Topic is required" });
      }
      
      console.log("started data insertion");
      const newIdea = await prisma.idea.create({
        data: {
          topic,
          comment: "",         // Empty for now, will be updated by guide later
          approved: 0,         // 0 -> pending
          teamId: student.teamId,
        },
      });
  
      return res.status(201).json({
        status: "Success",
        message: "Idea submitted successfully",
        idea: newIdea,
      });
  
    } catch (error) {
      console.error("Error submitting idea:", error);
      return res.status(500).json({
        status: "Error",
        message: "Failed",
      });
    }
  });

  router.post('/ideas', authenticateToken, async (req, res) => {
    try {
      const email = req.user.email;
  
      const student = await prisma.student.findUnique({
        where: { email },
      });
  
      if (!student || !student.teamId) {
        return res.status(404).json({ message: "Student or team not found" });
      }
  
      const ideas = await prisma.idea.findMany({
        where: {
          teamId: student.teamId,
        },
      });
  
      return res.status(200).json({
        status: "Success",
        ideas,
      });
  
    } catch (error) {
      console.error("Error fetching student ideas:", error);
      return res.status(500).json({
        status: "Error",
        message: "Failed to fetch student ideas",
      });
    }
  });

router.get ('post', authenticateToken);

// router.get("/idea", authenticateToken, getAllIdeas);
// router.get ("/weeklyReport", authenticateToken, getAllReports);
// router.post ("/weeklyReport/upload", authenticateToken, uploadReport);
// router.get ("/notification", authenticateToken, getNotifications);

module.exports = router;
