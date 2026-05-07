const Task = require("../models/taskModel");
const Project = require("../models/projectModel");

// Create Task
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, assignedTo, projectId } = req.body;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Only admin can create tasks
    if (project.admin.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only project admin can create tasks" });
    }

    // Verify assignedTo is a member of the project
    if (assignedTo && !project.members.includes(assignedTo)) {
      return res.status(400).json({ message: "Assigned user is not a member of this project" });
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      assignedTo,
      project: projectId,
      createdBy: req.user.id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all tasks for a project
exports.getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Verify user is a member of the project
    if (!project.members.includes(req.user.id)) {
      return res.status(403).json({ message: "Not authorized to view tasks for this project" });
    }

    const tasks = await Task.find({ project: projectId }).populate("assignedTo", "name email");

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const project = await Project.findById(task.project);

    // Only admin or assigned user can update status
    // But for general updates, maybe only admin?
    // Let's allow admin for all, and assignedTo for status.
    const isAdmin = project.admin.toString() === req.user.id;
    const isAssigned = task.assignedTo && task.assignedTo.toString() === req.user.id;

    if (!isAdmin && !isAssigned) {
      return res.status(403).json({ message: "Not authorized to update this task" });
    }

    // If not admin, can only update status
    if (!isAdmin && isAssigned) {
      const allowedUpdates = ["status"];
      const requestedUpdates = Object.keys(updates);
      const isUpdateAllowed = requestedUpdates.every((update) => allowedUpdates.includes(update));

      if (!isUpdateAllowed) {
        return res.status(403).json({ message: "Assigned users can only update task status" });
      }
    }

    // If updating assignedTo, verify it's a member
    if (updates.assignedTo && !project.members.includes(updates.assignedTo)) {
      return res.status(400).json({ message: "Assigned user is not a member of this project" });
    }

    const updatedTask = await Task.findByIdAndUpdate(id, updates, { new: true });

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const project = await Project.findById(task.project);

    // Only admin can delete tasks
    if (project.admin.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only project admin can delete tasks" });
    }

    await Task.findByIdAndDelete(id);

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all tasks assigned to the current user
exports.getUserTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id })
      .populate("project", "name admin")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all tasks for projects the user is a member of
exports.getDashboardTasks = async (req, res) => {
  try {
    // 1. Find all projects user belongs to
    const projects = await Project.find({ members: req.user.id });
    const projectIds = projects.map(p => p._id);

    // 2. Find all tasks for those projects
    const tasks = await Task.find({ project: { $in: projectIds } })
      .populate("project", "name admin")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
