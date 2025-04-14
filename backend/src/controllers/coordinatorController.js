const prisma = require("../config/prisma");
require("dotenv").config();
const express = require("express");
const router = express.Router();

// router.get('/guides', authenticateToken, getAllGuides);
exports.getAllGuides = async (req, res) => {
  try {
    const guides = await prisma.guide.findMany({
      where: {
        role: "guide",
      },
    });
    res.status(200).json({
      status: "success",
      data: guides,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
};

// router.get('/guide/:id', authenticateToken, getGuideById);
exports.getGuideById = async (req, res) => {
  const { id } = req.params;
  try {
    const guide = await prisma.guide.findUnique({
      where: {
        id: Number(id),
        role: "guide",
      },
    });
    if (!guide) {
      return res.status(404).json({ error: "Guide not found" });
    }
    res.status(200).json({
      status: "success",
      data: guide,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
};

// router.get('/guide/:id/teams', authenticateToken, getGuideTeams);
exports.getGuideTeams = async (req, res) => {
  const { id } = req.params;
  try {
    const teams = await prisma.team.findMany({
      where: {
        guideId: Number(id),
      },
    });
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
};

// router.post('/rubrics', authenticateToken, postRubric);

// router.post('/batches', authenticateToken, assignBatchAndGuide);
exports.assignBatchAndGuide = async (req, res) => {
    const { teamIds, guideIds, semester, year = 0 } = req.body;
  
    if (!teamIds?.length || !guideIds?.length || !semester) {
      return res.status(400).json({ message: "Missing required fields" });
    }
  
    const batchSize = Math.ceil(teamIds.length / guideIds.length);
    const batches = [];
  
    try {
      for (let i = 0; i < guideIds.length; i++) {
        const batchTeams = teamIds.slice(i * batchSize, (i + 1) * batchSize);
        const guideId = guideIds[i];
  
        if (batchTeams.length === 0) break;
  
        const batchName = `T${i + 1}`;
  
        const batch = await prisma.batch.create({
          data: {
            name: batchName,
            semester,
            year,
            guide: {
              connect: { id: guideId },
            },
            students: {
              connect: batchTeams.map((id) => ({ id })),
            },
          },
          include: {
            guide: true,
            students: true,
          },
        });
  
        batches.push(batch);
      }
  
      return res.status(201).json({
        message: "Batches created successfully",
        batches,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Error while creating batches",
        error: err.message,
      });
    }
  };
  
// router.post('/notify', authenticateToken, notifyAll);
