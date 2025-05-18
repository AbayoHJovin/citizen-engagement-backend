import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { protect } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/role.middleware";
import * as adminController from "../controllers/admin.controller";

const router = Router();

router.use(protect);

router.post("/leader/create", requireAdmin, userController.adminCreateLeader);
router.get("/leaders", userController.getAllLeaders);
router.get("/leader/:id", userController.getLeaderById);
router.put("/leader/update/:id", requireAdmin, userController.updateLeader);
router.get("/get-summary",requireAdmin,adminController.getSummary);
router.get("/get-top-leaders",requireAdmin,adminController.getTop5Leaders);
router.get("/show-citizen-leaders/:id",userController.showCitizenLeaders);

export default router;
