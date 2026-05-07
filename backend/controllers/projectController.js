const Project = require("../models/projectModel");

// Create Project
exports.createProject = async (req, res) => {
  try {
    const project = await Project.create({
      name: req.body.name,
      description: req.body.description,
      owner: req.user.id,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get all projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      owner: req.user.id,
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
      owner: req.user.id,
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
//         owner: req.user.id,
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
      owner: req.user.id,
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