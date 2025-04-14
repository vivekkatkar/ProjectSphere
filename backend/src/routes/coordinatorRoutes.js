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


router.post('/batches', guideController.assignBatchAndGuide);

//vivek
// router.post('/notify', authenticateToken, notifyAll);

module.exports = router;