const express = require("express");
const router = express.Router();
const {
  createTask,
  getProjectTasks,
  getUserTasks,
  getDashboardTasks,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const authMiddleware = require("../middlewares/auth");

router.use(authMiddleware);

router.post("/", createTask);
router.get("/my-tasks", getUserTasks);
router.get("/all-tasks", getDashboardTasks);
router.get("/project/:projectId", getProjectTasks);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
