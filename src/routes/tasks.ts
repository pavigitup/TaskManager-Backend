import { Router } from 'express';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskController';
import { authenticate } from '../middleware/auth';
import { validate, taskSchema, updateTaskSchema } from '../middleware/validation';
console.log('Loading task routes...');

const router = Router();
console.log('Loading task routes...');

router.use(authenticate);

router.get('/', getTasks);
router.post('/', validate(taskSchema), createTask);
router.put('/:id', validate(updateTaskSchema), updateTask);
router.delete('/:id', deleteTask);

export default router;