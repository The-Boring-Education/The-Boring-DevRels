# DevRel Platform - The Boring Education

A comprehensive UI platform for DevRel hiring and management that connects to TBE-Webapp APIs.

## 🏗️ Architecture

**This is the Frontend UI Repository**
- **DevRel Platform (this repo)**: Frontend UI only - Landing page, application form, dashboards
- **TBE-Webapp**: Backend APIs, database models, authentication logic

## 🚀 Features

### Landing Page
- **Simplified Design**: Clean, focused landing page driving to application
- **Clear Call-to-Action**: Prominent apply buttons and streamlined messaging
- **Mobile Responsive**: Optimized for all device types

### Application Process
- **Simple Form**: Only essential questions, quick 5-minute application
- **Real-time Validation**: Instant feedback and error handling
- **Beautiful UX**: Smooth animations and intuitive design

### Dashboard Access
- **Role-based Access**: Different views for Advocates vs Leads
- **Task Management**: Clean interface for viewing and completing tasks
- **Performance Tracking**: Visual progress indicators and metrics

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **UI Components**: Headless UI, Heroicons, Framer Motion
- **Forms**: React Hook Form with Zod validation
- **API Integration**: Axios for TBE-Webapp API calls
- **Authentication**: NextAuth.js (configured with TBE-Webapp)

## 📋 Prerequisites

- Node.js 22.x or higher
- Running TBE-Webapp instance (for API backend)
- Environment variables configured

## ⚡ Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd The-Boring-DevRels
npm install --legacy-peer-deps
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
# ^ This should point to your TBE-Webapp instance

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-nextauth-secret-here

# Environment
NODE_ENV=development
```

### 3. TBE-Webapp Setup

**Important**: This frontend requires TBE-Webapp to be running with DevRel APIs.

Ensure TBE-Webapp has:
- DevRel database models installed
- DevRel API endpoints available at `devrel/*`
- User roles updated to include `DEVREL_ADVOCATE` and `DEVREL_LEAD`

### 4. Add DevRel Advocates

In your TBE-Webapp database, add Campus Connect team members:

```javascript
// Add to User collection in TBE-Webapp
{
  name: "John Doe",
  email: "john@example.com",
  occupation: "DEVREL_ADVOCATE"  // This gives admin access
}
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) to see the DevRel platform.

**Note**: The app runs on port 3001 to avoid conflicts with TBE-Webapp on port 3000.

## 🏗️ Project Structure

```
src/
├── components/          # Reusable React components
│   ├── forms/          # Application forms
│   ├── dashboards/     # Dashboard components
│   └── ui/             # UI components
├── config/             # Configuration files
│   └── api.ts          # API endpoints and settings
├── pages/              # Next.js pages
│   ├── api/            # NextAuth configuration only
│   ├── index.tsx       # Landing page
│   ├── apply.tsx       # Application page
│   └── dashboard.tsx   # Dashboard page
├── utils/              # Utility functions
└── styles/             # Global styles
```

## 🔗 API Integration

This frontend connects to TBE-Webapp APIs:

- **Application Submission**: `POST devrel/apply`
- **Dashboard Data**: `GET devrel/dashboard` 
- **Task Management**: `GET/PUT devrel/tasks`
- **Application Management**: `GET/PUT devrel/applications`

## 🔐 Authentication & Authorization

Authentication is handled by TBE-Webapp with role-based access:

- **DevRel Advocates**: `occupation: "DEVREL_ADVOCATE"` in User model
- **DevRel Leads**: Approved applicants in DevRelLead model

### Access Control

The frontend checks user roles via API calls to determine dashboard access.

## 📊 API Integration

All backend APIs are hosted in TBE-Webapp:

### DevRel APIs in TBE-Webapp
- `POST devrel/apply` - Submit application
- `GET devrel/applications` - Get all applications (Advocates)
- `PUT devrel/applications` - Update application status (Advocates)
- `GET devrel/dashboard` - Get role-based dashboard data
- `GET devrel/tasks` - Get tasks based on user role
- `POST devrel/tasks` - Create new task (Advocates)
- `PUT devrel/tasks` - Update task progress

### Frontend Routes
- `/` - Landing page with clear CTA to apply
- `/apply` - Simple application form
- `/dashboard` - Role-based dashboard (Advocates vs Leads)

## 🚀 Deployment

### Production Build

```bash
npm run build
npm start
```

### Environment Variables for Production

Update your environment variables for production:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-tbe-webapp-domain.com
NEXTAUTH_URL=https://your-devrel-domain.com
# ... other production variables
```

### Deployment Checklist

1. ✅ Deploy TBE-Webapp with DevRel APIs first
2. ✅ Update API_BASE_URL to point to TBE-Webapp
3. ✅ Configure authentication with same Google OAuth
4. ✅ Add DevRel Advocates to TBE-Webapp database
5. ✅ Test application flow end-to-end

## 📈 Features Status

### ✅ Completed
- [x] **Simple Application Form** - Streamlined 5-minute application
- [x] **Landing Page** - Clean, conversion-focused design
- [x] **API Integration** - Connected to TBE-Webapp backend
- [x] **Role-based Dashboards** - Advocate and Lead views
- [x] **Authentication Flow** - NextAuth integration
- [x] **Task Management UI** - Dashboard for viewing/completing tasks
- [x] **Responsive Design** - Mobile-optimized interface

### 🚧 Future Enhancements  
- [ ] 📧 Email notification integration
- [ ] 📹 Video upload and quiz system UI
- [ ] 📅 Interview scheduling interface
- [ ] 📄 PDF offer letter generation
- [ ] 📊 Advanced analytics dashboards
- [ ] 🔔 Real-time notifications
- [ ] 🎨 Enhanced UI animations
- [ ] 📱 Progressive Web App features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Development Guidelines

### Code Style
- Use TypeScript for all new files
- Follow existing naming conventions
- Add proper type definitions
- Use Tailwind CSS for styling

### Frontend Best Practices
- Keep components small and focused
- Use proper error boundaries
- Implement loading states
- Follow accessibility guidelines

### API Integration
- Use the configured axios instance
- Handle errors gracefully
- Implement proper loading states
- Cache API responses when appropriate

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Failed**: Ensure TBE-Webapp is running and `NEXT_PUBLIC_API_BASE_URL` is correct
2. **Authentication Issues**: Verify Google OAuth settings match TBE-Webapp configuration  
3. **Port Conflicts**: App runs on port 3001 to avoid conflicts with TBE-Webapp
4. **Role Access Denied**: Check user has correct `occupation` field in TBE-Webapp database

### Debug Mode

1. Set `NODE_ENV=development` in `.env.local`
2. Check browser console for API errors
3. Verify TBE-Webapp APIs are responding at `devrel/*`
4. Test authentication flow with TBE-Webapp

## 📞 Support

For questions or support:
- Create an issue in the repository
- Contact the development team
- Check the documentation for common solutions

## 📄 License

This project is proprietary software of The Boring Education.

## 🎯 Summary

This DevRel Platform provides a clean, focused UI for:
- **Landing Page**: Drives visitors to apply with clear messaging
- **Simple Application**: Quick 5-minute form with only essential questions  
- **Role-based Dashboards**: Different views for Advocates vs Leads
- **Task Management**: Clean interface for DevRel workflow

**Architecture**: UI-only frontend + TBE-Webapp backend APIs = Scalable & maintainable

---

Built with ❤️ by The Boring Education team for the developer community.