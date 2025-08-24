import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  UserGroupIcon, 
  ClipboardDocumentListIcon, 
  ChartBarIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import { getApiUrl } from '@/config/api';
import { useAuth } from '@/contexts/useAuth';

interface AdvocateDashboardData {
  applications: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    recent: any[];
  };
  leads: {
    total: number;
    active: number;
    onboarding: number;
    performanceData: any[];
  };
  tasks: {
    total: number;
    active: number;
    completed: number;
    overdue: number;
  };
}

export const AdvocateDashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<AdvocateDashboardData | null>(null);
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
          <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const stats = [
    {
      title: 'Total Applications',
      value: data.applications.total,
      icon: UserGroupIcon,
      color: 'blue',
      change: `${data.applications.pending} pending`,
    },
    {
      title: 'Active Leads',
      value: data.leads.active,
      icon: CheckCircleIcon,
      color: 'green',
      change: `${data.leads.onboarding} onboarding`,
    },
    {
      title: 'Total Tasks',
      value: data.tasks.total,
      icon: ClipboardDocumentListIcon,
      color: 'purple',
      change: `${data.tasks.overdue} overdue`,
    },
    {
      title: 'Task Completion',
      value: `${Math.round((data.tasks.completed / data.tasks.total) * 100)}%`,
      icon: ChartBarIcon,
      color: 'orange',
      change: `${data.tasks.completed}/${data.tasks.total} completed`,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900">DevRel Advocate Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage applications, tasks, and team performance</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg bg-${stat.color}-100`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.change}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Applications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border"
        >
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
          </div>
          <div className="p-6">
            {data.applications.recent.length > 0 ? (
              <div className="space-y-4">
                {data.applications.recent.slice(0, 5).map((application, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{application.name}</p>
                      <p className="text-sm text-gray-500">{application.email}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        application.status === 'applied' ? 'bg-yellow-100 text-yellow-800' :
                        application.status === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {application.status}
                      </span>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(application.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No applications yet</p>
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border"
        >
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                <div className="flex items-center">
                  <EyeIcon className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="font-medium text-blue-900">Review Applications</span>
                </div>
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                  {data.applications.pending}
                </span>
              </button>

              <button className="w-full flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                <div className="flex items-center">
                  <ClipboardDocumentListIcon className="w-5 h-5 text-green-600 mr-3" />
                  <span className="font-medium text-green-900">Create New Task</span>
                </div>
              </button>

              <button className="w-full flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                <div className="flex items-center">
                  <ChartBarIcon className="w-5 h-5 text-purple-600 mr-3" />
                  <span className="font-medium text-purple-900">View Analytics</span>
                </div>
              </button>

              <button className="w-full flex items-center justify-between p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
                <div className="flex items-center">
                  <ClockIcon className="w-5 h-5 text-orange-600 mr-3" />
                  <span className="font-medium text-orange-900">Overdue Tasks</span>
                </div>
                <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded-full">
                  {data.tasks.overdue}
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Performance Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 bg-white rounded-lg shadow-sm border"
      >
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Team Performance</h2>
        </div>
        <div className="p-6">
          {data.leads.performanceData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium text-gray-500">Lead</th>
                    <th className="text-left py-2 font-medium text-gray-500">Tasks Completed</th>
                    <th className="text-left py-2 font-medium text-gray-500">Completion Rate</th>
                    <th className="text-left py-2 font-medium text-gray-500">Last Activity</th>
                  </tr>
                </thead>
                <tbody>
                  {data.leads.performanceData.slice(0, 5).map((lead, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3">
                        <div>
                          <p className="font-medium text-gray-900">{lead.name}</p>
                          <p className="text-sm text-gray-500">{lead.email}</p>
                        </div>
                      </td>
                      <td className="py-3 text-gray-900">{lead.tasksCompleted}</td>
                      <td className="py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          lead.completionRate >= 80 ? 'bg-green-100 text-green-800' :
                          lead.completionRate >= 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {Math.round(lead.completionRate)}%
                        </span>
                      </td>
                      <td className="py-3 text-gray-500">
                        {new Date(lead.lastActivity).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No active leads yet</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};