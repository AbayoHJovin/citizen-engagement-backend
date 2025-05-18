import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import { leaderSummary, showLeaderHisCitizens } from "../controllers/leader.controller";
import { requireLeader } from "../middleware/role.middleware";

const router=Router();
router.use(protect);
router.get("/get-leader-summary",requireLeader,leaderSummary);
router.get("/show-leader-citizens",requireLeader,showLeaderHisCitizens);
export default router;
