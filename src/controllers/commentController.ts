
import { Request, Response } from 'express';
import Comment from '../models/Comment';
import Task from '../models/Task';
import { IUser } from '../types';

interface AuthRequest extends Request {
  user?: IUser;
}

export const getComments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const taskId = req.params.id;
    console.log(req.params);
    
    if (!taskId) {
      res.status(400).json({
        success: false,
        message: 'Task ID is required'
      });
      return;
    }

    // Check if task exists and user has access
    const task = await Task.findById(taskId);
    if (!task) {
      res.status(404).json({ 
        success: false, 
        message: 'Task not found' 
      });
      return;
    }

    // Users can only see comments for tasks they have access to
    const hasAccess = req.user?.role === 'admin' || 
                     task.assignee.toString() === req.user?._id.toString() ||
                     task.createdBy.toString() === req.user?._id.toString();

    if (!hasAccess) {
      res.status(403).json({ 
        success: false, 
        message: 'Access denied' 
      });
      return;
    }

    const comments = await Comment.find({ taskId })
      .populate('userId', 'username email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { comments }
    });
  } catch (error) {
    console.error('Error in getComments:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching comments' 
    });
  }
};

export const createComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const taskId = req.params.id;
    console.log(req.params);
    
    const { content } = req.body;

    if (!taskId) {
      res.status(400).json({
        success: false,
        message: 'Task ID is required'
      });
      return;
    }

    if (!content) {
      res.status(400).json({
        success: false,
        message: 'Comment content is required'
      });
      return;
    }

    // Check if task exists and user has access
    const task = await Task.findById(taskId);
    if (!task) {
      res.status(404).json({ 
        success: false, 
        message: 'Task not found' 
      });
      return;
    }

    // Users can only comment on tasks they have access to
    const hasAccess = req.user?.role === 'admin' || 
                     task.assignee.toString() === req.user?._id.toString() ||
                     task.createdBy.toString() === req.user?._id.toString();

    if (!hasAccess) {
      res.status(403).json({ 
        success: false, 
        message: 'Access denied' 
      });
      return;
    }

    const comment = new Comment({
      content,
      taskId,
      userId: req.user?._id
    });

    await comment.save();
    await comment.populate('userId', 'username email');

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: { comment }
    });
  } catch (error) {
    console.error('Error in createComment:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while creating comment' 
    });
  }
};