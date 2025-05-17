import { Router } from 'express';
import * as controller from '../controllers/response.controller';
import { protect } from '../middleware/auth.middleware';
import { requireLeader } from '../middleware/role.middleware';

const router = Router();

router.use(protect);
router.post('/add', requireLeader, controller.create);
router.put('/update/:id', requireLeader, controller.update);
router.delete('/delete/:id', requireLeader, controller.remove);
router.get('/complaint/:complaintId', controller.getByComplaint);

export default router;
