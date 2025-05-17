import { Router } from 'express';
import * as complaintController from '../controllers/complaint.controller';
import { protect } from '../middleware/auth.middleware';
import { requireAdmin, requireLeader, requireRole } from '../middleware/role.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.use(protect);

// -------------------- Citizen Routes -------------------- //
router.post('/add', requireRole('CITIZEN'),upload.array('images', 5), complaintController.create);
router.get('/my-complaints', requireRole('CITIZEN'), complaintController.getMine);
router.put('/update/:id', requireRole('CITIZEN'), complaintController.update);
router.delete('/delete/:id', requireRole('CITIZEN'), complaintController.remove);

// -------------------- Shared Routes -------------------- //
router.get('/get-by-id/:id', complaintController.getById);

// -------------------- Leader Routes -------------------- //
router.get('/region/mine', requireLeader, complaintController.getByMyRegion);
router.put('/change-status/:id', requireLeader, complaintController.changeComplaintStatus);

// -------------------- Admin Routes -------------------- //
router.get('/get-all', requireAdmin, complaintController.getAll);

export default router;
