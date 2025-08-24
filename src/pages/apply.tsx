import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircleIcon, 
  UsersIcon, 
  GlobeAltIcon, 
  AcademicCapIcon,
  RocketLaunchIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

import MainLayout from '@/components/layout/MainLayout';
import { SimpleApplicationForm } from '@/components/forms/SimpleApplicationForm';
import { devrelService, type DevRelApplication } from '@/services';

const ApplyPage: React.FC = () => {
  const handleApplicationSuccess = async (applicationData: any) => {
    try {
      // Store application data using the DevRel service
      const appData: DevRelApplication = {
        id: applicationData.applicationId,
        email: applicationData.email,
        status: applicationData.status,
        submittedAt: applicationData.submittedAt,
      };
      
      devrelService.storeApplicationLocally(appData);

      // Show success message
      console.log('Application submitted successfully:', applicationData);
      
      // You could also redirect to a success page or show additional actions
      // For example, redirect to a welcome page or show next steps
      
    } catch (error) {
      console.error('Error handling application success:', error);
    }
  };

  const benefits = [
    {
      icon: UsersIcon,
      title: 'Community Building',
      description: 'Help build and grow our global developer community',
      color: 'text-blue-600'
    },
    {
      icon: GlobeAltIcon,
      title: 'Global Network',
      description: 'Connect with developers worldwide and expand your professional network',
      color: 'text-green-600'
    },
    {
      icon: AcademicCapIcon,
      title: 'Skill Development',
      description: 'Learn from industry experts and develop leadership skills',
      color: 'text-purple-600'
    },
    {
      icon: RocketLaunchIcon,
      title: 'Career Growth',
      description: 'Gain experience in developer relations and community management',
      color: 'text-orange-600'
    },
    {
      icon: HeartIcon,
      title: 'Make Impact',
      description: 'Help thousands of developers learn and grow in their careers',
      color: 'text-red-600'
    }
  ];

  const requirements = [
    'Passion for helping developers grow',
    'Good communication and interpersonal skills',
    'Basic understanding of technology concepts',
    'Commitment to community building',
    'Willingness to learn and adapt'
  ];

  const processSteps = [
    { 
      step: '1', 
      title: 'Apply', 
      description: 'Quick 5-7 minute form',
      details: 'Fill out our comprehensive application form with your details and motivation'
    },
    { 
      step: '2', 
      title: 'Review', 
      description: 'We review your application',
      details: 'Our team carefully reviews your application within 2-3 business days'
    },
    { 
      step: '3', 
      title: 'Interview', 
      description: 'Brief chat with our team',
      details: 'Qualified candidates get invited for a friendly conversation about the role'
    },
    { 
      step: '4', 
      title: 'Onboarding', 
      description: 'Welcome to the team!',
      details: 'Successful applicants receive training and access to our DevRel dashboard'
    }
  ];

  return (
    <MainLayout
      title="Apply for DevRel Team"
      description="Apply to join The Boring Education's DevRel team and help build the future of developer education"
    >
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Join Our <span className="text-primary">DevRel Team</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed">
            Ready to shape the future of developer education? Join our amazing team of Developer Relations advocates 
            and help build the most supportive developer community in the world.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors shadow-lg"
              onClick={() => document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Start Your Application
            </motion.button>
          </div>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-20"
          id="learn-more"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Join Our DevRel Team?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Being part of our DevRel team means more than just a role - it's an opportunity to make a real impact 
              in the developer community while growing your own skills and network.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 ${benefit.color} mb-4`}>
                  <benefit.icon className="w-full h-full" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Requirements Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-20"
        >
          <div className="bg-gradient-to-r from-primary/10 to-blue-50 rounded-2xl p-8 lg:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">What We're Looking For</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                You don't need to be a coding expert to join our team. We value passion, 
                communication skills, and a genuine desire to help others grow.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Key Requirements</h3>
                <ul className="space-y-3">
                  {requirements.map((requirement, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                      className="flex items-center text-gray-700"
                    >
                      <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      {requirement}
                    </motion.li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">What You'll Gain</h3>
                <ul className="space-y-3">
                  {[
                    'Real-world community management experience',
                    'Networking with industry professionals',
                    'Leadership and communication skills',
                    'Access to exclusive learning resources',
                    'Recognition in the developer community'
                  ].map((gain, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                      className="flex items-center text-gray-700"
                    >
                      <RocketLaunchIcon className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                      {gain}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Application Process */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Simple Application Process</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our application process is designed to be simple and respectful of your time. 
              Here's what you can expect:
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{step.title}</h3>
                <p className="text-gray-600 mb-3">{step.description}</p>
                <p className="text-sm text-gray-500">{step.details}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Application Form */}
        <motion.div
          id="application-form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Apply?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Take the first step towards joining our amazing DevRel team. 
              The form below will take about 5-7 minutes to complete.
            </p>
          </div>
          
          <SimpleApplicationForm onSuccess={handleApplicationSuccess} />
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="text-center mt-20"
        >
          <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-8 lg:p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Questions About the Role?</h2>
            <p className="text-xl mb-6 opacity-90">
              We're here to help! Reach out to our team if you have any questions about 
              the DevRel position or the application process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:theboringeducation@gmail.com"
                className="bg-white text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
              >
                Email Us
              </a>
              <a
                href="https://chat.whatsapp.com/EeB7LrPRg2p3RyMOicyIAC"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary transition-colors"
              >
                Join Our Community
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default ApplyPage;