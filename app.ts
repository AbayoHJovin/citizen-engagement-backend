import express from "express";
import authRoutes from "./routes/auth.routes";
import complaintRoutes from "./routes/complaint.routes";
import dotenv from "dotenv";
import responseRoutes from "./routes/response.routes";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import leaderRoutes from "./routes/leader.routes";
const cookieParser = require("cookie-parser");

dotenv.config();
const app = express();
app.use(
  cors({
    origin: function(origin, callback) {
      if(!origin) return callback(null, true);
      return callback(null, true);
    },
    credentials: true
  })
);
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/responses", responseRoutes);
app.use("/api/users", userRoutes);
app.use("/api/leader", leaderRoutes);

export default app;
