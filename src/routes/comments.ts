import express from 'express';
import { getComments, createComment } from '../controllers/commentController';
import { authenticate } from '../middleware/auth';
import { validate, commentSchema } from '../middleware/validation';

console.log('Loading comment routes...');
const router = express.Router({ mergeParams: true });

router.use(authenticate);
router.get('/', getComments); // Will be mounted as /api/tasks/:id/comments
router.post('/', validate(commentSchema), createComment);

export default router;
