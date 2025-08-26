// routes/users.ts
import { Router } from 'express';
import { listUsers, getUser, updateProfile, changePassword, deleteUser } from '../controllers/user.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { allowRoles } from '../middleware/roles.js';
import { validate } from '../middleware/validate.js';
import { updateProfileSchema, changePasswordSchema } from '../validators/user.validators.js';

const router = Router();

// Admin manage users
router.get('/', requireAuth, allowRoles('admin'), listUsers);
router.get('/:id', requireAuth, allowRoles('admin'), getUser);
router.delete('/:id', requireAuth, allowRoles('admin'), deleteUser);

// Self profile
router.patch('/me', requireAuth, validate(updateProfileSchema), updateProfile);
router.post('/me/change-password', requireAuth, validate(changePasswordSchema), changePassword);

export default router;
