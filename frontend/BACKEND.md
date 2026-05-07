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

#### **`userRoutes.js`**
- `POST /api/user/register` -> `registerUser` Tokens expire in 1 day.



  
- `POST /api/projects/` -> `createProject`
- `GET /api/projects/` -> `getProjects`
- `GET /api/projects/:id` -> `getProjectById`
- `DELETE /api/projects/:id` -> `deleteProject`
- `PUT /api/projects/:id/add-member` -> `addMember`
- `PUT /api/projects/:id/remove-member` -> `removeMember`



-