# DevRel Hiring System

A comprehensive hiring management system for The Boring Education's DevRel team, built with Next.js, TypeScript, and modern web technologies.

## 🚀 Features

### For Applicants
- **Streamlined Application Form**: 5-7 minute comprehensive application process
- **Real-time Validation**: Instant feedback on form inputs with helpful error messages
- **Email Duplicate Check**: Prevents duplicate applications automatically
- **Progress Tracking**: Clear indication of form completion status
- **Mobile-Responsive**: Optimized for all device sizes

### For DevRel Advocates (Admin)
- **Hiring Dashboard**: Complete overview of all applications
- **Status Management**: Update application statuses (Applied → Reviewing → Interview → Approved/Rejected)
- **Filtering & Search**: Filter applications by status, experience level, and more
- **Interview Scheduling**: Schedule interviews with candidates
- **Notes & Comments**: Add internal notes for team collaboration
- **Real-time Updates**: Instant status updates across the platform

## 🏗️ Architecture

### Frontend (The-Boring-DevRels)
- **Next.js 15**: Modern React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations and transitions
- **React Hook Form**: Form management with Zod validation

### Backend (TBE-Webapp)
- **Node.js/Express**: RESTful API endpoints
- **MongoDB**: Document database for applications and leads
- **NextAuth.js**: Authentication and authorization
- **JWT**: Secure token-based authentication

### Data Flow
```
Applicant → Frontend Form → Hiring Service → TBE-Webapp API → MongoDB
                ↓
        Email Validation → Duplicate Check → Application Creation
                ↓
        Success Response → Confirmation Page → Email Notification
```

## 📋 Prerequisites

### Environment Variables
Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://your-tbe-webapp-domain.com/api/v1/
NEXT_PUBLIC_APP_NAME=The Boring DevRels

# Authentication (if using NextAuth)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Database (if using local MongoDB)
MONGODB_URI=mongodb://localhost:27017/devrel-platform
```

### Dependencies
Ensure all required packages are installed:

```bash
npm install
# or
yarn install
```

## 🚀 Getting Started

### 1. Development Mode
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

### 2. Production Build
```bash
npm run build
npm start
# or
yarn build
yarn start
```

## 📱 Usage

### For Applicants

#### 1. Access the Application Form
Navigate to `/apply` to access the comprehensive application form.

#### 2. Fill Out the Form
The form is divided into logical sections:
- **Basic Information**: Name, email, current role, company
- **Professional Background**: Experience level, availability, previous experience
- **Technical Skills**: Tech stack selection (up to 10 technologies)
- **Motivation**: Why you want to join and why TBE
- **Commitments**: Areas where you can contribute

#### 3. Submit Application
- All required fields are clearly marked with red asterisks (*)
- Real-time validation provides immediate feedback
- Email duplicate check prevents multiple applications
- Success page shows next steps and timeline

### For DevRel Advocates

#### 1. Access Hiring Dashboard
Navigate to the hiring dashboard (requires authentication and proper permissions).

#### 2. Review Applications
- View all applications with status overview
- Filter by application status
- Sort by submission date, experience level, etc.

#### 3. Update Application Status
Click "Update Status" on any application to:
- Change status (Applied → Reviewing → Interview → Approved/Rejected)
- Add internal notes
- Schedule interviews with date/time and meeting links
- Track review history

#### 4. Manage Candidates
- Export application data
- Send bulk communications
- Track interview outcomes
- Monitor application pipeline

## 🔌 API Endpoints

### Application Management

#### Submit Application
```http
POST /api/v1/devrel/apply
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "techStack": ["JavaScript", "React", "Node.js"],
  "experienceLevel": "intermediate",
  "availability": "10-15",
  "motivation": "I'm passionate about...",
  "whyTBE": "TBE's mission resonates...",
  "commitments": {
    "weeklyLearning": true,
    "communityParticipation": true,
    "eventAttendance": false,
    "contentCreation": true,
    "socialMediaEngagement": false
  }
}
```

#### Get Applications (Admin Only)
```http
GET /api/v1/devrel/applications
GET /api/v1/devrel/applications?status=applied
Authorization: Bearer <token>
```

#### Update Application Status (Admin Only)
```http
PUT /api/v1/devrel/applications
Content-Type: application/json
Authorization: Bearer <token>

{
  "applicationId": "app_123",
  "status": "interview_scheduled",
  "notes": "Strong candidate, schedule interview",
  "interviewDate": "2024-01-15T14:00:00Z",
  "interviewLink": "https://meet.google.com/abc-defg-hij"
}
```

#### Check Application Status
```http
GET /api/v1/devrel/applications/status/{email}
```

### Response Format
All API responses follow a consistent format:

```json
{
  "status": true,
  "data": { ... },
  "message": "Operation successful",
  "error": null
}
```

## 🎨 Customization

### Styling
The system uses Tailwind CSS with a custom color scheme. Update colors in `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        }
      }
    }
  }
}
```

### Form Fields
Add or modify form fields in `SimpleApplicationForm.tsx`:

1. Update the Zod schema
2. Add form inputs
3. Update the API interface
4. Modify the backend validation

### Validation Rules
Customize validation in the Zod schema:

```typescript
const applicationSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters long')
    .max(100, 'Name cannot exceed 100 characters'),
  // ... other fields
});
```

## 🔒 Security Features

### Input Validation
- **Frontend**: Zod schema validation with real-time feedback
- **Backend**: Server-side validation and sanitization
- **Type Safety**: TypeScript interfaces prevent invalid data

### Authentication
- **JWT Tokens**: Secure token-based authentication
- **Role-based Access**: DevRel advocates only for admin functions
- **Session Management**: Secure session handling

### Data Protection
- **Email Validation**: Prevents duplicate applications
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Sanitization**: XSS and injection protection

## 📊 Monitoring & Analytics

### Application Metrics
Track key hiring metrics:
- Total applications received
- Applications by status
- Time to review applications
- Interview success rates
- Conversion rates by source

### Performance Monitoring
- Form completion rates
- Validation error patterns
- API response times
- User engagement metrics

## 🚨 Troubleshooting

### Common Issues

#### 1. Form Validation Errors
- Check that all required fields are filled
- Ensure email format is valid
- Verify tech stack selection (minimum 1, maximum 10)
- Check character limits for text areas

#### 2. API Connection Issues
- Verify `NEXT_PUBLIC_API_BASE_URL` is correct
- Check TBE-Webapp backend is running
- Ensure CORS is properly configured
- Verify authentication tokens are valid

#### 3. Email Duplicate Check
- Clear browser cache and cookies
- Check if email is already in the system
- Verify API endpoint is responding correctly

### Debug Mode
Enable debug logging by setting:

```env
NODE_ENV=development
DEBUG=true
```

## 🔄 Updates & Maintenance

### Regular Tasks
- **Daily**: Monitor application submissions
- **Weekly**: Review application pipeline
- **Monthly**: Update tech stack options
- **Quarterly**: Review and update form fields

### Version Updates
- Keep dependencies updated
- Monitor for security vulnerabilities
- Test new features in staging environment
- Maintain backward compatibility

## 📞 Support

### Technical Support
- **GitHub Issues**: Report bugs and feature requests
- **Documentation**: Check this README and inline code comments
- **Team Chat**: Reach out to the DevRel team

### Contact Information
- **Email**: devrel@theboringeducation.com
- **Telegram**: @theboringeducation
- **Website**: https://theboringeducation.com

## 📄 License

This project is part of The Boring Education's internal tooling and is not licensed for external use.

---

**Built with ❤️ by The Boring Education DevRel Team** 