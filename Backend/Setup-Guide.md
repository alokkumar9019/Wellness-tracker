# Project Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation Steps

### 1. Initialize Backend Project

```bash
# Create backend directory
mkdir wellness-tracker-backend
cd wellness-tracker-backend

# Initialize npm project
npm init -y

# Install dependencies
npm install express mongoose cors dotenv bcryptjs jsonwebtoken express-validator

# Install dev dependencies
npm install --save-dev nodemon
```

### 2. Project Structure

Create the following folder structure:

```
wellness-tracker-backend/
├── server.js
├── .env
├── .gitignore
├── package.json
├── models/
│   ├── User.js
│   ├── Habit.js
│   ├── HabitCompletion.js
│   ├── MoodEntry.js
│   ├── Friend.js
│   ├── Activity.js
│   └── AISuggestion.js
├── routes/
│   ├── auth.js
│   ├── habits.js
│   ├── streaks.js
│   ├── progress.js
│   ├── social.js
│   └── ai.js
├── middleware/
│   └── auth.js
└── utils/
    └── helpers.js
```

### 3. Environment Variables

Create `.env` file in root directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/wellness-tracker
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

### 4. .gitignore

Create `.gitignore` file:

```
node_modules/
.env
.DS_Store
*.log
dist/
build/
coverage/
```

### 5. Package.json Scripts

Update `package.json` with these scripts:

```json
{
  "name": "wellness-tracker-backend",
  "version": "1.0.0",
  "description": "Backend API for Wellness Tracker",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": ["wellness", "habit-tracker", "health"],
  "author": "Your Name",
  "license": "MIT"
}
```

### 6. Start MongoDB

**Option A: Local MongoDB**
```bash
# Start MongoDB service
# On macOS with Homebrew:
brew services start mongodb-community

# On Ubuntu/Linux:
sudo systemctl start mongod

# On Windows:
net start MongoDB
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at https://www.mongodb.com/atlas
2. Create a free cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wellness-tracker?retryWrites=true&w=majority
```

### 7. Run the Server

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

Server will start at `http://localhost:5000`

### 8. Test the API

**Health Check:**
```bash
curl http://localhost:5000/api/health
```

**Create User:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Frontend Integration

### Update Frontend API Calls

Create an API service file in your frontend:

**`services/api.js`**
```javascript
const API_BASE_URL = 'http://localhost:5000/api';

// Store token in localStorage
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

// Get token from localStorage
export const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Create axios-like fetch wrapper
const api = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// Auth API
export const authAPI = {
  signup: (userData) => api('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  login: (credentials) => api('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  
  getProfile: () => api('/auth/me'),
  
  updateProfile: (profileData) => api('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  }),
};

// Habits API
export const habitsAPI = {
  getAll: () => api('/habits'),
  
  getById: (id) => api(`/habits/${id}`),
  
  create: (habitData) => api('/habits', {
    method: 'POST',
    body: JSON.stringify(habitData),
  }),
  
  update: (id, habitData) => api(`/habits/${id}`, {
    method: 'PUT',
    body: JSON.stringify(habitData),
  }),
  
  delete: (id) => api(`/habits/${id}`, {
    method: 'DELETE',
  }),
  
  toggleComplete: (id, notes) => api(`/habits/${id}/complete`, {
    method: 'POST',
    body: JSON.stringify({ notes }),
  }),
  
  getTodayStatus: () => api('/habits/today/status'),
};

// Streaks API
export const streaksAPI = {
  getCalendar: (year, month) => api(`/streaks/calendar/${year}/${month}`),
  getStats: () => api('/streaks/stats'),
  getLeaderboard: () => api('/streaks/leaderboard'),
};

// Progress API
export const progressAPI = {
  getWeekly: () => api('/progress/weekly'),
  getHabitsCompletion: () => api('/progress/habits-completion'),
  getMoodTrend: () => api('/progress/mood-trend'),
  logMood: (moodData) => api('/progress/mood', {
    method: 'POST',
    body: JSON.stringify(moodData),
  }),
  getInsights: () => api('/progress/insights'),
};

// Social API
export const socialAPI = {
  getFriends: () => api('/social/friends'),
  sendRequest: (email) => api('/social/friends/request', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),
  acceptRequest: (id) => api(`/social/friends/${id}/accept`, {
    method: 'PUT',
  }),
  removeFriend: (id) => api(`/social/friends/${id}`, {
    method: 'DELETE',
  }),
  getActivity: () => api('/social/activity'),
  getPending: () => api('/social/pending'),
  shareProgress: (shareData) => api('/social/share', {
    method: 'POST',
    body: JSON.stringify(shareData),
  }),
};

// AI API
export const aiAPI = {
  getSuggestions: () => api('/ai/suggestions'),
  acceptSuggestion: (id) => api(`/ai/suggestions/${id}/accept`, {
    method: 'POST',
  }),
  dismissSuggestion: (id) => api(`/ai/suggestions/${id}`, {
    method: 'DELETE',
  }),
  regenerate: () => api('/ai/regenerate', {
    method: 'POST',
  }),
};
```

### Update Login Component

**Example: `login-page.tsx`**
```typescript
import { useState } from 'react';
import { authAPI, setAuthToken } from '@/services/api';

export function LoginPage({ onLogin, onSwitchToSignup }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login({ email, password });
      setAuthToken(response.token);
      onLogin(response.user);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // ... rest of component
}
```

### Update Habit Check-in Component

**Example: `habit-check-in.tsx`**
```typescript
import { useState, useEffect } from 'react';
import { habitsAPI } from '@/services/api';

export function HabitCheckIn() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const response = await habitsAPI.getTodayStatus();
      setHabits(response.habits);
    } catch (error) {
      console.error('Error fetching habits:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleHabit = async (id: string) => {
    try {
      await habitsAPI.toggleComplete(id, '');
      fetchHabits(); // Refresh
    } catch (error) {
      console.error('Error toggling habit:', error);
    }
  };

  // ... rest of component
}
```

## Testing

### Using Postman or Thunder Client

1. Import the API endpoints
2. Set environment variable: `baseUrl = http://localhost:5000/api`
3. Test authentication first
4. Copy JWT token for authenticated requests

### Using cURL

```bash
# Login
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  | jq -r '.token')

# Get habits
curl http://localhost:5000/api/habits \
  -H "Authorization: Bearer $TOKEN"

# Create habit
curl -X POST http://localhost:5000/api/habits \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Morning Meditation",
    "description": "10 minutes of mindfulness",
    "icon": "🧘",
    "target": "10 min",
    "category": "mindfulness"
  }'
```

## Deployment

### Deploy to Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create wellness-tracker-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_production_secret
heroku config:set MONGODB_URI=your_mongodb_atlas_uri

# Deploy
git push heroku main

# Open app
heroku open
```

### Deploy to Railway/Render

1. Connect GitHub repository
2. Set environment variables in dashboard
3. Deploy automatically on push

## Troubleshooting

**MongoDB Connection Error:**
- Check MongoDB is running: `mongosh`
- Verify MONGODB_URI in .env
- Check firewall/network settings

**JWT Token Issues:**
- Verify JWT_SECRET is set
- Check token expiration
- Ensure token is sent in Authorization header

**CORS Errors:**
- Add frontend URL to CORS config in server.js
- Check browser console for specific errors

## Next Steps

1. Add input validation with express-validator
2. Implement rate limiting
3. Add email verification
4. Set up logging (Winston/Morgan)
5. Add unit tests (Jest)
6. Implement caching (Redis)
7. Add API documentation (Swagger)
