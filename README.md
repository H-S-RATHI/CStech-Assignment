# Admin Panel for Lead Management System

A full-stack application for managing agents and lead distribution built with Next.js and Express.js.

## Features

- **Agent Management**
  - View and manage agents
  - Track assigned leads
  - CRUD operations for agents

- **Lead Management**
  - Upload lead lists via CSV
  - Automatic lead distribution among agents
  - View detailed lead distribution
  - Track lead status and notes

- **Dashboard**
  - Overview of agents and lists
  - Quick access to main features
  - Real-time statistics

## Tech Stack

### Frontend
- Next.js 15.2.4
- React
- TypeScript
- Tailwind CSS
- Radix UI Components
- Next-Auth for authentication
- Axios for API calls

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- CSV parser for lead list processing

## Project Structure

```
CStech-Assignment/
├── frontend/           # Next.js frontend application
│   ├── app/           # Next.js app directory
│   ├── components/    # React components
│   └── lib/           # Configuration files
├── backend/           # Express.js backend server
│   ├── controllers/   # Route controllers
│   ├── models/        # MongoDB models
│   ├── routes/        # API routes
│   └── middleware/    # Custom middleware
└── .git/              # Git repository
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/H-S-RATHI/CStech-Assignmentl
```

2. Install dependencies:
```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

3. Create environment files:
```bash
# Frontend
cp .env.example .env

# Backend
cp .env.example .env
```

4. Start the development servers:
```bash
# Frontend (in one terminal)
cd frontend
npm run dev

# Backend (in another terminal)
cd backend
npm run dev
```

## API Endpoints

### Agents
- `GET /api/agents` - Get all agents
- `POST /api/agents` - Create new agent
- `DELETE /api/agents/:id` - Delete agent

### Lists
- `POST /api/lists/upload` - Upload new lead list
- `GET /api/lists` - Get all lists
- `GET /api/lists/:id/distribution` - Get list distribution
- `DELETE /api/lists/:id` - Delete list

## Environment Variables

### Frontend
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_AUTH_SECRET=your-secret-key
```

### Backend
```env
PORT=3000
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
```

## Security

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Rate limiting
- Input validation

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License
