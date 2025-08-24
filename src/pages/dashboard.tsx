import React from 'react';
import { motion } from 'framer-motion';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/useAuth';
import { AdvocateDashboard } from '@/components/dashboards/AdvocateDashboard';
import { LeadDashboard } from '@/components/dashboards/LeadDashboard';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  if (!user?.role) {
    return (
      <MainLayout title="Access Denied" showNavigation={false}>
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-6">
              You don't have access to this dashboard. Please contact an administrator if you believe this is an error.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">How to get access:</h3>
              <ul className="text-sm text-blue-800 space-y-1 text-left">
                <li>• Apply for a DevRel position</li>
                <li>• Wait for approval from our team</li>
                <li>• Check your email for updates</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout 
      title={`Dashboard - ${user.role === 'DEVREL_ADVOCATE' ? 'Advocate' : 'Lead'}`}
      description="Your DevRel dashboard for managing tasks and tracking progress"
    >
      <ProtectedRoute>
        {user.role === 'DEVREL_ADVOCATE' && <AdvocateDashboard />}
        {user.role === 'DEVREL_LEAD' && <LeadDashboard />}
      </ProtectedRoute>
    </MainLayout>
  );
};

export default DashboardPage;