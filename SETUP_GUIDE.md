# 🚀 Complete Setup Guide - Tours and Travel Management System

## Prerequisites Installation

### 1. Install Node.js
1. Download Node.js from: https://nodejs.org/
2. Choose LTS version (recommended)
3. Run the installer
4. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### 2. Install MongoDB
Choose one option:

#### Option A: MongoDB Local Installation
1. Download from: https://www.mongodb.com/try/download/community
2. Install MongoDB Community Server
3. Start MongoDB service
4. Verify: Open MongoDB Compass or run `mongod --version`

#### Option B: MongoDB Atlas (Cloud - Recommended for beginners)
1. Go to: https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a free cluster
4. Get connection string
5. Update `.env` file with your connection string

## Project Setup Steps

### Step 1: Install Dependencies

#### Backend Dependencies
```bash
cd server
npm install
```

This installs:
- express
- mongoose
- bcryptjs
- jsonwebtoken
- cors
- dotenv
- multer
- morgan
- express-validator

#### Frontend Dependencies
```bash
cd client
npm install
```

This installs:
- react
- react-dom
- react-router-dom
- axios
- tailwindcss
- recharts
- lucide-react
- react-hot-toast
- framer-motion

### Step 2: Configure Environment Variables

Create `.env` file in root directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/toursdb
JWT_SECRET=tours_travel_jwt_secret_key_2024_bca_project
NODE_ENV=development
```

**For MongoDB Atlas**, replace MONGO_URI with:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/toursdb?retryWrites=true&w=majority
```

### Step 3: Seed Database with Sample Data

```bash
cd server
npm run seed
```

This creates:
- ✅ Admin user (admin@toursandtravels.com / admin123)
- ✅ Demo user (rahul@example.com / user123)
- ✅ 10 sample tour packages

### Step 4: Start the Application

#### Terminal 1 - Start Backend
```bash
cd server
npm run dev
```
✅ Server running on: http://localhost:5000

#### Terminal 2 - Start Frontend
```bash
cd client
npm run dev
```
✅ Frontend running on: http://localhost:5173

### Step 5: Access the Application

Open your browser and visit:
- **Website**: http://localhost:5173
- **Admin Panel**: http://localhost:5173/admin

## 🎯 Quick Test Guide

### Test User Features
1. Go to http://localhost:5173
2. Click "Sign Up" and create account OR use demo credentials
3. Browse packages
4. Click on any package to view details
5. Click "Book Now"
6. Fill booking form
7. Complete demo payment
8. View booking confirmation

### Test Admin Features
1. Go to http://localhost:5173/login
2. Login with admin credentials:
   - Email: admin@toursandtravels.com
   - Password: admin123
3. Access admin dashboard
4. View statistics and charts
5. Manage packages, bookings, users

## 📁 Project Structure Overview

```
tours-and-travels/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/       # Navbar, Footer, PackageCard, etc.
│   │   ├── context/          # AuthContext
│   │   ├── pages/            # All page components
│   │   │   ├── admin/       # Admin dashboard pages
│   │   │   ├── Home.jsx
│   │   │   ├── Packages.jsx
│   │   │   ├── Login.jsx
│   │   │   └── ...
│   │   ├── utils/            # API configuration
│   │   └── App.jsx
│   └── package.json
│
├── server/                    # Node.js Backend
│   ├── config/               # Database config
│   ├── controllers/          # Business logic
│   ├── middleware/           # Auth middleware
│   ├── models/               # MongoDB schemas
│   ├── routes/               # API routes
│   ├── seed/                 # Sample data
│   └── server.js
│
├── .env                       # Environment variables
└── README.md
```

## 🔧 Troubleshooting

### Issue: MongoDB Connection Error
**Solution**:
- Check if MongoDB is running
- Verify MONGO_URI in .env file
- For Atlas: Check network access and database user permissions

### Issue: Port Already in Use
**Solution**:
```bash
# Change PORT in .env file
PORT=5001
```

### Issue: npm command not found
**Solution**:
- Reinstall Node.js
- Restart terminal/command prompt
- Check PATH environment variable

### Issue: Module not found errors
**Solution**:
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### Issue: CORS errors
**Solution**:
- Backend already configured with CORS
- Check if both servers are running
- Verify proxy in vite.config.js

## 📊 Database Collections

### Users
- name, email, password (hashed)
- phone, role (user/admin)
- favorites (wishlist)
- timestamps

### Packages
- title, description, destination
- price, duration, groupSize
- hotel, transport details
- images, highlights, itinerary
- inclusions, exclusions
- category, availability, featured
- rating, reviewCount

### Bookings
- user, package references
- travelDate, passengers
- totalAmount, status
- paymentStatus
- contactPhone, contactEmail

### Payments
- booking, user references
- amount, method
- transactionId, status
- cardLast4, paidAt

### Reviews
- user, package references
- rating (1-5), title, comment
- timestamps

## 🎨 Features Checklist

### User Features
- ✅ User Registration & Login
- ✅ Browse & Search Packages
- ✅ Filter by Category, Price, Duration
- ✅ View Package Details
- ✅ Book Tours
- ✅ Demo Payment
- ✅ View Bookings
- ✅ Wishlist/Favorites
- ✅ User Profile
- ✅ Cancel Bookings

### Admin Features
- ✅ Admin Dashboard with Analytics
- ✅ Revenue Charts
- ✅ Add/Edit/Delete Packages
- ✅ Manage Bookings
- ✅ Update Booking Status
- ✅ View All Users
- ✅ Delete Users
- ✅ Popular Destinations Stats

## 🚀 Deployment Guide (Optional)

### Frontend Deployment (Vercel/Netlify)
1. Build the project:
   ```bash
   cd client
   npm run build
   ```
2. Deploy `dist` folder to Vercel or Netlify
3. Set environment variables in hosting platform

### Backend Deployment (Heroku/Railway)
1. Create Procfile:
   ```
   web: node server.js
   ```
2. Push to GitHub
3. Connect to Heroku/Railway
4. Set environment variables
5. Deploy

### Database (MongoDB Atlas)
- Already cloud-based
- No additional deployment needed

## 📞 Support & Help

### Common Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Seed database
npm run seed

# Build for production
npm run build

# Check for errors
npm run lint
```

### Useful Links
- Node.js: https://nodejs.org/
- MongoDB: https://www.mongodb.com/
- React: https://react.dev/
- Tailwind CSS: https://tailwindcss.com/
- Express.js: https://expressjs.com/

## ✅ Final Checklist

Before running the project:
- [ ] Node.js installed
- [ ] MongoDB installed/configured
- [ ] Dependencies installed (server & client)
- [ ] .env file created
- [ ] Database seeded
- [ ] Both servers running
- [ ] Browser opened to localhost:5173

## 🎉 Success!

If you see the homepage with tour packages, congratulations! Your Tours and Travel Management System is running successfully.

**Next Steps**:
1. Explore the website
2. Test booking flow
3. Login as admin
4. Customize packages
5. Add your own features

---

**Happy Coding! 🚀**
