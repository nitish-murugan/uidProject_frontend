# Sport Team Roster Manager - Full Stack Web Application

A comprehensive team roster management system built with the MERN stack (MongoDB, Express.js, React.js, Node.js) that allows coaches and team administrators to manage players, track team information, and organize rosters efficiently.

## 🚀 Features

### Core Features
- **User Authentication & Authorization** - JWT-based authentication with role-based access control (Admin, Coach, Player, Viewer)
- **Team Management** - Create and manage multiple teams with statistics tracking
- **Player Management** - Comprehensive player profiles with statistics and status tracking
- **Roster Management** - Create and manage different roster types (active, injured, suspended, reserve, starting)
- **Schedule & Games** - Game schedule management with results tracking
- **Dashboard & Reports** - Overview dashboard with team and player statistics

### User Roles
- **Admin** - Full access to all features
- **Coach** - Manage teams, players, rosters, and games
- **Player** - View-only access
- **Viewer** - View-only access

## 🛠️ Technology Stack

### Frontend
- React.js with Hooks
- React Router for navigation
- Tailwind CSS for styling
- Axios for API calls
- React Icons
- Date-fns for date formatting
- Recharts for data visualization

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- Bcrypt.js for password hashing
- Multer for file uploads
- Express Validator for input validation

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (v4.4 or higher)

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd miniProjNew
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Edit .env file with your configuration
# - Set MONGODB_URI to your MongoDB connection string
# - Set JWT_SECRET to a secure random string
# - Configure other environment variables as needed
```

### 3. Frontend Setup

```bash
# Navigate to root directory (from server directory)
cd ..

# Install dependencies
npm install
```

### 4. Database Setup

Make sure MongoDB is running on your system. You can seed the database with sample data:

```bash
# From the server directory
cd server
npm run seed
```

This will create sample data including:
- Test users (Admin, Coach, Viewer)
- Sample teams
- Sample players
- Sample games

### Test Credentials
After seeding, you can login with:
- **Admin:** admin@example.com / admin123
- **Coach:** coach@example.com / coach123
- **Viewer:** viewer@example.com / viewer123

## 🚀 Running the Application

### Start the Backend Server

```bash
# From the server directory
cd server
npm run dev
```

The backend server will run on `http://localhost:5000`

### Start the Frontend Development Server

```bash
# From the root directory
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

## 📁 Project Structure

```
miniProjNew/
├── server/                  # Backend application
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utility functions
│   │   └── server.js       # Express app entry point
│   ├── uploads/            # Uploaded files
│   ├── .env                # Environment variables
│   └── package.json
│
└── src/                    # Frontend application
    ├── components/         # Reusable components
    ├── context/           # React context providers
    ├── pages/             # Page components
    ├── services/          # API service layer
    ├── utils/             # Utility functions
    ├── App.jsx            # Main app component
    └── main.jsx           # React entry point
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `GET /api/auth/users` - Get all users (Admin only)

### Teams
- `GET /api/teams` - Get all teams
- `GET /api/teams/:id` - Get single team
- `POST /api/teams` - Create team (Admin/Coach)
- `PUT /api/teams/:id` - Update team (Admin/Coach)
- `DELETE /api/teams/:id` - Delete team (Admin/Coach)
- `GET /api/teams/:id/statistics` - Get team statistics

### Players
- `GET /api/players` - Get all players
- `GET /api/players/:id` - Get single player
- `POST /api/players` - Create player (Admin/Coach)
- `PUT /api/players/:id` - Update player (Admin/Coach)
- `DELETE /api/players/:id` - Delete player (Admin/Coach)
- `PUT /api/players/:id/statistics` - Update player statistics (Admin/Coach)

### Rosters
- `GET /api/rosters` - Get all rosters
- `GET /api/rosters/:id` - Get single roster
- `POST /api/rosters` - Create roster (Admin/Coach)
- `PUT /api/rosters/:id` - Update roster (Admin/Coach)
- `DELETE /api/rosters/:id` - Delete roster (Admin/Coach)
- `POST /api/rosters/:id/players` - Add player to roster (Admin/Coach)
- `DELETE /api/rosters/:id/players/:playerId` - Remove player from roster (Admin/Coach)

### Games
- `GET /api/games` - Get all games
- `GET /api/games/:id` - Get single game
- `POST /api/games` - Create game (Admin/Coach)
- `PUT /api/games/:id` - Update game (Admin/Coach)
- `DELETE /api/games/:id` - Delete game (Admin/Coach)
- `PUT /api/games/:id/participation` - Update player participation (Admin/Coach)

## 🎨 UI Features

- **Responsive Design** - Mobile-first approach, works on all devices
- **Modern UI** - Clean interface with Tailwind CSS
- **Data Tables** - Sortable and filterable tables
- **Modal Dialogs** - For forms and data entry
- **Real-time Updates** - Immediate feedback on actions
- **Loading States** - Smooth loading indicators
- **Error Handling** - User-friendly error messages

## 🔐 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Role-based access control
- Protected API routes
- Input validation
- CORS configuration

## 📦 Database Schema

### Collections
- **Users** - User accounts and authentication
- **Teams** - Team information and statistics
- **Players** - Player profiles and statistics
- **Rosters** - Roster configurations
- **Games** - Game schedules and results

## 🧪 Testing

The application can be tested using the seeded data:

1. Start the backend and frontend servers
2. Navigate to `http://localhost:5173`
3. Login with test credentials
4. Explore the dashboard and features

## 🚀 Deployment

### Backend Deployment (Example: Heroku)

```bash
# From server directory
heroku create your-app-name
git push heroku main
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
```

### Frontend Deployment (Example: Vercel)

```bash
# From root directory
npm run build
vercel --prod
```

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/roster-manager
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- Your Name

## 🙏 Acknowledgments

- React.js team for the amazing framework
- Express.js team for the backend framework
- MongoDB team for the database
- Tailwind CSS for the styling framework

## 📞 Support

For support, email your-email@example.com or open an issue in the repository.

---

Made with ❤️ using the MERN Stack

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
