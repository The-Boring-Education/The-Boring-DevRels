import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { hiringService, type CreateApplicationRequest } from '@/services';

// Enhanced validation schema with better error messages
const applicationSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters long')
    .max(100, 'Name cannot exceed 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  
  email: z.string()
    .email('Please enter a valid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(100, 'Email cannot exceed 100 characters'),
  
  currentRole: z.string()
    .min(2, 'Current role must be at least 2 characters')
    .max(100, 'Current role cannot exceed 100 characters')
    .optional(),
  
  company: z.string()
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name cannot exceed 100 characters')
    .optional(),
  
  linkedinProfile: z.string()
    .url('Please enter a valid LinkedIn profile URL')
    .optional()
    .or(z.literal('')),
  
  githubProfile: z.string()
    .url('Please enter a valid GitHub profile URL')
    .optional()
    .or(z.literal('')),
  
  portfolioUrl: z.string()
    .url('Please enter a valid portfolio URL')
    .optional()
    .or(z.literal('')),
  
  techStack: z.array(z.string())
    .min(1, 'Please select at least one technology')
    .max(10, 'You can select up to 10 technologies'),
  
  experienceLevel: z.string()
    .min(1, 'Please select your experience level'),
  
  availability: z.string()
    .min(1, 'Please select your weekly availability'),
  
  previousExperience: z.string()
    .min(10, 'Please describe your previous experience (minimum 10 characters)')
    .max(500, 'Previous experience cannot exceed 500 characters')
    .optional(),
  
  motivation: z.string()
    .min(50, 'Please share your motivation (minimum 50 characters)')
    .max(1000, 'Motivation cannot exceed 1000 characters'),
  
  whyTBE: z.string()
    .min(50, 'Please tell us why TBE interests you (minimum 50 characters)')
    .max(1000, 'Response cannot exceed 1000 characters'),
  
  commitments: z.object({
    weeklyLearning: z.boolean(),
    communityParticipation: z.boolean(),
    eventAttendance: z.boolean(),
    contentCreation: z.boolean(),
    socialMediaEngagement: z.boolean(),
  }).refine(
    (data) => Object.values(data).some(Boolean),
    'Please select at least one commitment area'
  ),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

// Enhanced tech stacks with better categorization
const TECH_STACKS = [
  // Frontend
  'JavaScript', 'TypeScript', 'React', 'Next.js', 'Vue.js', 'Angular', 'HTML/CSS', 'Tailwind CSS',
  // Backend
  'Node.js', 'Express', 'Python', 'Django', 'Flask', 'Java', 'Spring Boot', 'C#', '.NET',
  // Database
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase',
  // Cloud & DevOps
  'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'CI/CD',
  // Mobile & Others
  'React Native', 'Flutter', 'UI/UX Design', 'GraphQL', 'REST APIs'
];

const EXPERIENCE_LEVELS = [
  { value: 'beginner', label: 'Beginner (0-2 years)', description: 'New to tech, eager to learn' },
  { value: 'intermediate', label: 'Intermediate (2-5 years)', description: 'Some experience, building skills' },
  { value: 'advanced', label: 'Advanced (5+ years)', description: 'Experienced, ready to lead' }
];

const AVAILABILITY_OPTIONS = [
  { value: '5-10', label: '5-10 hours/week', description: 'Part-time commitment' },
  { value: '10-15', label: '10-15 hours/week', description: 'Moderate commitment' },
  { value: '15-20', label: '15-20 hours/week', description: 'High commitment' },
  { value: '20+', label: '20+ hours/week', description: 'Full-time commitment' }
];

interface SimpleApplicationFormProps {
  onSuccess?: (applicationData: any) => void;
}

export const SimpleApplicationForm: React.FC<SimpleApplicationFormProps> = ({ onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isDirty },
    setValue,
    trigger,
    setError,
    clearErrors,
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
  const watchedEmail = watch('email');

  // Check if email already has an application
  useEffect(() => {
    const checkEmail = async () => {
      if (watchedEmail && watchedEmail.length > 5 && !errors.email) {
        setIsCheckingEmail(true);
        try {
          const result = await hiringService.checkApplicationStatus(watchedEmail);
          if (result.status && result.data) {
            setError('email', { 
              type: 'manual', 
              message: 'An application with this email already exists' 
            });
          } else {
            clearErrors('email');
          }
        } catch (error) {
          console.error('Error checking email:', error);
        } finally {
          setIsCheckingEmail(false);
        }
      }
    };

    const debounceTimer = setTimeout(checkEmail, 1000);
    return () => clearTimeout(debounceTimer);
  }, [watchedEmail, errors.email, setError, clearErrors]);

  const toggleTechStack = (tech: string) => {
    const current = watchedTechStack;
    if (current.includes(tech)) {
      setValue('techStack', current.filter(t => t !== tech));
    } else {
      setValue('techStack', [...current, tech]);
    }
    trigger('techStack');
  };

  const toggleCommitment = (commitment: keyof ApplicationFormData['commitments']) => {
    setValue(`commitments.${commitment}`, !watchedCommitments[commitment]);
    trigger('commitments');
  };

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const result = await hiringService.submitApplication(data);
      
      if (result.status && result.data) {
        setSubmitStatus('success');
        onSuccess?.(result.data);
      } else {
        throw new Error(result.message || 'Application submission failed');
      }
    } catch (error: any) {
      setSubmitStatus('error');
      setErrorMessage(error.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center p-8 bg-white rounded-lg shadow-lg border border-green-200"
      >
        <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Application Submitted! 🎉</h2>
        <p className="text-gray-700 mb-6">
          Thank you for applying to join our DevRel team. We'll review your application and get back to you soon.
        </p>
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <h3 className="font-semibold text-primary mb-2">What's Next?</h3>
          <ul className="text-sm text-primary/80 space-y-1 text-left">
            <li>• You'll receive an email confirmation within 24 hours</li>
            <li>• Our team will review your application (2-3 business days)</li>
            <li>• Qualified candidates will receive interview invitations</li>
            <li>• Successful applicants get offer letters and dashboard access</li>
          </ul>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-8 border border-gray-200"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-700 mb-2">Apply for DevRel Team</h2>
          <p className="text-gray-600">Join us in building an amazing developer community!</p>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-center text-blue-700">
              <InformationCircleIcon className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">This form takes about 5-7 minutes to complete</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information Section */}
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-2">
              <h3 className="text-xl font-semibold text-gray-700">Basic Information</h3>
              <p className="text-sm text-gray-600 mt-1">Tell us about yourself</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('name')}
                  type="text"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors placeholder:text-gray-400 ${
                    errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder="Enter your full name (e.g., John Doe)"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <ExclamationCircleIcon className="w-4 h-4 mr-1" />
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    {...register('email')}
                    type="email"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors placeholder:text-gray-400 ${
                      errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="your.email@example.com"
                  />
                  {isCheckingEmail && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                    </div>
                  )}
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <ExclamationCircleIcon className="w-4 h-4 mr-1" />
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Role
                </label>
                <input
                  {...register('currentRole')}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors placeholder:text-gray-400 hover:border-gray-400"
                  placeholder="e.g., Software Developer, Student, Tech Lead"
                />
                {errors.currentRole && (
                  <p className="text-red-500 text-sm mt-1">{errors.currentRole.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company/Organization
                </label>
                <input
                  {...register('company')}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors placeholder:text-gray-400 hover:border-gray-400"
                  placeholder="e.g., Google, University, Freelance"
                />
                {errors.company && (
                  <p className="text-red-500 text-sm mt-1">{errors.company.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn Profile
                </label>
                <input
                  {...register('linkedinProfile')}
                  type="url"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors placeholder:text-gray-400 hover:border-gray-400"
                  placeholder="https://linkedin.com/in/username"
                />
                {errors.linkedinProfile && (
                  <p className="text-red-500 text-sm mt-1">{errors.linkedinProfile.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GitHub Profile
                </label>
                <input
                  {...register('githubProfile')}
                  type="url"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors placeholder:text-gray-400 hover:border-gray-400"
                  placeholder="https://github.com/username"
                />
                {errors.githubProfile && (
                  <p className="text-red-500 text-sm mt-1">{errors.githubProfile.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Portfolio Website
                </label>
                <input
                  {...register('portfolioUrl')}
                  type="url"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors placeholder:text-gray-400 hover:border-gray-400"
                  placeholder="https://yourportfolio.com"
                />
                {errors.portfolioUrl && (
                  <p className="text-red-500 text-sm mt-1">{errors.portfolioUrl.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Professional Background Section */}
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-2">
              <h3 className="text-xl font-semibold text-gray-700">Professional Background</h3>
              <p className="text-sm text-gray-600 mt-1">Your experience and skills</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Level <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('experienceLevel')}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${
                    errors.experienceLevel ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <option value="" className="text-gray-500">Select your experience level</option>
                  {EXPERIENCE_LEVELS.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label} - {level.description}
                    </option>
                  ))}
                </select>
                {errors.experienceLevel && (
                  <p className="text-red-500 text-sm mt-1">{errors.experienceLevel.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weekly Availability <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('availability')}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${
                    errors.availability ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <option value="" className="text-gray-500">Select your availability</option>
                  {AVAILABILITY_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label} - {option.description}
                    </option>
                  ))}
                </select>
                {errors.availability && (
                  <p className="text-red-500 text-sm mt-1">{errors.availability.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Previous Experience (Optional)
              </label>
              <textarea
                {...register('previousExperience')}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors placeholder:text-gray-400 hover:border-gray-400"
                placeholder="Describe your relevant experience in community building, content creation, or developer relations..."
              />
              {errors.previousExperience && (
                <p className="text-red-500 text-sm mt-1">{errors.previousExperience.message}</p>
              )}
            </div>
          </div>

          {/* Tech Stack Section */}
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-2">
              <h3 className="text-xl font-semibold text-gray-700">Technical Skills</h3>
              <p className="text-sm text-gray-600 mt-1">Select all technologies you're familiar with</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tech Stack <span className="text-red-500">*</span> 
                <span className="text-sm font-normal text-gray-500 ml-2">
                  (Select at least 1, up to 10)
                </span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {TECH_STACKS.map(tech => (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => toggleTechStack(tech)}
                    className={`p-3 text-sm rounded-lg border transition-all duration-200 font-medium ${
                      watchedTechStack.includes(tech)
                        ? 'bg-primary text-white border-primary shadow-md transform scale-105'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm'
                    }`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Selected: {watchedTechStack.length}/10 technologies
              </div>
              {errors.techStack && (
                <p className="text-red-500 text-sm mt-1">{errors.techStack.message}</p>
              )}
            </div>
          </div>

          {/* Motivation Section */}
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-2">
              <h3 className="text-xl font-semibold text-gray-700">Your Motivation</h3>
              <p className="text-sm text-gray-600 mt-1">Tell us why you want to join</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Why do you want to join our DevRel team? <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('motivation')}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors placeholder:text-gray-400 ${
                  errors.motivation ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                placeholder="Share your passion for developer relations, community building, and why you're excited about this opportunity. What drives you to help other developers grow?"
              />
              <div className="mt-1 text-sm text-gray-500">
                {watch('motivation')?.length || 0}/1000 characters
              </div>
              {errors.motivation && (
                <p className="text-red-500 text-sm mt-1">{errors.motivation.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Why The Boring Education? <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('whyTBE')}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors placeholder:text-gray-400 ${
                  errors.whyTBE ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                placeholder="What excites you about TBE's mission? How do you see yourself contributing to our community? What aspects of our platform resonate with you?"
              />
              <div className="mt-1 text-sm text-gray-500">
                {watch('whyTBE')?.length || 0}/1000 characters
              </div>
              {errors.whyTBE && (
                <p className="text-red-500 text-sm mt-1">{errors.whyTBE.message}</p>
              )}
            </div>
          </div>

          {/* Commitments Section */}
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-2">
              <h3 className="text-xl font-semibold text-gray-700">Your Commitments</h3>
              <p className="text-sm text-gray-600 mt-1">As a DevRel, we'd love your help with:</p>
            </div>
            
            <div className="space-y-4">
              {[
                { 
                  key: 'weeklyLearning', 
                  label: 'Weekly Learning & Skill Development',
                  description: 'Commit to continuous learning and sharing knowledge'
                },
                { 
                  key: 'communityParticipation', 
                  label: 'WhatsApp Community Participation',
                  description: 'Engage actively in our community discussions'
                },
                { 
                  key: 'eventAttendance', 
                  label: 'Event Attendance & Networking',
                  description: 'Participate in meetups, workshops, and events'
                },
                { 
                  key: 'contentCreation', 
                  label: 'Content Creation & Sharing',
                  description: 'Create and share valuable content with the community'
                },
                { 
                  key: 'socialMediaEngagement', 
                  label: 'Social Media Engagement',
                  description: 'Help promote TBE and engage with our audience'
                },
              ].map(commitment => (
                <label key={commitment.key} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={watchedCommitments[commitment.key as keyof typeof watchedCommitments]}
                    onChange={() => toggleCommitment(commitment.key as keyof ApplicationFormData['commitments'])}
                    className="mt-1 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <div className="flex-1">
                    <span className="text-gray-700 font-medium">{commitment.label}</span>
                    <p className="text-sm text-gray-500 mt-1">{commitment.description}</p>
                  </div>
                </label>
              ))}
            </div>
            {errors.commitments && (
              <p className="text-red-500 text-sm mt-1">{errors.commitments.message}</p>
            )}
          </div>

          {/* Error Message */}
          {submitStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start"
            >
              <ExclamationCircleIcon className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-red-800 mb-1">Submission Failed</h4>
                <p className="text-red-700">{errorMessage}</p>
              </div>
            </motion.div>
          )}

          {/* Submit Button */}
          <div className="pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting || !isValid || !isDirty}
              className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
                isSubmitting || !isValid || !isDirty
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary hover:bg-primary/90 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Submitting Application...
                </div>
              ) : (
                'Submit Application'
              )}
            </button>
            
            {!isValid && (
              <p className="text-center text-sm text-gray-500 mt-3">
                Please fill in all required fields correctly to submit your application
              </p>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};