const Project = require("../models/projectModel");
const User = require("../models/userModel");

// Create Project
exports.createProject = async (req, res) => {
  try {
    const project = await Project.create({
      name: req.body.name,
      description: req.body.description,
      admin: req.user.id,
      members: [req.user.id],
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get user's projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      members: req.user.id,
    });

    res.json(projects);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get single project
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      admin: req.user.id,
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update project
// exports.updateProject = async (req, res) => {
//   try {
//     const project = await Project.findOneAndUpdate(
//       {
//         _id: req.params.id,
//         admin: req.user.id,
//       },
//       req.body,
//       { new: true }
//     );

//     res.json(project);
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// Delete project
exports.deleteProject = async (req, res) => {
  try {
    await Project.findOneAndDelete({
      _id: req.params.id,
      admin: req.user.id,
    });

    res.json({
      message: "Project deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//add member to project
exports.addMember = async (req, res) => {
  try {
    const { userId } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Only admin can add members
    if (project.admin.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Only admin can add members",
      });
    }

    // Prevent duplicates
    if (project.members.includes(userId)) {
      return res.status(400).json({
        message: "User already a member",
      });
    }

    project.members.push(userId);

    await project.save();

    res.json(project);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//remove member
exports.removeMember = async (req, res) => {
  try {
    const { userId } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Only admin
    if (project.admin.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Only admin can remove members",
      });
    }

    project.members = project.members.filter(
      (member) => member.toString() !== userId
    );

    await project.save();

    res.json(project);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};