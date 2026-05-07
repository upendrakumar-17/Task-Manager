# Backend System Analysis - Task Manager

This document provides a comprehensive analysis of the backend architecture, file structure, and functionality of the Task Manager application.

## 1. Project Overview
The backend is built using **Node.js**, **Express**, and **MongoDB** (via Mongoose). It implements a RESTful API for user authentication, project management, and task tracking. CORS is configured to allow requests from `http://localhost:3000`.

---

## 2. File Structure Analysis

### **Root Directory**
- **`server.js`**: The entry point of the application.
    - Initializes the Express app.
    - Loads environment variables using `dotenv`.
    - Configures CORS to allow requests from `http://localhost:3000` with credentials enabled.
    - Connects to the database via `config/database.js`.
    - Mounts middleware: `express.json()` for parsing request bodies.
    - Mounts routes: `/api/users`, `/api/projects`, and `/api/tasks`.
    - Includes a root endpoint: `GET /` that returns 'Backend is live.'
    - Listens on the specified `PORT`.

### **`config/`**
- **`database.js`**: Handles the connection to MongoDB.
    - `connectDB`: An asynchronous function that uses `mongoose.connect` with the `MONGODB_URI` from the environment.

### **`controllers/`**
This directory contains the logic for handling API requests.

#### **`userController.js`**
- `registerUser`: Handles user registration. Checks if a user already exists, hashes the password using bcryptjs, and creates a new user record. Returns user ID and email.
- `loginUser`: Handles user login. Verifies credentials and generates a JWT token (valid for 1 day) upon success. Returns user ID, email, and authentication token.

#### **`projectController.js`**
- `createProject`: Creates a new project. Sets the authenticated user as the `admin` and adds them to the `members` list. Returns the created project.
- `getProjects`: Fetches all projects where the authenticated user is a member.
- `getProjectById`: Fetches a specific project by ID. Only returns the project if the user is the admin.
- `deleteProject`: Deletes a project by ID. Only project admin can delete.
- `addMember`: Allows the project `admin` to add other users to the project by their `userId`. Prevents duplicate members.
- `removeMember`: Allows the project `admin` to remove members from the project.
- `updateProject`: (Commented out) Was intended to update project details.
# **`taskController.js`**
- `createTask`: Creates a new task for a project. Only project admin can create tasks. Validates that the assigned user is a project member. Returns the created task.
- `getProjectTasks`: Fetches all tasks for a specific project. Only project members can view tasks. Populates assigned user info (name and email).
- `updateTask`: Updates task details. Admin can update any field; assigned users can only update task status. Validates reassigned users are project members.
- `deleteTask`: Deletes a task. Only project admin can delete tasks.

### **`middlewares/`**
- **`auth.js`**: Contains authentication middleware.
    - `authMiddleware`: Extracts the Bearer token from the `Authorization` header (format: `Bearer TOKEN`), verifies it using `jsonwebtoken`, and attaches the decoded user data to the `req.user` object for subsequent controllers. Responds with 401 if token is missing or invalid
    - `authMiddleware`: Extracts the Bearer token from the `Authorization` header, verifies it using `jsonwebtoken`, and attaches the decoded user data to the `req.user` object for subsequent controllers.

### **`models/`**, default: ""), `admin` (ObjectId, ref: 'User', Required), `members` (Array of ObjectIds, ref: 'User').
- Includes `timestamps` (createdAt, updatedAt).

#### **`taskModel.js`**
- Schema:
  - `title` (String, Required)
  - `description` (String, default: "")
  - `dueDate` (Date, Optional)
  - `priority` (Ss/register` -> `registerUser`
- `POST /api/users/login` -> `loginUser`

#### **`projectRoutes.js`**
- All routes are protected by `authMiddleware`.
- `POST /api/projects/` -> `createProject`
- `GET /api/projects/` -> `getProjects`
- `GET /api/projects/:id` -> `getProjectById`
- `DELETE /api/projects/:id` -> `deleteProject`
- `PUT /api/projects/:id/add-member` -> `addMember`
- `PUT /api/projects/:id/remove-member` -> `removeMember`

#### **`taskRoutes.js`**
- All routes are protected by `authMiddleware`. (not currently used in API).
- **`passHash.js`**: Contains `hashPassword` and `comparePassword` using `bcryptjs`. It conditionally hashes based on the `USE_HASH` environment variable (if `USE_HASH=true`, passwords are hashed with salt 10; otherwise stored as plain text)
- `GET /api/tasks/project/:projectId` -> `getProjectTasks`
- `PUT /api/tasks/:id` -> `updateTask`
- `DELETE /api/tasks/:id` -> `deleteTask
- Schema: `name` (String, Required), `description` (String), `admin` (ObjectId, ref: 'User'), `members` (Array of ObjectIds, ref: 'User').
- Includes `timestamps` (createdAt, updatedAt).

### **`routes/`**
Defines the API endpoints and maps them to controllers.

#### **`userRoutes.js`**
- `POST /api/user/register` -> `registerUser` Tokens expire in 1 day.
2. **Authorization**: 
   - Project admin can add/remove members, create/delete tasks, and view project details.
   - Regular members can view projects and tasks assigned to them.
   - Assigned users can update task status only; admins can update all task fields.
3. **Project Scoping**: Users can only see projects they are members of.
4. **Task Management**: Tasks are scoped to projects with priority levels and status tracking.
5. **DEnvironment Variables Required
- `PORT`: Port number for the server
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for signing JWT tokens
- `USE_HASH`: Boolean flag ("true" or "false") to enable/disable password hashing with bcryptjs
- CORS is hardcoded to `http://localhost:3000`

## 5. Current Status
- **Fully Implemented Features**:
  - User authentication (register/login)
  - Project CRUD operations with role-based access
  - Task management with admin and member permissions
  - Member management for projects
  - JWT-based authorization
  
- **Commented/Not Implemented**:
  - `updateProject` endpoint (commented out in `projectController.js`)
  - `generateOTP` function from `utils/otp.js` is not used in the current API
- `POST /api/projects/` -> `createProject`
- `GET /api/projects/` -> `getProjects`
- `GET /api/projects/:id` -> `getProjectById`
- `DELETE /api/projects/:id` -> `deleteProject`
- `PUT /api/projects/:id/add-member` -> `addMember`
- `PUT /api/projects/:id/remove-member` -> `removeMember`

### **`utils/`**
- **`otp.js`**: `generateOTP` function to create a 6-digit random code.
- **`passHash.js`**: Contains `hashPassword` and `comparePassword` using `bcryptjs`. It conditionally hashes based on the `USE_HASH` environment variable.

---

## 3. Key Functionalities
1. **Authentication**: Uses JWT (JSON Web Tokens) for secure access to protected routes.
2. **Authorization**: Ensures only the project admin can add or remove members.
3. **Project Scoping**: Users can only see projects they are members of.
4. **Data Integrity**: Uses Mongoose schemas to enforce data structure and validation.

---

## 4. Current Observations
- **Database Schema Mismatch**: Some queries in `projectController.js` use the field `owner`, while the `projectModel.js` defines the field as `admin`.
- **Environment Dependency**: The application heavily relies on `.env` variables for database connection, port, JWT secrets, and password hashing behavior.
