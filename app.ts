import express from 'express';
import authRoutes from './routes/auth.routes';
import dotenv from 'dotenv';
import agencyRoutes from './routes/agency.routes';


dotenv.config();
const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/agencies', agencyRoutes);

export default app;
