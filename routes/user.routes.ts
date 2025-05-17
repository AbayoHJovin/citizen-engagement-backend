import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { protect } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/role.middleware";

const router = Router();

router.use(protect);

// Admin-only route to create leaders
router.post("/leader/create", requireAdmin, userController.adminCreateLeader);
router.get("/leaders", requireAdmin, userController.getAllLeaders);
router.get("/leader/:id", requireAdmin, userController.getLeaderById);
router.put("/leader/update/:id", requireAdmin, userController.updateLeader);
export default router;
