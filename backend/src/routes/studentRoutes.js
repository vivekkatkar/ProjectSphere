const express = require("express");
const { signup, login, profile, createTeam, getAll, addIdea, getAllIdeas, displayAllReports, addReport, getTeamMarks } = require ('../controllers/studentControllers');
const { authenticateToken } = require("../middleware/authMiddleware");
const {getTeamDetails} = require ("../controllers/studentControllers");
const prisma = require("../config/prisma");
const router = express.Router();
const { report } = require("./studentRoutes");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.get("/profile", authenticateToken, profile);
router.get ("/getAll", authenticateToken, getAll);

// team
router.post ("/createTeam", authenticateToken, createTeam);
router.get ("/team/:id", authenticateToken, getTeamDetails);

router.post('/addIdea', authenticateToken, addIdea);

router.post('/ideas', authenticateToken, getAllIdeas);

router.get('/reports/:id', authenticateToken, displayAllReports);
router.post('/upload', authenticateToken, upload.single("file"), addReport);

router.post ('/synopsisUpload', authenticateToken, upload.single("file"), async (req, res) => { 
    try {
        const teamId = parseInt(req.body.teamId);
        const {topic } = req.body;
        const fileBuffer = req.file.buffer;
        console.log (req.body);
        const report1 = await prisma.project.findFirst({
          where: { teamId: parseInt(teamId) },
        });

        if (!report1) {
          const report = await prisma.project.create({
            data: {
              team: {
                connect: { id: 1 }
              },
              synopsis: Buffer.alloc(414004),
              synopsisApproval: 0,
              comments: "",
              topic: "",
              githubLink: "",
            }
          });
          
          return res.status(200).json({ message: "File uploaded successfully", report });
        }
        else{
          const report = await prisma.project.update({
              where: { teamId: parseInt(teamId), id : report1.id },
              data: {
                  synopsis: fileBuffer,
                  synopsisApproval: 0,
                  comments: "",
              },
          });
          return res.status(200).json({ message: "File uploaded successfully", report });
        }
    } catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).json({ message: "Internal server error" });
    } 
});


router.get("/synopsis/:id", authenticateToken, async (req, res) => {
  console.log("fetching synopsis");
  console.log(req.params.id);
  const teamId = parseInt(req.params.id);
  try {
    const report = await prisma.project.findFirst({
      where: { teamId },
    });

    if (!report || !report.synopsis) {
      return res.status(404).json({ message: "File not found" });
    }

    const base64File = Buffer.from(report.synopsis).toString("base64");

    res.status(200).json({
      status: "success",
      message: "Details fetched successfully!",
      details: {
        file: base64File,
        synopsisApproval: report.synopsisApproval,
        comments: report.comments,
      },
    });
  } catch (error) {
    console.error("Error viewing synopsis:", error);
    res.status(500).json({
      status: "failed",
      message: "Failed to fetch synopsis details!",
    });
  }
});



router.post("/updateSynopsisReview", authenticateToken, async (req, res) => {
    try {
      const { teamId, status, comments } = req.body;

      const project = await prisma.project.findFirst({
        where: { teamId: parseInt(teamId) },
      });

      if (!project) {
        return res.status(404).json({ message: "Synopsis not found for this team" });
      }

      // Update the synopsis review fields.
      const updatedProject = await prisma.project.update({
        where: { id: project.id },
        data: {
          synopsisApproval: status,
          comments: comments || "",
        },
      });

      return res
        .status(200)
        .json({ message: "Synopsis review updated successfully", project: updatedProject });
    } catch (error) {
      console.error("Error updating synopsis review:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// router.get ("/team/:id", authenticateToken, getTeamDetails);

// Removed invalid route definition

router.get("/report/:id/view", async (req, res) => {
    try {
      const report = await prisma.report.findUnique({
        where: { id: parseInt(req.params.id) },
      });
  
      if (!report || !report.file) {
        return res.status(404).send("Report not found or file is missing");
      }
  
      const fileBuffer = Buffer.isBuffer(report.file)
        ? report.file
        : Buffer.from(report.file);
  
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `inline; filename="report_${report.id}.pdf"`);
      res.setHeader("Content-Length", fileBuffer.length); // optional, helps iframe
      res.send(fileBuffer);
    } catch (error) {
      console.error("Error viewing report:", error);
      res.status(500).send("Internal Server Error");
    }
  });
  

  router.get("/report/:id/download", async (req, res) => {
    try {
      const reportId = parseInt(req.params.id);
      const report = await prisma.report.findUnique({
        where: { id: reportId },
      });
  
      if (!report || !report.file) {
        return res.status(404).send("Report not found or file is missing");
      }
  
      const fileBuffer = Buffer.isBuffer(report.file)
        ? report.file
        : Buffer.from(report.file);
  
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="report_${report.id}.pdf"`);
      res.setHeader("Content-Length", fileBuffer.length);
      res.send(fileBuffer);
    } catch (error) {
      console.error("Error downloading report:", error);
      res.status(500).send("Internal Server Error");
    }
  });
  

// router.get ("/notification", authenticateToken, getNotifications);

// Get LA marks
router.get("/marks", authenticateToken, getTeamMarks);   

module.exports = router;
