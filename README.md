# Tours and Travel Management System

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) web application for managing tour packages, bookings, and travel services. Built as a BCA final year project.

## 🌟 Features

### User Features
- **Authentication**: Secure user registration and login with JWT
- **Browse Packages**: Search, filter, and sort tour packages
- **Package Details**: View comprehensive package information with itineraries
- **Booking System**: Book tours with passenger details
- **Payment Integration**: Demo payment gateway
- **Wishlist**: Save favorite packages
- **My Bookings**: Track and manage bookings
- **User Profile**: Update personal information

### Admin Features
- **Dashboard**: Analytics with charts and statistics
- **Package Management**: Add, edit, delete tour packages
- **Booking Management**: View and update booking status
- **User Management**: View and manage registered users
- **Revenue Tracking**: Monitor earnings and popular destinations

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **React Hot Toast** - Notifications
- **Framer Motion** - Animations

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt.js** - Password hashing
- **Multer** - File uploads
- **Express Validator** - Input validation

## 📁 Project Structure

```
tours-and-travels/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context (Auth)
│   │   ├── pages/         # Page components
│   │   │   ├── admin/    # Admin dashboard pages
│   │   │   ├── Home.jsx
│   │   │   ├── Packages.jsx
│   │   │   ├── PackageDetail.jsx
│   │   │   ├── Booking.jsx
│   │   │   ├── Payment.jsx
│   │   │   ├── PaymentSuccess.jsx
│   │   │   ├── MyBookings.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Wishlist.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── utils/         # Utility functions
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                # Node.js backend
│   ├── config/           # Database configuration
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Auth & admin middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── seed/             # Database seeding
│   ├── uploads/          # Uploaded images
│   ├── server.js         # Entry point
│   └── package.json
│
├── .env                  # Environment variables
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd tours-and-travels
```

### 2. Environment Variables
Create a `.env` file in the root directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/toursdb
JWT_SECRET=tours_travel_jwt_secret_key_2024_bca_project
NODE_ENV=development
```

### 3. Install Dependencies

#### Backend
```bash
cd server
npm install
```

#### Frontend
```bash
cd client
npm install
```

### 4. Seed Database (Optional)
Populate the database with sample data:
```bash
cd server
npm run seed
```

This creates:
- **Admin User**: admin@toursandtravels.com / admin123
- **Demo User**: rahul@example.com / user123
- **10 Sample Tour Packages**

### 5. Run the Application

#### Start Backend Server
```bash
cd server
npm run dev
```
Server runs on: `http://localhost:5000`

#### Start Frontend Development Server
```bash
cd client
npm run dev
```
Frontend runs on: `http://localhost:5173`

### 6. Access the Application
- **Website**: http://localhost:5173
- **Admin Panel**: http://localhost:5173/admin
- **API**: http://localhost:5000/api

## 👤 Demo Credentials

### Admin Account
- **Email**: admin@toursandtravels.com
- **Password**: admin123

### User Account
- **Email**: rahul@example.com
- **Password**: user123

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/favorites/:packageId` - Toggle wishlist

### Packages
- `GET /api/packages` - Get all packages (with filters)
- `GET /api/packages/:id` - Get package by ID
- `POST /api/packages` - Create package (admin)
- `PUT /api/packages/:id` - Update package (admin)
- `DELETE /api/packages/:id` - Delete package (admin)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my` - Get user bookings
- `GET /api/bookings/:id` - Get booking by ID
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `GET /api/bookings` - Get all bookings (admin)
- `PUT /api/bookings/:id/status` - Update status (admin)

### Payments
- `POST /api/payments` - Process payment
- `GET /api/payments/booking/:bookingId` - Get payment by booking
- `GET /api/payments` - Get all payments (admin)

### Reviews
- `POST /api/reviews` - Add review
- `GET /api/reviews/package/:packageId` - Get package reviews
- `DELETE /api/reviews/:id` - Delete review

### Admin
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/users/:id` - Delete user

## 🎨 Key Features Explained

### Search & Filters
- Text search across title, destination, description
- Filter by category, price range, duration
- Sort by price, rating, duration
- Pagination support

### Booking Flow
1. Select package
2. Choose travel date
3. Add passenger details
4. Review booking summary
5. Make payment
6. Receive confirmation

### Admin Dashboard
- Real-time statistics
- Revenue charts (monthly)
- Booking status distribution
- Popular destinations
- Recent bookings list

### Security
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes (user & admin)
- Input validation
- CORS enabled

## 📱 Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly UI
- Adaptive navigation

## 🎯 Future Enhancements
- Real payment gateway integration (Razorpay/Stripe)
- Email notifications
- SMS alerts
- Google Maps integration
- Multi-language support
- Advanced analytics
- Review system with images
- Social media login
- Referral program
- Mobile app (React Native)

## 🐛 Known Issues
- Image upload currently uses placeholder URLs
- Payment is demo mode only
- Email notifications not implemented

## 📝 License
This project is created for educational purposes as a BCA final year project.

## 👨‍💻 Author
**BCA Final Year Project**
- Tours and Travel Management System
- Year: 2024

## 🙏 Acknowledgments
- Unsplash for placeholder images
- Lucide for icons
- Tailwind CSS for styling framework
- MongoDB Atlas for database hosting

## 📞 Support
For any queries or issues, please contact the project maintainer.

---

**Note**: This is a demo project for educational purposes. For production use, implement proper security measures, real payment gateways, and production-grade error handling.
