import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ClipboardDocumentListIcon, 
  CheckCircleIcon, 
  ClockIcon,
  TrophyIcon,
  StarIcon,
  CalendarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import { getApiUrl } from '@/config/api';
import { useAuth } from '@/contexts/useAuth';

interface LeadDashboardData {
  lead: {
    name: string;
    email: string;
    status: string;
    onboardingProgress: {
      totalTasks: number;
      completedTasks: number;
      percentage: number;
    };
    performanceMetrics: {
      tasksCompleted: number;
      tasksAssigned: number;
      averageCompletionTime: number;
      streakCount: number;
      lastActivityAt?: string;
    };
  };
  tasks: {
    pending: any[];
    inProgress: any[];
    completed: any[];
    overdue: any[];
  };
  onboardingProgress: {
    totalTasks: number;
    completedTasks: number;
    percentage: number;
    nextTask?: any;
  };
}

export const LeadDashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<LeadDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(getApiUrl('devrel/dashboard'));
      if (response.data.status) {
        setData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch dashboard data');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const markTaskComplete = async (taskId: string) => {
    try {
      const response = await axios.put(getApiUrl('devrel/tasks'), {
        taskId,
        status: 'completed',
      });
      
      if (response.data.status) {
        // Refresh dashboard data
        fetchDashboardData();
      }
    } catch (err: any) {
      console.error('Error marking task complete:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-700">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="mt-4 px-4 py-2 bg-[#FF5757] text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const totalTasks = data.tasks.pending.length + data.tasks.inProgress.length + data.tasks.completed.length + data.tasks.overdue.length;
  const completionRate = totalTasks > 0 ? Math.round((data.tasks.completed.length / totalTasks) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-700">Welcome back, {data.lead.name}! 👋</h1>
        <p className="text-gray-700 mt-2">Your DevRel journey dashboard</p>
      </motion.div>

      {/* Status Alert */}
      {data.lead.status !== 'onboarded' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4"
        >
          <div className="flex items-center">
            <ClockIcon className="w-5 h-5 text-yellow-600 mr-2" />
            <span className="font-medium text-yellow-800">
              Application Status: {data.lead.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          <p className="text-sm text-yellow-700 mt-1">
            Your application is being processed. You'll get full access once approved!
          </p>
        </motion.div>
      )}

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-blue-100">
              <ClipboardDocumentListIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-700">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-700">{totalTasks}</p>
              <p className="text-sm text-gray-700-400">{data.tasks.pending.length} pending</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-green-100">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-700">Completed</p>
              <p className="text-2xl font-bold text-gray-700">{data.tasks.completed.length}</p>
              <p className="text-sm text-gray-700-400">{completionRate}% completion rate</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-purple-100">
              <StarIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-700">Streak</p>
              <p className="text-2xl font-bold text-gray-700">{data.lead.performanceMetrics.streakCount}</p>
              <p className="text-sm text-gray-700-400">days active</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-orange-100">
              <TrophyIcon className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-700">Onboarding</p>
              <p className="text-2xl font-bold text-gray-700">{data.onboardingProgress.percentage}%</p>
              <p className="text-sm text-gray-700-400">
                {data.onboardingProgress.completedTasks}/{data.onboardingProgress.totalTasks} complete
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Tasks */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm border"
          >
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-700">Your Tasks</h2>
            </div>
            <div className="p-6">
              {/* Overdue Tasks */}
              {data.tasks.overdue.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-red-600 font-medium mb-3 flex items-center">
                    <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                    Overdue ({data.tasks.overdue.length})
                  </h3>
                  <div className="space-y-2">
                    {data.tasks.overdue.map((task, index) => (
                      <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-red-900">{task.title}</p>
                            <p className="text-sm text-red-700">{task.description}</p>
                          </div>
                          <button
                            onClick={() => markTaskComplete(task._id)}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                          >
                            Mark Complete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* In Progress Tasks */}
              {data.tasks.inProgress.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-blue-600 font-medium mb-3">
                    In Progress ({data.tasks.inProgress.length})
                  </h3>
                  <div className="space-y-2">
                    {data.tasks.inProgress.map((task, index) => (
                      <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-blue-900">{task.title}</p>
                            <p className="text-sm text-blue-700">{task.description}</p>
                          </div>
                          <button
                            onClick={() => markTaskComplete(task._id)}
                            className="px-3 py-1 bg-[#FF5757] text-white text-sm rounded hover:bg-blue-700"
                          >
                            Mark Complete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pending Tasks */}
              {data.tasks.pending.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-gray-700 font-medium mb-3">
                    Pending ({data.tasks.pending.length})
                  </h3>
                  <div className="space-y-2">
                    {data.tasks.pending.map((task, index) => (
                      <div key={index} className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-700">{task.title}</p>
                            <p className="text-sm text-gray-700">{task.description}</p>
                            {task.dueDate && (
                              <p className="text-xs text-gray-700 mt-1 flex items-center">
                                <CalendarIcon className="w-3 h-3 mr-1" />
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => markTaskComplete(task._id)}
                            className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                          >
                            Start Task
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {totalTasks === 0 && (
                <div className="text-center py-8">
                  <ClipboardDocumentListIcon className="w-12 h-12 text-gray-700-400 mx-auto mb-3" />
                  <p className="text-gray-700">No tasks assigned yet</p>
                  <p className="text-sm text-gray-700-400">Check back later for new assignments!</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Progress & Info */}
        <div className="space-y-6">
          {/* Onboarding Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow-sm border"
          >
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-700">Onboarding Progress</h2>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-700 mb-2">
                  <span>Progress</span>
                  <span>{data.onboardingProgress.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#FF5757] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${data.onboardingProgress.percentage}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-sm text-gray-700">
                {data.onboardingProgress.completedTasks} of {data.onboardingProgress.totalTasks} tasks completed
              </p>
              {data.onboardingProgress.nextTask && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">Next Task:</p>
                  <p className="text-sm text-blue-700">{data.onboardingProgress.nextTask.title}</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Performance Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-lg shadow-sm border"
          >
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-700">Your Performance</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-700">Tasks Completed</span>
                <span className="font-medium">{data.lead.performanceMetrics.tasksCompleted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Tasks Assigned</span>
                <span className="font-medium">{data.lead.performanceMetrics.tasksAssigned}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Completion Rate</span>
                <span className="font-medium">{completionRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Current Streak</span>
                <span className="font-medium">{data.lead.performanceMetrics.streakCount} days</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200"
          >
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">💡 DevRel Tips</h2>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Complete tasks on time to maintain your streak</li>
                <li>• Engage actively in the community</li>
                <li>• Share your learnings with others</li>
                <li>• Ask questions when you need help</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};