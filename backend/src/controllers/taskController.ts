import { Response } from 'express';
import mongoose from 'mongoose';
import Task, { ITask } from '../models/Task';
import { AuthRequest } from '../middleware/auth';
import { calculateSmartScore, sortTasksBySmartAlgorithm } from '../utils/sorting';

/**
 * Get all tasks for the logged in user with rich filtering and sorting options
 */
export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      status,
      priority,
      category,
      search,
      sortBy = 'smart',
      sortOrder = 'desc',
    } = req.query;

    const filter: any = { user: req.userId };

    // Status filter
    if (status === 'completed') {
      filter.isCompleted = true;
    } else if (status === 'pending') {
      filter.isCompleted = false;
    }

    // Priority filter
    if (priority && ['low', 'medium', 'high'].includes(priority as string)) {
      filter.priority = priority;
    }

    // Category filter
    if (category && category !== 'All') {
      filter.category = new RegExp(`^${category}$`, 'i');
    }

    // Search query filter (matches title or description)
    if (search && typeof search === 'string' && search.trim() !== '') {
      filter.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    let query = Task.find(filter);

    // Apply sorting
    if (sortBy === 'smart') {
      // Smart algorithm sorting in memory
      const tasks = await query.exec();
      const sorted = sortTasksBySmartAlgorithm(tasks);
      
      // Attach smartScore to each task object for UI transparency
      const tasksWithScore = sorted.map((t) => ({
        ...t.toObject(),
        urgencyScore: calculateSmartScore(t),
      }));

      res.status(200).json({
        success: true,
        count: tasksWithScore.length,
        data: tasksWithScore,
      });
      return;
    }

    // Standard database sorting
    const sortField = sortBy as string;
    const orderDirection = sortOrder === 'asc' ? 1 : -1;
    query = query.sort({ [sortField]: orderDirection });

    const tasks = await query.exec();

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks.map((t) => ({
        ...t.toObject(),
        urgencyScore: calculateSmartScore(t),
      })),
    });
  } catch (error: any) {
    console.error('GetTasks Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve tasks.',
    });
  }
};

/**
 * Get single task by ID
 */
export const getTaskById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid task ID format.',
      });
      return;
    }

    const task = await Task.findOne({ _id: id, user: req.userId });
    if (!task) {
      res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        ...task.toObject(),
        urgencyScore: calculateSmartScore(task),
      },
    });
  } catch (error: any) {
    console.error('GetTaskById Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve task.',
    });
  }
};

/**
 * Create a new task
 */
export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, dateTime, deadline, priority, category } = req.body;

    if (!title || title.trim() === '') {
      res.status(400).json({
        success: false,
        message: 'Task title is required.',
      });
      return;
    }

    if (!deadline) {
      res.status(400).json({
        success: false,
        message: 'Task deadline is required.',
      });
      return;
    }

    const task = await Task.create({
      user: req.userId,
      title: title.trim(),
      description: description ? description.trim() : '',
      dateTime: dateTime ? new Date(dateTime) : new Date(),
      deadline: new Date(deadline),
      priority: priority || 'medium',
      category: category && category.trim() !== '' ? category.trim() : 'General',
      isCompleted: false,
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully.',
      data: {
        ...task.toObject(),
        urgencyScore: calculateSmartScore(task),
      },
    });
  } catch (error: any) {
    console.error('CreateTask Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create task.',
    });
  }
};

/**
 * Update an existing task or toggle completion status
 */
export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { title, description, dateTime, deadline, priority, category, isCompleted } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid task ID format.',
      });
      return;
    }

    const task = await Task.findOne({ _id: id, user: req.userId });
    if (!task) {
      res.status(404).json({
        success: false,
        message: 'Task not found or unauthorized to edit.',
      });
      return;
    }

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (dateTime !== undefined) task.dateTime = new Date(dateTime);
    if (deadline !== undefined) task.deadline = new Date(deadline);
    if (priority !== undefined) task.priority = priority;
    if (category !== undefined) task.category = category.trim();

    if (isCompleted !== undefined) {
      task.isCompleted = Boolean(isCompleted);
      task.completedAt = isCompleted ? new Date() : undefined;
    }

    await task.save();

    res.status(200).json({
      success: true,
      message: 'Task updated successfully.',
      data: {
        ...task.toObject(),
        urgencyScore: calculateSmartScore(task),
      },
    });
  } catch (error: any) {
    console.error('UpdateTask Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update task.',
    });
  }
};

/**
 * Delete a task
 */
export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid task ID format.',
      });
      return;
    }

    const task = await Task.findOneAndDelete({ _id: id, user: req.userId });
    if (!task) {
      res.status(404).json({
        success: false,
        message: 'Task not found or unauthorized to delete.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully.',
      data: { id },
    });
  } catch (error: any) {
    console.error('DeleteTask Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete task.',
    });
  }
};

/**
 * Get aggregated task metrics & stats for user dashboard
 */
export const getTaskStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const now = new Date();

    const [stats] = await Task.aggregate([
      { $match: { user: userId } },
      {
        $facet: {
          total: [{ $count: 'count' }],
          completed: [{ $match: { isCompleted: true } }, { $count: 'count' }],
          pending: [{ $match: { isCompleted: false } }, { $count: 'count' }],
          overdue: [
            { $match: { isCompleted: false, deadline: { $lt: now } } },
            { $count: 'count' },
          ],
          highPriority: [
            { $match: { isCompleted: false, priority: 'high' } },
            { $count: 'count' },
          ],
          categories: [
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ],
        },
      },
    ]);

    const total = stats.total[0]?.count || 0;
    const completed = stats.completed[0]?.count || 0;
    const pending = stats.pending[0]?.count || 0;
    const overdue = stats.overdue[0]?.count || 0;
    const highPriority = stats.highPriority[0]?.count || 0;
    const categories = stats.categories || [];
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        total,
        completed,
        pending,
        overdue,
        highPriority,
        completionRate,
        categories,
      },
    });
  } catch (error: any) {
    console.error('GetTaskStats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve task statistics.',
    });
  }
};
