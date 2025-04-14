const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const { route } = require("./authRoutes");
const guideController = require("../controllers/guideController");
const prisma = require("../config/prisma");


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

router.get ("/years", authenticateToken, guideController.uniqueYears);
     

// Notifications
router.post("/notify", authenticateToken, async (req, res) => {
  try {
      console.log("hello");
      console.log(req.user);

      const email = req.user.email;

      const guide = await prisma.guide.findFirst({
          where: { email: email }
      });

      if (!guide) {
          return res.status(404).json({ status: "Error", message: "Guide not found" });
      }

      const guideId = guide.id;
      const { message, teamIds } = req.body;

      const notifications = await Promise.all(
          teamIds.map((teamId) =>
              prisma.notification.create({
                  data: {
                      teamId: teamId,
                      from: guideId,
                      message: message,
                      channel: "in-app",
                      status: "pending"
                  }
              })
          )
      );

      console.log(notifications);
      return res.status(200).json({
          status: "Success",
          message: "Message sent successfully",
          notifications,
      });
  } catch (error) {
      console.error(error);
      return res.status(500).json({
          status: "Error",
          message: "Something went wrong",
      });
  }
});

router.post("/notifications/team", authenticateToken, async (req, res) => {
  const email = req.user.email;
  try {
    
    const user = await prisma.student.findFirst({
      where : {
        email
      }
    });
    if(!user){
      user = {
        teamId : 0
      }
    };

    const teamId = user.teamId;

    console.log(user);
    console.log(teamId);

    if (!teamId) {
      return res.status(400).json({
        status: "Error",
        message: "teamId is required",
      });
    }

    const notifications = await prisma.notification.findMany({
      where: {
        teamId: teamId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
      },
    });

    const guideIds = [...new Set(notifications.map((n) => n.from))];

    const guides = await prisma.guide.findMany({
      where: { id: { in: guideIds } },
      select: { id: true, name: true },
    });

    const guideMap = Object.fromEntries(guides.map(g => [g.id, g.name]));

    const mergedNotifications = notifications.map(n => ({
      id: n.id,
      teamId: n.teamId,
      message: n.message,
      channel: n.channel,
      isRead: n.isRead,
      status: n.status,
      sentAt: n.sentAt,
      createdAt: n.createdAt,
      fromId: n.from,
      fromName: guideMap[n.from] || "Unknown",
    }));

    return res.status(200).json({
      status: "Success",
      notifications: mergedNotifications,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res.status(500).json({
      status: "Error",
      message: "Something went wrong while fetching notifications",
    });
  }
});

router.patch("/notifications/:id/read", authenticateToken, async (req, res) => {
  const notificationId = parseInt(req.params.id);

  try {
    const updated = await prisma.notification.update({
      where: { id: notificationId },
      data: {
        isRead: true,
        sentAt: new Date(), 
      },
    });

    return res.status(200).json({
      status: "Success",
      message: "Notification marked as read",
      notification: updated,
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return res.status(500).json({
      status: "Error",
      message: "Failed to mark notification as read",
    });
  }
});

router.post("/team/ideas", authenticateToken, async (req, res) => {
  const { teamId } = req.body;

  try {
    const ideas = await prisma.idea.findMany({
      where: {
        teamId: teamId,
      },
    });

    res.status(200).json({ ideas });
  } catch (error) {
    console.error("Failed to fetch ideas:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/teams/:teamId/idea/:id/status", authenticateToken, async (req, res) => {
  const ideaId = parseInt(req.params.id);
  const teamId = parseInt(req.params.teamId);
  const { comment, status } = req.body;

  let statusCode = 0;
  if (status === "accepted") statusCode = 1;
  else if (status === "rejected") statusCode = 2;

  try {
    const guide = await prisma.guide.findUnique({
      where: {
        email: req.user.email,
      },
    });

    if (!guide) {
      return res.status(404).json({ error: "Guide not found" });
    }

    const updatedIdea = await prisma.idea.update({
      where: { id: ideaId },
      data: {
        comment: comment,
        approved: statusCode,
      },
    });

    await prisma.notification.create({
      data: {
        teamId: teamId,
        from: guide.id,
        message: `Your idea "${updatedIdea.topic}" was ${status}${comment ? ` with comment: ${comment}` : ""}.`,
        channel: "in-app",
        status: "sent",
      },
    });

    if (status === "accepted") {
      const existingProject = await prisma.project.findFirst({
        where: { teamId },
      });

      if (existingProject) {
        await prisma.project.update({
          where: { id: existingProject.id },
          data: {
            topic: updatedIdea.topic,
            synopsisApproval: 0, 
          },
        });
      } else {
        await prisma.project.create({
          data: {
            teamId,
            topic: updatedIdea.topic,
            synopsis: Buffer.from(""), 
            githubLink: "",
            synopsisApproval: 0,
          },
        });
      }
    }

    res.status(200).json({ message: "Idea updated, student notified, and project synced." });
  } catch (error) {
    console.error("Failed to update idea/project:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});




// router.post("/teams/:id/notify", authenticateToken, guideController.notifyTeam);

// LA result update
// router.post("/teams/:id/la-results", authenticateToken, guideController.updateLAResults);


module.exports = router;
