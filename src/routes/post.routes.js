import { Router } from 'express';
import { createPost, listPosts, getPost, updatePost, deletePost, toggleLike } from '../controllers/post.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createPostSchema, updatePostSchema } from '../validators/post.validators.js';

const router = Router();

router.get('/', listPosts);
router.get('/:id', getPost);

// Toggle like (auth)
router.post('/:id/like', requireAuth, toggleLike);

router.post('/', requireAuth, validate(createPostSchema), createPost);
router.patch('/:id', requireAuth, validate(updatePostSchema), updatePost);
router.delete('/:id', requireAuth, deletePost);

export default router;