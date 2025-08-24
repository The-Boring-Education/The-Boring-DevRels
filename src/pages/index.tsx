import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  UserGroupIcon, 
  AcademicCapIcon, 
  LightBulbIcon,
  RocketLaunchIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

import MainLayout from '@/components/layout/MainLayout';

const DevRelLandingPage = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Build the Future of
              <span className="text-blue-600 block">Developer Relations</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Join The Boring Education's DevRel team and help us create an amazing developer community. 
              Shape the future of developer education through community building and meaningful connections.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/apply" className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-lg">
                Apply Now - It's Free! 🚀
              </Link>
              <a href="#about" className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-lg">
                Learn More
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "1000+", label: "Developers Reached" },
              { number: "50+", label: "Community Events" },
              { number: "100%", label: "Remote Friendly" },
              { number: "24/7", label: "Community Support" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-6"
              >
                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What is DevRel Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              What You'll Do as a DevRel
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Developer Relations is about building bridges between technology and developer communities. 
              You'll be the voice of developers and help create meaningful experiences.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: UserGroupIcon,
                title: "Community Building",
                description: "Foster vibrant developer communities and facilitate meaningful connections."
              },
              {
                icon: AcademicCapIcon,
                title: "Education & Content",
                description: "Create educational content, tutorials, and resources for developers."
              },
              {
                icon: LightBulbIcon,
                title: "Developer Advocacy",
                description: "Be the voice of developers and advocate for their needs and feedback."
              },
              {
                icon: RocketLaunchIcon,
                title: "Event Management",
                description: "Organize workshops, meetups, and conferences to bring developers together."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-sm text-center"
              >
                <item.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Join Section */}
      <section id="why-join" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Why Join Our DevRel Team?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We offer an environment where you can grow, learn, and make a real impact in the developer community.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "🚀 Career Growth Opportunities",
              "🌍 Remote-First Culture", 
              "📚 Continuous Learning Resources",
              "🤝 Mentorship & Guidance",
              "💡 Innovation Freedom",
              "🎯 Real Impact on Developers",
              "🏆 Recognition & Rewards",
              "🌟 Industry Networking",
              "💻 Latest Tools & Technologies"
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex items-center p-4 bg-gray-50 rounded-lg"
              >
                <CheckCircleIcon className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-800 font-medium">{benefit.slice(2)}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Simple Application Process */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Simple Application Process
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We've streamlined our hiring process to be quick and efficient while ensuring we find the right fit.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Quick Application",
                description: "Fill out our simple application form with your basic info and motivation.",
                icon: "📝"
              },
              {
                step: "02", 
                title: "Review & Interview",
                description: "Our team reviews your application and schedules a friendly chat.",
                icon: "💬"
              },
              {
                step: "03",
                title: "Welcome Aboard!",
                description: "Get your offer letter and access to your personalized dashboard.",
                icon: "🎉"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="text-3xl mb-4">{step.icon}</div>
                  <div className="text-2xl font-bold text-blue-600 mb-2">{step.step}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Start Your DevRel Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join our amazing team and help shape the future of developer education. 
              Your journey starts with a simple application.
            </p>
            <Link href="/apply" className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block text-lg">
              Apply Now - Takes 5 Minutes! 🚀
            </Link>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
};

export default DevRelLandingPage; 