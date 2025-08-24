import { type NextApiRequest, type NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { API_STATUS_CODES } from '@/constants';
import type { UserRole } from '@/interfaces';

// API Response helper
export const sendAPIResponse = (data: any) => data;

// Authentication middleware
export const withAuth = (
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const session = await getServerSession(req, res, authOptions);

      if (!session || !session.user) {
        return res.status(API_STATUS_CODES.UNAUTHORIZED).json(
          sendAPIResponse({
            status: false,
            message: 'Authentication required',
          })
        );
      }

      if (!session.user.isAuthorized) {
        return res.status(API_STATUS_CODES.FORBIDDEN).json(
          sendAPIResponse({
            status: false,
            message: 'Access denied. You are not authorized to access this platform.',
          })
        );
      }

      // Attach user to request for handler use
      (req as any).user = session.user;

      return handler(req, res);
    } catch (error) {
      console.error('Authentication error:', error);
      return res.status(API_STATUS_CODES.INTERNAL_SERVER_ERROR).json(
        sendAPIResponse({
          status: false,
          error,
          message: 'Authentication error',
        })
      );
    }
  };

// Role-based authorization middleware
export const withRole = (
  roles: UserRole | UserRole[],
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) =>
  withAuth(async (req: NextApiRequest, res: NextApiResponse) => {
    const user = (req as any).user;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(user.role)) {
      return res.status(API_STATUS_CODES.FORBIDDEN).json(
        sendAPIResponse({
          status: false,
          message: `Access denied. Required role: ${allowedRoles.join(' or ')}`,
        })
      );
    }

    return handler(req, res);
  });

// Advocate-only middleware
export const withAdvocateAuth = (
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) => withRole('advocate', handler);

// Lead-only middleware
export const withLeadAuth = (
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) => withRole('lead', handler);

// Mixed role middleware (both advocates and leads)
export const withDevRelAuth = (
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) => withRole(['advocate', 'lead'], handler);

// Self-access middleware (users can only access their own data)
export const withSelfAccess = (
  getTargetEmail: (req: NextApiRequest) => string,
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) =>
  withAuth(async (req: NextApiRequest, res: NextApiResponse) => {
    const user = (req as any).user;
    const targetEmail = getTargetEmail(req);

    // Advocates can access any data, leads can only access their own
    if (user.role === 'lead' && user.email !== targetEmail) {
      return res.status(API_STATUS_CODES.FORBIDDEN).json(
        sendAPIResponse({
          status: false,
          message: 'Access denied. You can only access your own data.',
        })
      );
    }

    return handler(req, res);
  });

// Database connection middleware
export const withDB = (
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { connectDB } = await import('@/lib/mongodb');
      await connectDB();
      return handler(req, res);
    } catch (error) {
      console.error('Database connection error:', error);
      return res.status(API_STATUS_CODES.INTERNAL_SERVER_ERROR).json(
        sendAPIResponse({
          status: false,
          error,
          message: 'Database connection failed',
        })
      );
    }
  };

// Combined middleware for authenticated database operations
export const withAuthDB = (
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) => withDB(withAuth(handler));

export const withAdvocateAuthDB = (
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) => withDB(withAdvocateAuth(handler));

export const withLeadAuthDB = (
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) => withDB(withLeadAuth(handler));

export const withDevRelAuthDB = (
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) => withDB(withDevRelAuth(handler));