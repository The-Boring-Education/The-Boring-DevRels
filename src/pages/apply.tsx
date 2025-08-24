import React from 'react';
import { motion } from 'framer-motion';

import MainLayout from '@/components/layout/MainLayout';
import { SimpleApplicationForm } from '@/components/forms/SimpleApplicationForm';

const ApplyPage: React.FC = () => {
  const handleApplicationSuccess = () => {
    // Could redirect or show additional success actions
    console.log('Application submitted successfully');
  };

  return (
    <MainLayout
      title="Apply for DevRel Team"
      description="Apply to join The Boring Education's DevRel team and help build the future of developer education"
    >

      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-gray-700 mb-4">
              Join Our DevRel Team
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-8">
              Ready to shape the future of developer education? 
              Fill out this quick application and take the first step towards joining our amazing team.
            </p>
            
            {/* Application Process Steps */}
            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {[
                { step: '1', title: 'Apply', description: 'Quick 5-minute form' },
                { step: '2', title: 'Review', description: 'We review your application' },
                { step: '3', title: 'Interview', description: 'Brief chat with our team' },
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {item.step}
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-gray-700">{item.title}</h3>
                    <p className="text-sm text-gray-700">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Application Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <SimpleApplicationForm onSuccess={handleApplicationSuccess} />
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ApplyPage;