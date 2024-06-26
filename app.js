import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import helmet from 'helmet';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import verifyJWTToken from './middleware/verifyJWTToken.js';
import generateCSRFToken from './middleware/csrfToken.js';
import verifyCSRFToken from './middleware/verifyCSRFToken.js';

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

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      scriptSrc: ["'self'", process.env.CLIENT_URL, process.env.BACKOFFICE_URL],
      imgSrc: ["'self'", process.env.CLIENT_URL, process.env.BACKOFFICE_URL, "'data:"],
      connectSrc: ["'self'", process.env.CLIENT_URL, process.env.BACKOFFICE_URL],
    },
  }, crossOriginResourcePolicy: { policy: 'same-site' }
}));
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Initialisation of the routers with CSRF protection

// For the users router, the middlewares are includes in the users router file in the routes folder
app.use('/users', usersRouter);

app.use('/projects', verifyJWTToken, verifyCSRFToken, projectsRouter);
app.use('/categories', verifyJWTToken, verifyCSRFToken, categoriesRouter);
app.use('/project_members', verifyJWTToken, verifyCSRFToken, projectMembersRouter);
app.use('/project_messages', verifyJWTToken, verifyCSRFToken, projectMessagesRouter);
app.use('/project_status', verifyJWTToken, verifyCSRFToken, projectStatusRouter);
app.use('/tasks', verifyJWTToken, verifyCSRFToken, tasksRouter);
app.use('/task_status', verifyJWTToken, verifyCSRFToken, taskStatusRouter);
app.use('/tasks_users', verifyJWTToken, verifyCSRFToken, projectUsersTasksRouter);
app.use('/upload', verifyJWTToken, verifyCSRFToken, uploadRouter);


// Start the server
app.listen(process.env.SERVER_PORT, () => console.log("Le serveur est lancé sur le port " + process.env.SERVER_PORT));