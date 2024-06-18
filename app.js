import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';


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

const allowedOrigins = [process.env.CLIENT_URL, process.env.BACKOFFICE_URL];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware to protect against CSRF attacks
const csrfProtection = csurf({
   cookie:{
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true
   }
});

// CSRF protection
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Initialisation of the routers with CSRF protection
app.use('/users', csrfProtection, usersRouter);
app.use('/projects', csrfProtection, projectsRouter);
app.use('/categories', csrfProtection, categoriesRouter);
app.use('/project_members', csrfProtection, projectMembersRouter);
app.use('/project_messages', csrfProtection, projectMessagesRouter);
app.use('/project_status', csrfProtection, projectStatusRouter);
app.use('/tasks', csrfProtection, tasksRouter);
app.use('/task_status', csrfProtection, taskStatusRouter);
app.use('/tasks_users', csrfProtection, projectUsersTasksRouter);
app.use('/upload', csrfProtection, uploadRouter);

// Error handler for CSRF token
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    res.status(403).json({ error: 'Invalid CSRF token' });
  } else {
    next(err);
  }
});

// Start the server
app.listen(process.env.SERVER_PORT, () => console.log("Le serveur est lancé sur le port " + process.env.SERVER_PORT));