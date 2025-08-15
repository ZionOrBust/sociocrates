# Sociocrates - Collaborative Decision Making Platform

A modern web application implementing the 7-step sociocratic decision-making process for intentional communities and organizations.

## Features

### 🏛️ Core Sociocratic Process
- **7-Step Decision Flow**: Automated guidance through the complete sociocratic process
- **Timed Steps**: Configurable time limits for each phase of decision-making
- **Role-Based Participation**: Admin, Participant, and Observer roles
- **Process Transparency**: Full audit trail of all decisions and inputs

### 🔐 User Management
- **Secure Authentication**: JWT-based login system
- **Role-Based Access**: Granular permissions for different user types
- **Circle Membership**: Users can belong to multiple decision-making circles

### 📋 Proposal Management
- **Proposal Creation**: Submit proposals to specific circles
- **Status Tracking**: Draft → Active → Pending Consent → Resolved workflow
- **Real-time Updates**: Live step progression and time remaining

### 👥 Circle System
- **Committee Management**: Create and manage decision-making circles
- **Member Assignment**: Add users to circles with specific roles
- **Independent Processes**: Each circle can run multiple proposals simultaneously

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Wouter (routing)
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT tokens with bcrypt password hashing
- **Deployment**: Production-ready for Vercel, Netlify, or traditional hosting

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (Neon.tech recommended)

### Installation

1. **Clone and install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```env
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your_secure_random_secret_key
   NODE_ENV=development
   ```

3. **Initialize database**
   ```bash
   npm run db:push
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Visit: http://localhost:5000
   - Demo accounts available on login page

## Production Deployment

### Environment Variables
```env
DATABASE_URL=postgresql://user:pass@host:port/dbname?sslmode=require
JWT_SECRET=secure-random-string-min-64-characters
NODE_ENV=production
PORT=5000
```

### Build and Deploy
```bash
# Build production version
npm run build

# Deploy to your hosting provider
npm start
```

## The 7-Step Sociocratic Process

1. **Proposal Presentation** - Proposer presents their idea
2. **Clarifying Questions** - Participants ask questions for understanding
3. **Quick Reactions** - Brief initial feedback from participants
4. **Objections Round** - Voice concerns and objections
5. **Resolve Objections** - Work together to address concerns
6. **Consent Round** - Final decision: Consent, Consent with Reservations, or Withhold Consent
7. **Record Outcome** - Document the decision and next steps

## User Roles

### Admin
- Create and manage circles
- Assign user roles and circle memberships
- Configure process timing settings
- Full system oversight

### Participant  
- Create proposals within their circles
- Participate in all steps of the decision-making process
- Submit questions, reactions, objections, and consent decisions

### Observer
- View proposals and discussions within assigned circles
- Cannot participate in the decision-making process
- Ideal for stakeholders who need visibility without voting rights

## Database Schema

The application uses a comprehensive PostgreSQL schema including:
- **Users**: Authentication and role management
- **Circles**: Decision-making groups
- **Proposals**: Items for collaborative decision
- **Process Steps**: Clarifying questions, reactions, objections, consent responses
- **Audit Trail**: Complete logging of all process activities

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Authenticate user
- `GET /api/auth/me` - Get current user info

### Circles
- `GET /api/circles` - List user's circles
- `POST /api/circles` - Create new circle (admin only)
- `GET /api/circles/:id` - Get circle details

### Proposals
- `GET /api/circles/:id/proposals` - List circle proposals
- `POST /api/proposals` - Create new proposal
- `GET /api/proposals/:id` - Get proposal details
- `PUT /api/proposals/:id` - Update proposal

### Process Steps
- `POST /api/proposals/:id/questions` - Submit clarifying question
- `POST /api/proposals/:id/reactions` - Submit quick reaction
- `POST /api/proposals/:id/objections` - Submit objection
- `POST /api/proposals/:id/consent` - Submit consent decision

## Contributing

This project implements collaborative governance principles. For contributions:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request with clear description

## License

MIT License - see LICENSE file for details

## Support

For technical support or questions about sociocratic processes:
- Create an issue in the repository
- Visit the documentation at the deployed application
- Contact the development team

---

Built with ❤️ for collaborative decision-making and democratic governance.
