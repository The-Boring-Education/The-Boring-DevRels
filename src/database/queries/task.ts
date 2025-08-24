import { DevRelTask } from '@/database/models';
import type { 
  DatabaseQueryResponse, 
  DevRelTaskModel, 
  CreateTaskRequest,
  TaskStatusType 
} from '@/interfaces';
import { TASK_TYPES, TASK_STATUS } from '@/constants';

// Create new task
export const createTaskInDB = async (
  taskData: CreateTaskRequest,
  createdBy: string
): Promise<DatabaseQueryResponse<DevRelTaskModel>> => {
  try {
    const task = await DevRelTask.create({
      ...taskData,
      createdBy,
    });
    
    return { data: task };
  } catch (error) {
    console.error('Error creating task:', error);
    return { error: 'Failed to create task' };
  }
};

// Get task by ID
export const getTaskByIdFromDB = async (
  id: string
): Promise<DatabaseQueryResponse<DevRelTaskModel>> => {
  try {
    const task = await DevRelTask.findById(id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');
    
    if (!task) {
      return { error: 'Task not found' };
    }
    
    return { data: task };
  } catch (error) {
    console.error('Error fetching task by ID:', error);
    return { error: 'Failed to fetch task' };
  }
};

// Get tasks by type
export const getTasksByTypeFromDB = async (
  type: string
): Promise<DatabaseQueryResponse<DevRelTaskModel[]>> => {
  try {
    const tasks = await DevRelTask.findByType(type)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');
    
    return { data: tasks };
  } catch (error) {
    console.error('Error fetching tasks by type:', error);
    return { error: 'Failed to fetch tasks' };
  }
};

// Get tasks for a specific lead
export const getTasksForLeadFromDB = async (
  leadId: string
): Promise<DatabaseQueryResponse<DevRelTaskModel[]>> => {
  try {
    const tasks = await DevRelTask.findForLead(leadId)
      .populate('createdBy', 'name email');
    
    return { data: tasks };
  } catch (error) {
    console.error('Error fetching tasks for lead:', error);
    return { error: 'Failed to fetch tasks' };
  }
};

// Get all tasks
export const getAllTasksFromDB = async (): Promise<DatabaseQueryResponse<DevRelTaskModel[]>> => {
  try {
    const tasks = await DevRelTask.find({ isActive: true })
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });
    
    return { data: tasks };
  } catch (error) {
    console.error('Error fetching all tasks:', error);
    return { error: 'Failed to fetch tasks' };
  }
};

// Get overdue tasks
export const getOverdueTasksFromDB = async (): Promise<DatabaseQueryResponse<DevRelTaskModel[]>> => {
  try {
    const tasks = await DevRelTask.findOverdue()
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');
    
    return { data: tasks };
  } catch (error) {
    console.error('Error fetching overdue tasks:', error);
    return { error: 'Failed to fetch overdue tasks' };
  }
};

// Assign task to lead
export const assignTaskToLeadInDB = async (
  taskId: string,
  leadId: string
): Promise<DatabaseQueryResponse<DevRelTaskModel>> => {
  try {
    const task = await DevRelTask.findById(taskId);
    
    if (!task) {
      return { error: 'Task not found' };
    }
    
    await task.assignToLead(leadId);
    return { data: task };
  } catch (error) {
    console.error('Error assigning task to lead:', error);
    return { error: 'Failed to assign task' };
  }
};

// Update task progress for lead
export const updateTaskProgressInDB = async (
  taskId: string,
  leadId: string,
  status: TaskStatusType,
  data: any = {}
): Promise<DatabaseQueryResponse<DevRelTaskModel>> => {
  try {
    const task = await DevRelTask.findById(taskId);
    
    if (!task) {
      return { error: 'Task not found' };
    }
    
    await task.updateLeadProgress(leadId, status, data);
    return { data: task };
  } catch (error) {
    console.error('Error updating task progress:', error);
    return { error: 'Failed to update task progress' };
  }
};

// Submit work for task
export const submitTaskWorkInDB = async (
  taskId: string,
  leadId: string,
  submissionData: {
    url?: string;
    notes?: string;
  }
): Promise<DatabaseQueryResponse<DevRelTaskModel>> => {
  try {
    const task = await DevRelTask.findById(taskId);
    
    if (!task) {
      return { error: 'Task not found' };
    }
    
    await task.submitWork(leadId, submissionData);
    return { data: task };
  } catch (error) {
    console.error('Error submitting task work:', error);
    return { error: 'Failed to submit work' };
  }
};

// Review task submission
export const reviewTaskSubmissionInDB = async (
  taskId: string,
  leadId: string,
  reviewerId: string,
  decision: 'approved' | 'needs_revision',
  notes?: string
): Promise<DatabaseQueryResponse<DevRelTaskModel>> => {
  try {
    const task = await DevRelTask.findById(taskId);
    
    if (!task) {
      return { error: 'Task not found' };
    }
    
    await task.reviewSubmission(leadId, reviewerId, decision, notes);
    return { data: task };
  } catch (error) {
    console.error('Error reviewing task submission:', error);
    return { error: 'Failed to review submission' };
  }
};

// Get task status for lead
export const getTaskStatusForLeadFromDB = async (
  taskId: string,
  leadId: string
): Promise<DatabaseQueryResponse<any>> => {
  try {
    const task = await DevRelTask.findById(taskId);
    
    if (!task) {
      return { error: 'Task not found' };
    }
    
    const status = task.getLeadStatus(leadId);
    return { data: status };
  } catch (error) {
    console.error('Error getting task status for lead:', error);
    return { error: 'Failed to get task status' };
  }
};

// Get task statistics
export const getTaskStatsFromDB = async (): Promise<DatabaseQueryResponse<any>> => {
  try {
    const stats = await DevRelTask.getTaskStats();
    return { data: stats[0] || { statusCounts: [], total: 0 } };
  } catch (error) {
    console.error('Error fetching task stats:', error);
    return { error: 'Failed to fetch task statistics' };
  }
};

// Get lead task summary
export const getLeadTaskSummaryFromDB = async (
  leadId: string
): Promise<DatabaseQueryResponse<any>> => {
  try {
    const summary = await DevRelTask.getLeadTaskSummary(leadId);
    return { data: summary };
  } catch (error) {
    console.error('Error fetching lead task summary:', error);
    return { error: 'Failed to fetch task summary' };
  }
};

// Update task
export const updateTaskInDB = async (
  taskId: string,
  updateData: Partial<DevRelTaskModel>
): Promise<DatabaseQueryResponse<DevRelTaskModel>> => {
  try {
    const task = await DevRelTask.findByIdAndUpdate(
      taskId,
      updateData,
      { new: true }
    ).populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');
    
    if (!task) {
      return { error: 'Task not found' };
    }
    
    return { data: task };
  } catch (error) {
    console.error('Error updating task:', error);
    return { error: 'Failed to update task' };
  }
};

// Deactivate task
export const deactivateTaskInDB = async (
  taskId: string
): Promise<DatabaseQueryResponse<DevRelTaskModel>> => {
  try {
    const task = await DevRelTask.findByIdAndUpdate(
      taskId,
      { isActive: false },
      { new: true }
    );
    
    if (!task) {
      return { error: 'Task not found' };
    }
    
    return { data: task };
  } catch (error) {
    console.error('Error deactivating task:', error);
    return { error: 'Failed to deactivate task' };
  }
};

// Delete task
export const deleteTaskFromDB = async (
  taskId: string
): Promise<DatabaseQueryResponse<boolean>> => {
  try {
    const result = await DevRelTask.findByIdAndDelete(taskId);
    
    if (!result) {
      return { error: 'Task not found' };
    }
    
    return { data: true };
  } catch (error) {
    console.error('Error deleting task:', error);
    return { error: 'Failed to delete task' };
  }
};

// Get onboarding tasks
export const getOnboardingTasksFromDB = async (): Promise<DatabaseQueryResponse<DevRelTaskModel[]>> => {
  try {
    const tasks = await DevRelTask.find({
      type: TASK_TYPES.ONBOARDING,
      isActive: true
    }).populate('createdBy', 'name email')
      .sort({ createdAt: 1 });
    
    return { data: tasks };
  } catch (error) {
    console.error('Error fetching onboarding tasks:', error);
    return { error: 'Failed to fetch onboarding tasks' };
  }
};

// Get weekly tasks
export const getWeeklyTasksFromDB = async (): Promise<DatabaseQueryResponse<DevRelTaskModel[]>> => {
  try {
    const tasks = await DevRelTask.find({
      type: TASK_TYPES.WEEKLY,
      isActive: true
    }).populate('createdBy', 'name email')
      .sort({ dueDate: 1, createdAt: -1 });
    
    return { data: tasks };
  } catch (error) {
    console.error('Error fetching weekly tasks:', error);
    return { error: 'Failed to fetch weekly tasks' };
  }
};