import { Request, Response } from 'express';
import Task from '../models/Task';
import { IUser } from '../types';

interface AuthRequest extends Request {
  user?: IUser;
}

export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { assignee, status, page = '1', limit = '10' } = req.query;
    
    const filter: any = {};
    
    if (req.user?.role !== 'admin') {
      filter.$or = [
        { assignee: req.user?._id },
        { createdBy: req.user?._id }
      ];
    }
    
    if (assignee) filter.assignee = assignee;
    if (status) filter.status = status;

    const pageNum = Math.max(1, parseInt(page as string, 10));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit as string, 10)));

    const tasks = await Task.find(filter)
      .populate('assignee', 'username email')
      .populate('createdBy', 'username email')
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum);

    const total = await Task.countDocuments(filter);

    res.json({
      success: true,
      data: {
        tasks,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (error) {
    console.error('Error in getTasks:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching tasks' 
    });
  }
};

export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, status, priority, assignee, dueDate } = req.body;

    if (req.user?.role !== 'admin' && assignee !== req.user?._id.toString()) {
      res.status(403).json({ 
        success: false, 
        message: 'Only admins can assign tasks to other users' 
      });
      return;
    }

    const task = new Task({
      title,
      description,
      status,
      priority,
      assignee,
      createdBy: req.user?._id,
      dueDate
    });

    await task.save();
    await task.populate('assignee', 'username email');
    await task.populate('createdBy', 'username email');

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: { task }
    });
  } catch (error) {
    console.error('Error in createTask:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while creating task' 
    });
  }
};

export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const task = await Task.findById(id);
    if (!task) {
      res.status(404).json({ 
        success: false, 
        message: 'Task not found' 
      });
      return;
    }

    const canEdit = req.user?.role === 'admin' || 
                   task.createdBy.toString() === req.user?._id.toString() ||
                   task.assignee.toString() === req.user?._id.toString();

    if (!canEdit) {
      res.status(403).json({ 
        success: false, 
        message: 'You can only edit your own tasks or tasks assigned to you' 
      });
      return;
    }

    if (updates.assignee && req.user?.role !== 'admin') {
      res.status(403).json({ 
        success: false, 
        message: 'Only admins can change task assignee' 
      });
      return;
    }

    const updatedTask = await Task.findByIdAndUpdate(id, updates, { 
      new: true, 
      runValidators: true 
    })
    .populate('assignee', 'username email')
    .populate('createdBy', 'username email');

    if (!updatedTask) {
      res.status(404).json({ 
        success: false, 
        message: 'Task not found after update' 
      });
      return;
    }

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: { task: updatedTask }
    });
  } catch (error) {
    console.error('Error in updateTask:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while updating task' 
    });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      res.status(404).json({ 
        success: false, 
        message: 'Task not found' 
      });
      return;
    }

    const canDelete = req.user?.role === 'admin' || 
                     task.createdBy.toString() === req.user?._id.toString();

    if (!canDelete) {
      res.status(403).json({ 
        success: false, 
        message: 'You can only delete your own tasks' 
      });
      return;
    }

    await Task.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteTask:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while deleting task' 
    });
  }
};