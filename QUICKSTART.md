# 🚀 Quick Start Guide - Sport Team Roster Manager

## Step-by-Step Setup Instructions

### 1. Prerequisites Check
Ensure you have installed:
- ✅ Node.js (v14+) - Download from https://nodejs.org/
- ✅ MongoDB (v4.4+) - Download from https://www.mongodb.com/try/download/community
- ✅ Git (optional) - Download from https://git-scm.com/

### 2. Start MongoDB
```powershell
# Windows - Start MongoDB service
net start MongoDB

# Or if installed manually, navigate to MongoDB bin folder and run:
mongod
```

### 3. Backend Setup (Terminal 1)
```powershell
# Navigate to server directory
cd server

# Install dependencies
npm install

# Seed the database with sample data
npm run seed

# Start the backend server
npm run dev
```

✅ Backend should now be running on `http://localhost:5000`

### 4. Frontend Setup (Terminal 2 - New Terminal)
```powershell
# Navigate back to root directory
cd ..

# Install dependencies
npm install

# Start the frontend development server
npm run dev
```

✅ Frontend should now be running on `http://localhost:5173`

### 5. Access the Application

Open your browser and go to: `http://localhost:5173`

### 6. Login with Test Credentials

**Admin Account:**
- Email: admin@example.com
- Password: admin123

**Coach Account:**
- Email: coach@example.com
- Password: coach123

**Viewer Account:**
- Email: viewer@example.com
- Password: viewer123

## 📱 Using the Application

### Dashboard
- View overview of teams, players, and games
- Quick access to all features
- Recent games display

### Teams Management
1. Click "Teams" in the navigation
2. Click "Add Team" to create a new team
3. Fill in team details (name, sport type, season, etc.)
4. View team statistics and manage team info

### Players Management
1. Click "Players" in the navigation
2. Click "Add Player" to add a new player
3. Fill in player details (name, position, jersey number, etc.)
4. Filter by team or status
5. View and update player statistics

### Rosters Management
1. Click "Rosters" in the navigation
2. Click "Create Roster" to create a new roster
3. Select team, type (active, starting, etc.)
4. Add players to the roster

### Games Schedule
1. Click "Games" in the navigation
2. Click "Schedule Game" to add a new game
3. Fill in game details (opponent, date, time, location)
4. Update game results after completion

## 🔧 Troubleshooting

### MongoDB Connection Issues
```powershell
# Check if MongoDB is running
mongo --eval "db.version()"

# If not running, start MongoDB service
net start MongoDB
```

### Port Already in Use
If port 5000 or 5173 is already in use:

**Backend:**
Edit `server/.env` and change PORT=5000 to another port

**Frontend:**
The dev server will automatically use another port

### Cannot find module errors
```powershell
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### CORS errors
Make sure backend is running on port 5000 or update the API_URL in `src/services/api.js`

## 📊 Sample Data Included

After seeding, you'll have:
- 3 test users (Admin, Coach, Viewer)
- 2 sample teams (Thunder FC, Eagles Basketball)
- 4 sample players
- Sample rosters and games

## 🎯 Key Features to Try

1. **Create a new team** (Admin/Coach)
2. **Add players to your team** (Admin/Coach)
3. **Create rosters** (Admin/Coach)
4. **Schedule games** (Admin/Coach)
5. **View statistics** on dashboard
6. **Filter and search** in tables

## 📝 Notes

- Admin and Coach roles can create/edit/delete
- Player and Viewer roles can only view data
- All data is stored in MongoDB
- Changes are reflected immediately across the app

## 🆘 Need Help?

- Check the main README.md for detailed documentation
- Review API endpoints in README.md
- Check console for error messages
- Ensure all services are running

## 🎉 You're All Set!

Start exploring the application and managing your sports teams!

---

**Pro Tip:** Use the Admin account to explore all features first!