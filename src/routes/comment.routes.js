import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createCommentSchema, listCommentsSchema } from '../validators/comment.validators.js';
import { createComment, listComments, deleteComment } from '../controllers/comment.controller.js';

const router = Router();

// List comments for a post (public)
router.get('/', validate(listCommentsSchema, 'query'), listComments);

// Create comment (auth)
router.post('/', requireAuth, validate(createCommentSchema), createComment);

// Delete comment (admin or owner)
router.delete('/:id', requireAuth, deleteComment);

export default router;