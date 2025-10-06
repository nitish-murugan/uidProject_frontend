# Sport Team Roster Manager - Development Commands

## Quick Commands

### Start Everything (PowerShell)
```powershell
.\start-app.ps1
```
This will open two terminal windows:
- Backend server on http://localhost:5000
- Frontend server on http://localhost:5173

### Manual Start

**Backend (Terminal 1):**
```powershell
cd server
npm run dev
```

**Frontend (Terminal 2):**
```powershell
npm run dev
```

### Seed Database
```powershell
cd server
npm run seed
```

### Build for Production

**Backend:**
```powershell
cd server
npm start
```

**Frontend:**
```powershell
npm run build
npm run preview
```

## MongoDB Commands

### Start MongoDB (Windows)
```powershell
net start MongoDB
```

### Stop MongoDB (Windows)
```powershell
net stop MongoDB
```

### Check MongoDB Status
```powershell
mongo --eval "db.version()"
```

## Development Workflow

1. **First Time Setup:**
   ```powershell
   # Install backend dependencies
   cd server
   npm install
   
   # Install frontend dependencies
   cd ..
   npm install
   
   # Seed database
   cd server
   npm run seed
   ```

2. **Daily Development:**
   ```powershell
   # Start MongoDB (if not running)
   net start MongoDB
   
   # Run the app
   .\start-app.ps1
   ```

3. **Testing:**
   - Open http://localhost:5173
   - Login with test credentials:
     - Admin: admin@example.com / admin123
     - Coach: coach@example.com / coach123
     - Viewer: viewer@example.com / viewer123

## Useful Commands

### Clear Database
```powershell
cd server
npm run seed
```
This will clear and reseed the database with fresh sample data.

### Check Logs
- Backend logs appear in the terminal running `npm run dev`
- Frontend logs appear in browser console (F12)

### Restart Servers
- Press `Ctrl + C` in each terminal
- Run `npm run dev` again

## Troubleshooting

### Port Already in Use
**Backend (5000):**
Edit `server/.env` and change `PORT=5000` to another port

**Frontend (5173):**
Vite will automatically use the next available port

### MongoDB Not Found
Make sure MongoDB is installed and running:
```powershell
mongod --version
net start MongoDB
```

### Module Not Found
```powershell
# Backend
cd server
rm -rf node_modules
npm install

# Frontend
cd ..
rm -rf node_modules
npm install
```

### CORS Errors
Make sure backend is running on port 5000, or update `API_URL` in `src/services/api.js`

## Package Scripts

### Backend (server/package.json)
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data

### Frontend (package.json)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/roster-manager
JWT_SECRET=supersecret_change_this_in_production_12345
JWT_EXPIRE=7d
NODE_ENV=development
```

## Git Commands (Optional)

```powershell
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Sport Team Roster Manager"

# Add remote
git remote add origin <your-repo-url>

# Push
git push -u origin main
```

## Next Steps

1. ✅ Install dependencies
2. ✅ Seed database
3. ✅ Start servers
4. ✅ Open browser to http://localhost:5173
5. ✅ Login and explore!

---

**Happy Coding! 🚀**