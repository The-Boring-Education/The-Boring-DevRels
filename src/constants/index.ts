// DevRel Platform Constants

export const DATABASE_MODELS = {
  DEVREL_ADVOCATE: 'DevRelAdvocate',
  DEVREL_LEAD: 'DevRelLead',
  DEVREL_APPLICATION: 'DevRelApplication',
  DEVREL_TASK: 'DevRelTask',
} as const;

export const USER_ROLES = {
  ADVOCATE: 'advocate',
  LEAD: 'lead',
} as const;

export const APPLICATION_STATUS = {
  APPLIED: 'applied',
  UNDER_REVIEW: 'under_review',
  INTERVIEW_SCHEDULED: 'interview_scheduled',
  INTERVIEW_COMPLETED: 'interview_completed',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  OFFER_SENT: 'offer_sent',
  OFFER_ACCEPTED: 'offer_accepted',
  ONBOARDED: 'onboarded',
} as const;

export const TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  OVERDUE: 'overdue',
} as const;

export const TASK_TYPES = {
  ONBOARDING: 'onboarding',
  WEEKLY: 'weekly',
  SPECIAL: 'special',
  TRAINING: 'training',
} as const;

export const TECH_STACKS = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'React',
  'Next.js',
  'Node.js',
  'Express',
  'MongoDB',
  'PostgreSQL',
  'MySQL',
  'AWS',
  'Docker',
  'Kubernetes',
  'DevOps',
  'AI/ML',
  'Blockchain',
  'Mobile Development',
  'UI/UX',
  'Data Science',
] as const;

export const EXPERIENCE_LEVELS = [
  'Beginner',
  'Intermediate', 
  'Advanced',
  'Expert',
] as const;

export const LEARNING_FOCUS = [
  'Frontend Development',
  'Backend Development',
  'Full Stack Development',
  'DevOps',
  'Data Science',
  'AI/ML',
  'Mobile Development',
  'Blockchain',
  'UI/UX Design',
  'Product Management',
  'Technical Writing',
  'Community Building',
] as const;

export const AVAILABILITY = [
  '5-10 hours/week',
  '10-15 hours/week', 
  '15-20 hours/week',
  '20+ hours/week',
] as const;

export const API_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// DevRel Advocate Emails (Campus Connect Team)
export const DEVREL_ADVOCATE_EMAILS = [
  'theboringeducation@gmail.com',
  'bharatmakwana@tbe.com',
  // Add more advocate emails as needed
] as const;

export const DEFAULT_ONBOARDING_TASKS = [
  {
    title: 'Complete Profile Setup',
    description: 'Fill out your complete DevRel profile with bio, social links, and expertise areas',
    type: TASK_TYPES.ONBOARDING,
    priority: 'high',
  },
  {
    title: 'Join WhatsApp Community',
    description: 'Join the official TBE DevRel WhatsApp community for updates and discussions',
    type: TASK_TYPES.ONBOARDING,
    priority: 'high',
  },
  {
    title: 'Share Introduction Post',
    description: 'Share an introduction post on LinkedIn with #TBEDevRel hashtag',
    type: TASK_TYPES.ONBOARDING,
    priority: 'medium',
  },
  {
    title: 'Attend Orientation Session',
    description: 'Attend the DevRel orientation session to understand roles and responsibilities',
    type: TASK_TYPES.ONBOARDING,
    priority: 'high',
  },
  {
    title: 'Setup Social Media Presence',
    description: 'Update your LinkedIn, Twitter profiles to reflect TBE DevRel role',
    type: TASK_TYPES.ONBOARDING,
    priority: 'medium',
  },
] as const;