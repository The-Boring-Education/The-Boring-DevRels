# The Boring DevRels - DevRel Application Platform

A comprehensive platform for managing Developer Relations (DevRel) applications and team members, built with Next.js and integrated with The Boring Education (TBE) APIs.

## 🚀 Features

### Core Functionality
- **Application Management**: Complete DevRel application submission and tracking system
- **Status Tracking**: Real-time application status updates with progress indicators
- **TBE Integration**: Seamless integration with TBE Webapp APIs for data persistence
- **User Experience**: Modern, responsive UI with smooth animations and micro-interactions
- **Local Storage**: Offline-capable application data storage and retrieval

### Application Features
- **Comprehensive Forms**: Detailed application forms with validation
- **Progress Tracking**: Visual progress indicators for application stages
- **Status Updates**: Real-time status checking and updates
- **Interview Management**: Interview scheduling and meeting link management
- **Performance Metrics**: Track DevRel team member performance and onboarding progress

## 🏗️ Architecture

### Frontend (DevRels)
- **Next.js**: React-based framework for the frontend
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations and transitions
- **React Hook Form**: Form management with validation

### Backend (TBE Webapp)
- **Node.js/Next.js API Routes**: RESTful API endpoints
- **MongoDB**: Database for storing application data
- **Mongoose**: MongoDB object modeling
- **NextAuth.js**: Authentication and session management

### Data Flow
```
DevRels Frontend → TBE Webapp APIs → MongoDB Database
     ↓                    ↓              ↓
Local Storage ← Status Updates ← Data Persistence
```

## 🔌 API Integration

### TBE Webapp Endpoints

#### DevRel Application Endpoints
- `POST /api/v1/devrel/apply` - Submit new DevRel application
- `GET /api/v1/devrel/applications` - Get all applications (DevRel Advocates only)
- `PUT /api/v1/devrel/applications` - Update application status
- `GET /api/v1/devrel/applications/status/[email]` - Check application status by email
- `GET /api/v1/devrel/dashboard` - Get DevRel dashboard data
- `GET /api/v1/devrel/tasks` - Manage DevRel tasks

#### Data Models
- **DevRelLead**: Main application and team member model
- **DevRelTask**: Task management and tracking
- **User**: Authentication and role management

### Application Status Flow
```
applied → reviewing → interview_scheduled → approved → offer_sent → offer_accepted → onboarded
   ↓         ↓              ↓              ↓          ↓              ↓              ↓
  25%       50%            75%            90%        95%            98%            100%
```

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Access to TBE Webapp APIs

### Environment Variables
Create a `.env.local` file:
```bash
# TBE Webapp API Configuration
NEXT_PUBLIC_API_BASE_URL=https://your-tbe-webapp-domain.com

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
```

### Installation
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Development Commands
```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build
npm run build

# Start production
npm start
```

## 📱 Components

### Core Components
- **SimpleApplicationForm**: Main application submission form
- **ApplicationStatusTracker**: Real-time status tracking and progress display
- **MainLayout**: Application layout wrapper
- **Sidebar**: Navigation sidebar

### Form Features
- **Validation**: Comprehensive form validation using Zod
- **Real-time Updates**: Live form validation and error handling
- **Progress Indicators**: Visual feedback during submission
- **Email Checking**: Duplicate application prevention

### Status Tracking
- **Progress Bars**: Visual progress indicators
- **Status Icons**: Contextual status representations
- **Next Steps**: Dynamic next step guidance
- **Real-time Updates**: Live status checking

## 🔄 Services

### DevRel Service
- **Application Management**: Submit, check, and track applications
- **Local Storage**: Offline data persistence
- **Status Updates**: Real-time status checking
- **Progress Calculation**: Dynamic progress tracking

### Hiring Service
- **Legacy Support**: Maintains compatibility with existing hiring system
- **API Integration**: Connects to TBE hiring APIs
- **Data Validation**: Ensures data integrity

## 📊 Data Management

### Local Storage
- **Application Data**: Stores current application information
- **Status Cache**: Caches application status for offline access
- **User Preferences**: Stores user-specific settings

### API Integration
- **Real-time Sync**: Synchronizes with TBE backend
- **Error Handling**: Graceful fallback for API failures
- **Data Validation**: Ensures data consistency

## 🚀 Deployment

### Production Build
```bash
# Build the application
npm run build

# Start production server
npm start
```

### Environment Configuration
- Set `NEXT_PUBLIC_API_BASE_URL` to production TBE Webapp URL
- Configure `NEXTAUTH_SECRET` for production
- Set `NEXTAUTH_URL` to production domain

### Deployment Platforms
- **Vercel**: Recommended for Next.js applications
- **Netlify**: Alternative deployment option
- **Self-hosted**: Docker or traditional hosting

## 🔒 Security

### Authentication
- **NextAuth.js**: Secure authentication system
- **Session Management**: Secure session handling
- **Role-based Access**: Different access levels for different user types

### Data Protection
- **Input Validation**: Comprehensive input sanitization
- **API Security**: Secure API endpoint access
- **Local Storage**: Secure local data storage

## 📈 Monitoring & Analytics

### Error Tracking
- **Console Logging**: Development error tracking
- **API Monitoring**: API endpoint health monitoring
- **User Analytics**: Application usage tracking

### Performance
- **Loading States**: User feedback during operations
- **Progress Indicators**: Visual progress representation
- **Optimistic Updates**: Immediate UI feedback

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Standards
- **TypeScript**: Use strict typing
- **ESLint**: Follow linting rules
- **Prettier**: Consistent code formatting
- **Testing**: Write tests for new features

## 📝 API Documentation

### Application Submission
```typescript
POST /api/v1/devrel/apply
{
  "name": "John Doe",
  "email": "john@example.com",
  "techStack": ["JavaScript", "React"],
  "experienceLevel": "intermediate",
  "availability": "10-15",
  "motivation": "Passionate about community building...",
  "whyTBE": "TBE's mission aligns with my values...",
  "commitments": {
    "weeklyLearning": true,
    "communityParticipation": true,
    "eventAttendance": false,
    "contentCreation": true,
    "socialMediaEngagement": false
  }
}
```

### Status Check
```typescript
GET /api/v1/devrel/applications/status/john@example.com
```

## 🔮 Future Enhancements

### Planned Features
- **Dashboard**: Comprehensive DevRel dashboard
- **Task Management**: Task assignment and tracking
- **Performance Metrics**: Advanced analytics and reporting
- **Team Collaboration**: Team member communication tools
- **Mobile App**: Native mobile application

### Integration Opportunities
- **Slack Integration**: Team communication
- **Email Automation**: Automated status updates
- **Calendar Integration**: Interview scheduling
- **Analytics Platform**: Advanced reporting

## 📞 Support

### Getting Help
- **Documentation**: Check this README first
- **Issues**: Report bugs via GitHub issues
- **Discussions**: Join community discussions
- **Email**: Contact the development team

### Troubleshooting
- **API Issues**: Check TBE Webapp API status
- **Environment Variables**: Verify configuration
- **Build Errors**: Check Node.js version and dependencies
- **Runtime Errors**: Check browser console and network tab

## 📄 License

This project is part of The Boring Education ecosystem and follows the same licensing terms.

---

**Built with ❤️ by The Boring Education Team**