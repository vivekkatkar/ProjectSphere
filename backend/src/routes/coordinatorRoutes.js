const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const guideController = require("../controllers/coordinatorController");
const prisma = require("../config/prisma");

const router = express.Router();

//add authentication middleware to all routes
router.get('/guides', guideController.getAllGuides);
router.get('/guide/:id', guideController.getGuideById);
router.get('/guide/:id/teams', guideController.getGuideTeams);

//vaishnavi
// router.post('/rubrics', authenticateToken, postRubric);
router.get("/all-teams", async (req, res)=>{
  try {
    const teams = await prisma.team.findMany({});
    if (!teams) {
      return res.status(404).json({ error: "Teams not found" });
    }
    res.status(200).json({
      status: "success",
      data: teams,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/assign-guide", async (req, res) => {
    try {
      const { teamId, semester, guideId } = req.body;
      
      if (!teamId || !semester || !guideId) {
        return res.status(400).json({
          error: "Missing required fields: teamId, semester, or guideId"
        });
      }
      
      // Update the team with the assigned guide
      const updatedTeam = await prisma.team.update({
        where: {
          id_semester: {
            id: parseInt(teamId),
            semester: parseInt(semester)
          }
        },
        data: {
          guideId: parseInt(guideId)
        }
      });
      
      return res.status(200).json({
        message: "Guide assigned successfully",
        data: updatedTeam
      });
    } catch (error) {
      console.error("Error assigning guide:", error);
      return res.status(500).json({
        error: "Failed to assign guide to team"
      });
    }
}); 

router.post('/batches', guideController.assignBatchAndGuide);

//vivek
// router.post('/notify', authenticateToken, notifyAll);

module.exports = router;