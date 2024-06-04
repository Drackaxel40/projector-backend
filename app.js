import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';


// Import of routers files
import usersRouter from './routes/users.js';
import projectsRouter from './routes/projects.js';
import categoriesRouter from './routes/project_categories.js';
import projectMembersRouter from './routes/project_members.js';
import projectMessagesRouter from './routes/project_messages.js';
import projectStatusRouter from './routes/project_status.js';
import tasksRouter from './routes/tasks.js';
import projectUsersTasksRouter from './routes/project_users_tasks.js';
import taskStatusRouter from './routes/task_status.js';
import uploadRouter from './routes/upload.js';

// Convert import.meta.url to __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialisation of the routers
app.use('/users', usersRouter);
app.use('/projects', projectsRouter);
app.use('/categories', categoriesRouter);
app.use('/project_members', projectMembersRouter);
app.use('/project_messages', projectMessagesRouter);
app.use('/project_status', projectStatusRouter);
app.use('/tasks', tasksRouter);
app.use('/task_status', taskStatusRouter);
app.use('/tasks_users', projectUsersTasksRouter);
app.use('/upload', uploadRouter);

// Start the server
app.listen(process.env.SERVER_PORT, () => console.log("Le serveur est lancé sur le port " + process.env.SERVER_PORT));