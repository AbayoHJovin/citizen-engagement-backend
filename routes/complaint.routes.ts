import { Router } from 'express';
import * as complaintController from '../controllers/complaint.controller';
import { protect } from '../middleware/auth.middleware';
import { requireAdmin, requireLeader, requireRole } from '../middleware/role.middleware';

const router = Router();

router.use(protect);

// -------------------- Citizen Routes -------------------- //
router.post('/', requireRole('CITIZEN'), complaintController.create);
router.get('/me', requireRole('CITIZEN'), complaintController.getMine);
router.put('/:id', requireRole('CITIZEN'), complaintController.update);
router.delete('/:id', requireRole('CITIZEN'), complaintController.remove);

// -------------------- Shared Routes -------------------- //
router.get('/:id', complaintController.getById);

// -------------------- Leader Routes -------------------- //
router.get('/region/mine', requireLeader, complaintController.getByMyRegion);
router.put('/change-status/:id', requireLeader, complaintController.changeComplaintStatus);

// -------------------- Admin Routes -------------------- //
router.get('/', requireAdmin, complaintController.getAll);

export default router;
