# Backend System Analysis - Task Manager

This document provides a comprehensive analysis of the backend architecture, file structure, and functionality of the Task Manager application.

## 1. Project Overview
The backend is built using **Node.js**, **Express**, and **MongoDB** (via Mongoose). It implements a RESTful API for user authentication and project management.

---

## 2. File Structure Analysis

### **Root Directory**
- **`server.js`**: The entry point of the application.
    - Initializes the Express app.
    - Loads environment variables using `dotenv`.
    - Connects to the database via `config/database.js`.
    - Mounts middleware: `express.json()` for parsing request bodies.
    - Defines base routes: `/api/user` and `/api/projects`.
    - Listens on the specified `PORT`.

### **`config/`**
- **`database.js`**: Handles the connection to MongoDB.
    - `connectDB`: An asynchronous function that uses `mongoose.connect` with the `MONGODB_URI` from the environment.

### **`controllers/`**
This directory contains the logic for handling API requests.

#### **`userController.js`**
- `registerUser`: Handles user registration. Checks if a user already exists, hashes the password, and creates a new user record.
- `loginUser`: Handles user login. Verifies credentials and generates a JWT token (valid for 1 day) upon success.

#### **`projectController.js`**
- `createProject`: Creates a new project. Sets the current user as the `admin` and adds them to the `members` list.
- `getProjects`: Fetches all projects where the authenticated user is a member.
- `getProjectById`: Fetches a specific project by ID (Note: Currently queries using an `owner` field which may need verification against the schema's `admin` field).
- `deleteProject`: Deletes a project by ID (Note: Also uses `owner` field in query).
- `addMember`: Allows the project `admin` to add other users to the project by their `userId`.
- `removeMember`: Allows the project `admin` to remove members from the project.

### **`middlewares/`**
- **`auth.js`**: Contains authentication middleware.
    - `authMiddleware`: Extracts the Bearer token from the `Authorization` header, verifies it using `jsonwebtoken`, and attaches the decoded user data to the `req.user` object for subsequent controllers.

### **`models/`**
Defines the structure of the database documents.

#### **`userModel.js`**
- Schema: `name` (String), `isVerified` (Boolean), `email` (String, Unique, Required), `password` (String, Required).

#### **`projectModel.js`**
- Schema: `name` (String, Required), `description` (String), `admin` (ObjectId, ref: 'User'), `members` (Array of ObjectIds, ref: 'User').
- Includes `timestamps` (createdAt, updatedAt).

### **`routes/`**
Defines the API endpoints and maps them to controllers.

#### **`userRoutes.js`**
- `POST /api/user/register` -> `registerUser`
- `POST /api/user/login` -> `loginUser`

#### **`projectRoutes.js`**
- All routes are protected by `authMiddleware`.
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
