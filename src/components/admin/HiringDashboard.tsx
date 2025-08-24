import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon, 
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { hiringService, type HiringApplication, type UpdateApplicationRequest } from '@/services';

interface HiringDashboardProps {
  className?: string;
}

type ApplicationStatus = 'applied' | 'reviewing' | 'interview_scheduled' | 'approved' | 'rejected';

const statusConfig = {
  applied: { label: 'Applied', color: 'bg-blue-100 text-blue-800', icon: ClockIcon },
  reviewing: { label: 'Under Review', color: 'bg-yellow-100 text-yellow-800', icon: EyeIcon },
  interview_scheduled: { label: 'Interview Scheduled', color: 'bg-purple-100 text-purple-800', icon: CalendarIcon },
  approved: { label: 'Approved', color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800', icon: XCircleIcon },
};

export const HiringDashboard: React.FC<HiringDashboardProps> = ({ className = '' }) => {
  const [applications, setApplications] = useState<HiringApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<HiringApplication[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<HiringApplication | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateData, setUpdateData] = useState<UpdateApplicationRequest>({
    status: 'applied',
    notes: '',
    interviewDate: '',
    interviewLink: '',
  });

  // Load applications on component mount
  useEffect(() => {
    loadApplications();
  }, []);

  // Filter applications based on selected status
  useEffect(() => {
    if (selectedStatus === 'all') {
      setFilteredApplications(applications);
    } else {
      setFilteredApplications(applications.filter(app => app.status === selectedStatus));
    }
  }, [selectedStatus, applications]);

  const loadApplications = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await hiringService.getApplications();
      
      if (result.status && result.data) {
        setApplications(result.data);
      } else {
        setError(result.message || 'Failed to load applications');
      }
    } catch (err) {
      setError('An error occurred while loading applications');
      console.error('Error loading applications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId: string) => {
    try {
      const result = await hiringService.updateApplicationStatus(applicationId, updateData);
      
      if (result.status && result.data) {
        // Update local state
        setApplications(prev => 
          prev.map(app => 
            app.id === applicationId 
              ? { ...app, ...updateData, reviewedAt: new Date().toISOString() }
              : app
          )
        );
        
        // Close modal and reset form
        setIsUpdateModalOpen(false);
        setSelectedApplication(null);
        setUpdateData({
          status: 'applied',
          notes: '',
          interviewDate: '',
          interviewLink: '',
        });
        
        // Show success message
        alert('Application status updated successfully!');
      } else {
        alert(result.message || 'Failed to update application status');
      }
    } catch (err) {
      alert('An error occurred while updating the application status');
      console.error('Error updating application status:', err);
    }
  };

  const getStatusCount = (status: ApplicationStatus | 'all') => {
    if (status === 'all') return applications.length;
    return applications.filter(app => app.status === status).length;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <XCircleIcon className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Applications</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadApplications}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Hiring Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage DevRel team applications and candidates</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={loadApplications}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {(['all', 'applied', 'reviewing', 'interview_scheduled', 'approved', 'rejected'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedStatus === status
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-2xl font-bold text-gray-800">{getStatusCount(status)}</div>
            <div className="text-sm text-gray-600 capitalize">
              {status === 'all' ? 'Total' : statusConfig[status]?.label || status}
            </div>
          </button>
        ))}
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Applications ({filteredApplications.length})
          </h2>
        </div>
        
        {filteredApplications.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <UserIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">No applications found</h3>
            <p>There are no applications matching the selected criteria.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredApplications.map((application) => {
              const statusInfo = statusConfig[application.status];
              const StatusIcon = statusInfo?.icon || ClockIcon;
              
              return (
                <motion.div
                  key={application.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Application Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-800">{application.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo?.color}`}>
                          <StatusIcon className="w-4 h-4 inline mr-1" />
                          {statusInfo?.label}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <EnvelopeIcon className="w-4 h-4" />
                          {application.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <UserIcon className="w-4 h-4" />
                          {application.experienceLevel}
                        </div>
                        <div className="flex items-center gap-1">
                          <ClockIcon className="w-4 h-4" />
                          {application.availability} hours/week
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {application.techStack.slice(0, 5).map((tech, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                          >
                            {tech}
                          </span>
                        ))}
                        {application.techStack.length > 5 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                            +{application.techStack.length - 5} more
                          </span>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        <strong>Motivation:</strong> {application.motivation.substring(0, 150)}
                        {application.motivation.length > 150 && '...'}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => {
                          setSelectedApplication(application);
                          setUpdateData({
                            status: application.status,
                            notes: application.notes || '',
                            interviewDate: application.interviewDate || '',
                            interviewLink: application.interviewLink || '',
                          });
                          setIsUpdateModalOpen(true);
                        }}
                        className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        <PencilIcon className="w-4 h-4" />
                        Update Status
                      </button>
                      
                      <button
                        onClick={() => {
                          setSelectedApplication(application);
                          setIsUpdateModalOpen(true);
                        }}
                        className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <EyeIcon className="w-4 h-4" />
                        View Details
                      </button>
                    </div>
                  </div>
                  
                  {/* Application Date */}
                  <div className="mt-4 text-sm text-gray-500">
                    Applied on {formatDate(application.submittedAt)}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Update Status Modal */}
      {isUpdateModalOpen && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                Update Application Status
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {selectedApplication.name} - {selectedApplication.email}
              </p>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Status
                </label>
                <select
                  value={updateData.status}
                  onChange={(e) => setUpdateData(prev => ({ ...prev, status: e.target.value as ApplicationStatus }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {Object.entries(statusConfig).map(([status, config]) => (
                    <option key={status} value={status}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={updateData.notes}
                  onChange={(e) => setUpdateData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Add any notes about this application..."
                />
              </div>
              
              {updateData.status === 'interview_scheduled' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Interview Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={updateData.interviewDate}
                      onChange={(e) => setUpdateData(prev => ({ ...prev, interviewDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Interview Link
                    </label>
                    <input
                      type="url"
                      value={updateData.interviewLink}
                      onChange={(e) => setUpdateData(prev => ({ ...prev, interviewLink: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="https://meet.google.com/..."
                    />
                  </div>
                </>
              )}
            </div>
            
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  setIsUpdateModalOpen(false);
                  setSelectedApplication(null);
                  setUpdateData({
                    status: 'applied',
                    notes: '',
                    interviewDate: '',
                    interviewLink: '',
                  });
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleStatusUpdate(selectedApplication.id)}
                className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Update Status
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}; 