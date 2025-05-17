import express from 'express';
import authRoutes from './routes/auth.routes';
import complaintRoutes from './routes/complaint.routes';
import dotenv from 'dotenv';
import responseRoutes from './routes/response.routes';


dotenv.config();
const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use("/api/responses", responseRoutes);

export default app;
