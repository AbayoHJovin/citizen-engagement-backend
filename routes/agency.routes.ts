import { Router } from 'express';
import {
  createAgencyHandler,
  updateAgencyHandler,
  deleteAgencyHandler,
  getAgencyHandler,
  getAllAgenciesHandler,
  
} from '../controllers/agency.controller';

import { protect } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

// ===== AGENCIES =====

router.post('/create', protect, requireRole('CITIZEN'), createAgencyHandler);

router.get('/getAll', getAllAgenciesHandler);

router.put('/:id', protect, requireRole('ADMIN'), updateAgencyHandler);

router.delete('/:id', protect, requireRole('ADMIN'), deleteAgencyHandler);

export default router;
