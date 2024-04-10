import 'dotenv/config';
import express from 'express';
import cors from 'cors';


// Import of routers files
import usersRouter from './routes/users.js';


const app = express();

app.use(cors());
app.use(express.json());

// Initialisation of the routers
app.use('/users', usersRouter);

// Start the server
app.listen(process.env.SERVER_PORT, () => console.log("Le serveur est lancé sur le port " + process.env.SERVER_PORT));