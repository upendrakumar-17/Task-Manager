const express = require("express");
const router = express.Router();

const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
   removeMember,
} = require("../controllers/projectController");

const authMiddleware = require("../middlewares/auth");

router.post("/", authMiddleware, createProject);

router.get("/", authMiddleware, getProjects);

router.get("/:id", authMiddleware, getProjectById);

// router.put("/:id", authMiddleware, updateProject);

router.delete("/:id", authMiddleware, deleteProject);

router.put("/:id/add-member", authMiddleware, addMember);

router.put("/:id/remove-member", authMiddleware, removeMember);

module.exports = router;