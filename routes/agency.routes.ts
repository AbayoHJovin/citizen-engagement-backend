import { Router } from 'express';
import {
  createAgencyHandler,
  addCategoryHandler,
  getAgenciesHandler,
  updateAgencyHandler,
  deleteAgencyHandler,
  deleteCategoryHandler,
  updateCategoryHandler,
  getCategoryHandler,
  getAllCategoriesHandler,
  getAllAgenciesHandler,
  getAgencyHandler
} from '../controllers/agency.controller';

import { protect } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

// ===== AGENCIES =====

router.post('/create', protect, requireRole('ADMIN'), createAgencyHandler);

router.get('/getAll', getAgenciesHandler);

router.get('/all', protect, requireRole('ADMIN'), getAllAgenciesHandler);

router.put('/:id', protect, requireRole('ADMIN'), updateAgencyHandler);

router.delete('/:id', protect, requireRole('ADMIN'), deleteAgencyHandler);


// ===== CATEGORIES =====

router.post('/:id/categories', protect, requireRole('ADMIN'), addCategoryHandler);

router.get('/categories/all', getAllCategoriesHandler);

router.put('/categories/:id', protect, requireRole('ADMIN'), updateCategoryHandler);

router.delete('/categories/:id', protect, requireRole('ADMIN'), deleteCategoryHandler);

export default router;
