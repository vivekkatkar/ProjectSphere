const prisma = require("../config/prisma");
require("dotenv").config();
const express = require("express");

exports.profile = async (req, res) => {
  try {
    const user = await prisma.guide.findUnique({
      where: {
        email: req.user.email,
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ status: "failed", message: "Guide not found" });
    }

    return res.status(200).json({ status: "Success", data: user });
  } catch (e) {
    return res.status(500).json({
      status: "failed",
      error: e.message,
    });
  }
};

exports.getAllTeams = async (req, res) => {
  try {
    const teams = await prisma.team.findMany({
      where: {
        guideId: req.user.id,
      },
    });

    if (teams.length === 0) {
      return res.status(200).json({
        status: "Success",
        message: "No teams are assigned to the guide",
      });
    }

    return res.status(200).json({ status: "Success", data: teams });
  } catch (e) {
    return res.status(500).json({
      status: "failed",
      error: e.message,
    });
  }
};

exports.getTeam = async (req, res) => {
  const teamId = parseInt(req.params.id);
  try {
    const team = await prisma.team.findFirst({
      where: {
        guideId: req.user.id,
        id: teamId,
      },
    });

    if (!team) {
      return res.status(404).json({
        status: "failed",
        message: "Team not found",
      });
    }

    return res.status(200).json({
      status: "success",
      data: team,
    });
  } catch (e) {
    return res.status(500).json({
      status: "failed",
      error: e.message,
    });
  }
};

// router.get("/teams/:id/ideas", authenticateToken, getIdeas);

exports.getIdeas = async (req, res) => {
  const teamId = parseInt(req.params.id);
  try {
    const ideas = await prisma.idea.findMany({
      where: {
        teamId: teamId,
      },
    });

    if (ideas.length === 0) {
      return res.status(200).json({
        status: "success",
        message: "No ideas submitted",
      });
    }

    return res.status(200).json({
      status: "success",
      data: ideas,
    });
  } catch (e) {
    return res.status(500).json({
      status: "failed",
      error: e.message,
    });
  }
};

// router.post("/teams/:id/idea/:ideaId/status", authenticateToken, updateIdeaStatus);

exports.updateIdeaStatus = async (req, res) => {
  const teamId = parseInt(req.params.teamId);
  const ideaId = parseInt(req.params.ideaId);
  const { accepted, comment } = req.body;

  const allowedStatuses = ["true", "false"];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      status: "failed",
      message: "Invalid status value",
    });
  }

  try {
    const idea = await prisma.idea.findUnique({
      where: {
        id: ideaId,
      },
    });

    if (!idea || idea.teamId !== teamId) {
      return res.status(404).json({
        status: "failed",
        message: "Idea not found for this team",
      });
    }

    const updatedIdea = await prisma.idea.update({
      where: {
        id: ideaId,
      },
      data: {
        accepted,
        comment,
      },
    });

    return res.status(200).json({
      status: "success",
      data: "updatedIdea",
    });
  } catch (e) {
    return res.status(500).json({
      status: "failed",
      error: e.message,
    });
  }
};

// router.get("/teams/:id/reports", authenticateToken, getReports);

exports.getReports = async (req, res) => {
  const teamId = parseInt(req.params.id);
  try {
    const reports = await prisma.report.findMany({
      where: {
        teamId: teamId,
      },
    });

    if (reports.length === 0) {
      return res.status(200).json({
        status: "success",
        message: "No reports available",
      });
    }

    return res.status(200).json({
      status: "success",
      data: reports,
    });
  } catch (e) {
    return res.status(500).json({
      status: "failed",
      error: e.message,
    });
  }
};

// router.get("/teams/:id/synopsis", authenticateToken, getSynopsis);

exports.getSynopsis = async (req, res) => {
  const teamId = req.params.id;
  try {
    const project = await prisma.project.findUnique({
      where: {
        teamId: teamId,
      },
    });

    if (!project.synopsis) {
      return res.status(200).json({
        status: "success",
        message: "No synopsis uploaded",
      });
    }

    // Convert Buffer to base64 string
    const base64Synopsis = project.synopsis.toString("base64");

    return res.status(200).json({
      status: "success",
      data: {
        ...project,
        synopsis: base64Synopsis, // Replace buffer with base64 string
      },
    });
  } catch (e) {
    return res.status(500).json({
      status: "failed",
      error: e.message,
    });
  }
};

// router.post("/teams/:id/synopsis/status", authenticateToken, updateSynopsisStatus);

exports.updateSynopsisStatus = async (req, res) => {
  const teamId = parseInt(req.params.id);
  const { approval } = req.body;

  try {
    const project = await prisma.project.findUnique({
      where: {
        teamId: teamId,
      },
    });

    if (!project.synopsis) {
      return res.status(200).json({
        status: "success",
        message: "No synopsis uploaded",
      });
    }

    const updatedProject = await prisma.project.update({
      where: {
        teamId: teamId,
      },
      data: {
        synopsisApproval: approval,
      },
    });

    return res.status(200).json({
        status: "success",
        data: updatedProject,
    })

  } catch (e) {
    return res.status(500).json({
        status: "failed",
        error: e.message,
      });
  }
};


