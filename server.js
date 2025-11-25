const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Import routes
const announcementRoutes = require('./routes/announcements');
const eventRoutes = require('./routes/events');
const activityRoutes = require('./routes/activities');
const leadershipRoutes = require('./routes/leadership');
const authRoutes = require('./routes/auth');

// Configure dotenv
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (for uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/announcements', announcementRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/leadership', leadershipRoutes);
app.use('/api/auth', authRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'College Club API is running!' });
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI && process.env.MONGODB_URI !== 'mongodb+srv://demo:demo123@cluster0.mongodb.net/college-club?retryWrites=true&w=majority') {
      const conn = await mongoose.connect(process.env.MONGODB_URI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } else {
      console.log('MongoDB connection skipped - using demo credentials. Please update MONGODB_URI in .env');
      console.log('To use MongoDB Atlas:');
      console.log('1. Create a MongoDB Atlas account');
      console.log('2. Create a cluster and database');
      console.log('3. Update MONGODB_URI in .env with your connection string');
      console.log('4. Replace demo:demo123 with your actual username:password');
    }
  } catch (error) {
    console.warn('Database connection failed:', error.message);
    console.log('Continuing without database connection for demo purposes...');
  }
};

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
  console.log(`Frontend will be available at http://localhost:3000`);
  await connectDB();
});

module.exports = app;