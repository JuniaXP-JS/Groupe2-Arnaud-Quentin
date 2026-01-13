import dotenv from 'dotenv-flow';
dotenv.config();

import express, { Application } from 'express';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';
import gpsRoutes from './routes/gps.routes';
import sessionMiddleware from './config/session/session.config';
import passport from './config/passport.config';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';


const app: Application = express();

app.use(cors({
    origin: 'http://localhost:5173', // Allow React vite local
    credentials: true
}));

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(sessionMiddleware);  // Your session middleware will manage the session storage in MongoDB

app.use(passport.initialize());
app.use(passport.session());  // This is important for session-based authentication

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/gps', gpsRoutes);

export default app;
