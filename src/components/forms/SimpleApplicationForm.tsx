import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { motion } from 'framer-motion';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

// Simplified validation schema - only essential fields
const applicationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  techStack: z.array(z.string()).min(1, 'Please select at least one technology'),
  experienceLevel: z.string().min(1, 'Please select your experience level'),
  availability: z.string().min(1, 'Please select your availability'),
  motivation: z.string().min(30, 'Please share why you want to join (minimum 30 characters)'),
  whyTBE: z.string().min(30, 'Please tell us why TBE interests you (minimum 30 characters)'),
  commitments: z.object({
    weeklyLearning: z.boolean(),
    communityParticipation: z.boolean(),
    eventAttendance: z.boolean(),
    contentCreation: z.boolean(),
    socialMediaEngagement: z.boolean(),
  }),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

const TECH_STACKS = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'React', 'Next.js', 'Node.js',
  'Express', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'UI/UX', 'Mobile Development'
];

const EXPERIENCE_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const AVAILABILITY = ['5-10 hours/week', '10-15 hours/week', '15-20 hours/week', '20+ hours/week'];

// API Base URL - Update this to point to your tbe-webapp deployment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface SimpleApplicationFormProps {
  onSuccess?: () => void;
}

export const SimpleApplicationForm: React.FC<SimpleApplicationFormProps> = ({ onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    setValue,
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    mode: 'onChange',
    defaultValues: {
      techStack: [],
      commitments: {
        weeklyLearning: false,
        communityParticipation: false,
        eventAttendance: false,
        contentCreation: false,
        socialMediaEngagement: false,
      },
    },
  });

  const watchedTechStack = watch('techStack') || [];
  const watchedCommitments = watch('commitments');

  const toggleTechStack = (tech: string) => {
    const current = watchedTechStack;
    if (current.includes(tech)) {
      setValue('techStack', current.filter(t => t !== tech));
    } else {
      setValue('techStack', [...current, tech]);
    }
  };

  const toggleCommitment = (commitment: keyof ApplicationFormData['commitments']) => {
    setValue(`commitments.${commitment}`, !watchedCommitments[commitment]);
  };

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await axios.post(`${API_BASE_URL}devrel/apply`, {
        ...data,
        learningFocus: ['Community Building'], // Default for DevRel
      });
      
      if (response.data.status) {
        setSubmitStatus('success');
        onSuccess?.();
      } else {
        throw new Error(response.data.message || 'Application submission failed');
      }
    } catch (error: any) {
      setSubmitStatus('error');
      setErrorMessage(error.response?.data?.message || error.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center p-8 bg-white rounded-lg shadow-lg"
      >
        <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted! 🎉</h2>
        <p className="text-gray-600 mb-6">
          Thank you for applying to join our DevRel team. We'll review your application and get back to you soon.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
          <ul className="text-sm text-blue-800 space-y-1 text-left">
            <li>• You'll receive an email with next steps</li>
            <li>• Watch for intro video and assessment</li>
            <li>• Qualified candidates will get interview invites</li>
            <li>• Successful applicants receive offer letter + dashboard access</li>
          </ul>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-8"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Apply for DevRel Team</h2>
          <p className="text-gray-600">Join us in building an amazing developer community!</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  {...register('name')}
                  type="text"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Your full name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="your.email@example.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience Level *
                </label>
                <select
                  {...register('experienceLevel')}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.experienceLevel ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select your level</option>
                  {EXPERIENCE_LEVELS.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
                {errors.experienceLevel && <p className="text-red-500 text-sm mt-1">{errors.experienceLevel.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weekly Availability *
                </label>
                <select
                  {...register('availability')}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.availability ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select availability</option>
                  {AVAILABILITY.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
                {errors.availability && <p className="text-red-500 text-sm mt-1">{errors.availability.message}</p>}
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tech Stack * (Select all that apply)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {TECH_STACKS.map(tech => (
                <button
                  key={tech}
                  type="button"
                  onClick={() => toggleTechStack(tech)}
                  className={`p-2 text-sm rounded-md border transition-colors ${
                    watchedTechStack.includes(tech)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>
            {errors.techStack && <p className="text-red-500 text-sm mt-1">{errors.techStack.message}</p>}
          </div>

          {/* Motivation */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Tell Us About Yourself</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Why do you want to join our DevRel team? *
              </label>
              <textarea
                {...register('motivation')}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.motivation ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Share your passion for developer relations and community building..."
              />
              {errors.motivation && <p className="text-red-500 text-sm mt-1">{errors.motivation.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Why The Boring Education? *
              </label>
              <textarea
                {...register('whyTBE')}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.whyTBE ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="What excites you about TBE's mission and community?"
              />
              {errors.whyTBE && <p className="text-red-500 text-sm mt-1">{errors.whyTBE.message}</p>}
            </div>
          </div>

          {/* Commitments */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Commitments</h3>
            <p className="text-gray-600 mb-4">As a DevRel, we'd love your help with:</p>
            
            <div className="space-y-3">
              {[
                { key: 'weeklyLearning', label: 'Weekly Learning & Skill Development' },
                { key: 'communityParticipation', label: 'WhatsApp Community Participation' },
                { key: 'eventAttendance', label: 'Event Attendance & Networking' },
                { key: 'contentCreation', label: 'Content Creation & Sharing' },
                { key: 'socialMediaEngagement', label: 'Social Media Engagement' },
              ].map(commitment => (
                <label key={commitment.key} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={watchedCommitments[commitment.key as keyof typeof watchedCommitments]}
                    onChange={() => toggleCommitment(commitment.key as keyof ApplicationFormData['commitments'])}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">{commitment.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {submitStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center"
            >
              <ExclamationCircleIcon className="w-5 h-5 text-red-400 mr-2" />
              <span className="text-red-700">{errorMessage}</span>
            </motion.div>
          )}

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting || !isValid}
              className={`w-full py-3 px-4 rounded-md font-semibold text-white transition-colors ${
                isSubmitting || !isValid
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};