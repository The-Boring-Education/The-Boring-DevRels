import type { NextApiRequest, NextApiResponse } from 'next';
import { withDB, sendAPIResponse } from '@/middleware/auth';
import { createApplicationInDB, createLeadInDB, checkApplicationExistsFromDB } from '@/database/queries';
import { API_STATUS_CODES } from '@/constants';
import type { CreateApplicationRequest } from '@/interfaces';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(API_STATUS_CODES.BAD_REQUEST).json(
      sendAPIResponse({
        status: false,
        message: 'Method not allowed',
      })
    );
  }

  try {
    const applicationData: CreateApplicationRequest = req.body;

    // Validate required fields
    const requiredFields = [
      'name', 'email', 'techStack', 'experienceLevel', 
      'learningFocus', 'availability', 'motivation', 'whyTBE', 'commitments'
    ];

    const missingFields = requiredFields.filter(field => !applicationData[field as keyof CreateApplicationRequest]);
    
    if (missingFields.length > 0) {
      return res.status(API_STATUS_CODES.BAD_REQUEST).json(
        sendAPIResponse({
          status: false,
          message: `Missing required fields: ${missingFields.join(', ')}`,
        })
      );
    }

    // Check if application already exists
    const { data: exists } = await checkApplicationExistsFromDB(applicationData.email);
    
    if (exists) {
      return res.status(API_STATUS_CODES.BAD_REQUEST).json(
        sendAPIResponse({
          status: false,
          message: 'Application already exists for this email address',
        })
      );
    }

    // Create application record
    const { data: application, error: appError } = await createApplicationInDB(applicationData);
    
    if (appError || !application) {
      return res.status(API_STATUS_CODES.INTERNAL_SERVER_ERROR).json(
        sendAPIResponse({
          status: false,
          message: appError || 'Failed to create application',
        })
      );
    }

    // Create corresponding lead record
    const { data: lead, error: leadError } = await createLeadInDB({
      name: applicationData.name,
      email: applicationData.email,
      role: 'lead',
      status: 'applied',
      applicationData: {
        techStack: applicationData.techStack,
        experienceLevel: applicationData.experienceLevel,
        learningFocus: applicationData.learningFocus,
        availability: applicationData.availability,
        currentRole: applicationData.currentRole,
        company: applicationData.company,
        linkedinProfile: applicationData.linkedinProfile,
        githubProfile: applicationData.githubProfile,
        portfolioUrl: applicationData.portfolioUrl,
        motivation: applicationData.motivation,
        previousExperience: applicationData.previousExperience,
        whyTBE: applicationData.whyTBE,
      },
      commitments: applicationData.commitments,
      onboardingProgress: {
        isStarted: false,
        completedTasks: [],
        completionPercentage: 0,
      },
      performanceMetrics: {
        tasksCompleted: 0,
        tasksAssigned: 0,
        averageCompletionTime: 0,
        streakCount: 0,
      },
    });

    if (leadError || !lead) {
      return res.status(API_STATUS_CODES.INTERNAL_SERVER_ERROR).json(
        sendAPIResponse({
          status: false,
          message: leadError || 'Failed to create lead record',
        })
      );
    }

    return res.status(API_STATUS_CODES.CREATED).json(
      sendAPIResponse({
        status: true,
        message: 'Application submitted successfully!',
        data: {
          applicationId: application._id,
          leadId: lead._id,
          email: applicationData.email,
          status: 'applied',
          submittedAt: application.submittedAt,
        },
      })
    );

  } catch (error) {
    console.error('Error processing application:', error);
    return res.status(API_STATUS_CODES.INTERNAL_SERVER_ERROR).json(
      sendAPIResponse({
        status: false,
        error,
        message: 'Internal server error while processing application',
      })
    );
  }
};

export default withDB(handler);