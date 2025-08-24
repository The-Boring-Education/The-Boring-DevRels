import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  ExclamationCircleIcon,
  InformationCircleIcon,
  UserIcon,
  CalendarIcon,
  LinkIcon
} from '@heroicons/react/24/outline';
import { devrelService, type DevRelApplication, type DevRelApplicationStatus } from '@/services';

interface ApplicationStatusTrackerProps {
  email?: string;
  showDetails?: boolean;
  className?: string;
}

export const ApplicationStatusTracker: React.FC<ApplicationStatusTrackerProps> = ({
  email,
  showDetails = true,
  className = ''
}) => {
  const [application, setApplication] = useState<DevRelApplication | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (email) {
      checkApplicationStatus(email);
    } else {
      // Try to get from local storage
      const localApp = devrelService.getLocalApplication();
      if (localApp) {
        setApplication(localApp);
      }
    }
  }, [email]);

  const checkApplicationStatus = async (userEmail: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await devrelService.checkApplicationStatus(userEmail);
      if (result.status && result.data) {
        setApplication(result.data);
        // Update local storage with fresh data
        devrelService.storeApplicationLocally(result.data);
      } else {
        setApplication(null);
      }
    } catch (err) {
      setError('Failed to check application status');
      console.error('Error checking status:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-gray-600">Checking application status...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center">
          <ExclamationCircleIcon className="w-5 h-5 text-red-400 mr-3" />
          <span className="text-red-700">{error}</span>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center">
          <InformationCircleIcon className="w-5 h-5 text-blue-400 mr-3" />
          <span className="text-blue-700">No application found. Please submit your application first.</span>
        </div>
      </div>
    );
  }

  const progress = devrelService.getApplicationProgress(application.status);
  const nextSteps = devrelService.getNextSteps(application.status);

  const getStatusIcon = (status: DevRelApplicationStatus) => {
    switch (status) {
      case 'applied':
        return <ClockIcon className="w-6 h-6 text-blue-500" />;
      case 'reviewing':
        return <InformationCircleIcon className="w-6 h-6 text-yellow-500" />;
      case 'interview_scheduled':
        return <CalendarIcon className="w-6 h-6 text-purple-500" />;
      case 'approved':
        return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
      case 'rejected':
        return <ExclamationCircleIcon className="w-6 h-6 text-red-500" />;
      case 'offer_sent':
        return <UserIcon className="w-6 h-6 text-indigo-500" />;
      case 'offer_accepted':
        return <CheckCircleIcon className="w-6 h-6 text-green-600" />;
      case 'onboarded':
        return <CheckCircleIcon className="w-6 h-6 text-green-700" />;
      default:
        return <InformationCircleIcon className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status: DevRelApplicationStatus) => {
    switch (status) {
      case 'applied':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'reviewing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'interview_scheduled':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'offer_sent':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'offer_accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'onboarded':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getStatusIcon(application.status)}
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Application Status</h3>
              <p className="text-sm text-gray-600">Submitted on {formatDate(application.submittedAt)}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(application.status)}`}>
            {application.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="p-6 border-b border-gray-200">
        <div className="mb-3">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-primary h-2 rounded-full transition-all duration-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="p-6 border-b border-gray-200">
        <h4 className="text-md font-semibold text-gray-800 mb-3">Next Steps</h4>
        <ul className="space-y-2">
          {nextSteps.map((step, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-2"
            >
              <CheckCircleIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">{step}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Additional Details */}
      {showDetails && (
        <div className="p-6">
          <h4 className="text-md font-semibold text-gray-800 mb-3">Application Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Application ID:</span>
              <span className="ml-2 font-mono text-gray-800">{application.id}</span>
            </div>
            <div>
              <span className="text-gray-600">Email:</span>
              <span className="ml-2 text-gray-800">{application.email}</span>
            </div>
            
            {application.reviewedAt && (
              <div>
                <span className="text-gray-600">Reviewed:</span>
                <span className="ml-2 text-gray-800">{formatDate(application.reviewedAt)}</span>
              </div>
            )}
            
            {application.approvedAt && (
              <div>
                <span className="text-gray-600">Approved:</span>
                <span className="ml-2 text-gray-800">{formatDate(application.approvedAt)}</span>
              </div>
            )}
            
            {application.rejectedAt && (
              <div>
                <span className="text-gray-600">Rejected:</span>
                <span className="ml-2 text-gray-800">{formatDate(application.rejectedAt)}</span>
              </div>
            )}

            {application.interviewDate && (
              <div>
                <span className="text-gray-600">Interview Date:</span>
                <span className="ml-2 text-gray-800">{formatDate(application.interviewDate)}</span>
              </div>
            )}

            {application.interviewLink && (
              <div className="md:col-span-2">
                <span className="text-gray-600">Interview Link:</span>
                <a 
                  href={application.interviewLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-2 text-primary hover:underline flex items-center"
                >
                  <LinkIcon className="w-4 h-4 mr-1" />
                  Join Meeting
                </a>
              </div>
            )}

            {application.rejectionReason && (
              <div className="md:col-span-2">
                <span className="text-gray-600">Rejection Reason:</span>
                <p className="ml-2 text-gray-800 mt-1">{application.rejectionReason}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="p-6 bg-gray-50 rounded-b-lg">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => checkApplicationStatus(application.email)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            Refresh Status
          </button>
          
          {application.status === 'rejected' && (
            <button
              onClick={() => devrelService.clearLocalApplication()}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
            >
              Clear Application
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationStatusTracker; 