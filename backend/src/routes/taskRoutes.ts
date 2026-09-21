import { Router } from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
} from '../controllers/taskController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All task routes require authentication
router.use(authenticate);

router.get('/', getTasks);
router.post('/', createTask);
router.get('/stats', getTaskStats);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
