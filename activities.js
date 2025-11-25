const express = require('express');
const Activity = require('../models/Activity');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'server/uploads/activities/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'activity-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// GET all activities (public)
router.get('/', async (req, res) => {
  try {
    const { type, status, highlighted, limit = 10, page = 1 } = req.query;
    const filter = { visibility: { $in: ['Public', 'Members Only'] } };
    
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (highlighted === 'true') filter.isHighlighted = true;
    
    const activities = await Activity.find(filter)
      .sort({ startDate: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await Activity.countDocuments(filter);
    
    res.json({
      activities,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activities', error: error.message });
  }
});

// GET single activity
router.get('/:id', async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity || activity.visibility === 'Private') {
      return res.status(404).json({ message: 'Activity not found' });
    }
    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activity', error: error.message });
  }
});

// POST create activity (admin only)
router.post('/', authMiddleware, adminMiddleware, upload.array('images', 5), async (req, res) => {
  try {
    const activityData = req.body;
    
    // Handle multiple image uploads
    if (req.files && req.files.length > 0) {
      activityData.images = req.files.map(file => ({
        filename: file.filename,
        path: file.path,
        caption: ''
      }));
    }
    
    // Parse participants if they come as string
    if (typeof activityData.participants === 'string') {
      activityData.participants = JSON.parse(activityData.participants);
    }
    
    const activity = new Activity(activityData);
    await activity.save();
    res.status(201).json(activity);
  } catch (error) {
    res.status(400).json({ message: 'Error creating activity', error: error.message });
  }
});

// PUT update activity (admin only)
router.put('/:id', authMiddleware, adminMiddleware, upload.array('images', 5), async (req, res) => {
  try {
    const activityData = req.body;
    
    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({
        filename: file.filename,
        path: file.path,
        caption: ''
      }));
      
      // Merge with existing images if any
      if (activityData.images) {
        const existingImages = typeof activityData.images === 'string' 
          ? JSON.parse(activityData.images) 
          : activityData.images;
        activityData.images = [...existingImages, ...newImages];
      } else {
        activityData.images = newImages;
      }
    }
    
    // Parse participants if they come as string
    if (typeof activityData.participants === 'string') {
      activityData.participants = JSON.parse(activityData.participants);
    }
    
    const activity = await Activity.findByIdAndUpdate(
      req.params.id,
      activityData,
      { new: true, runValidators: true }
    );
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    res.json(activity);
  } catch (error) {
    res.status(400).json({ message: 'Error updating activity', error: error.message });
  }
});

// DELETE activity (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting activity', error: error.message });
  }
});

// GET highlighted activities
router.get('/filter/highlighted', async (req, res) => {
  try {
    const activities = await Activity.find({
      isHighlighted: true,
      visibility: { $in: ['Public', 'Members Only'] }
    }).sort({ startDate: -1 }).limit(6);
    
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching highlighted activities', error: error.message });
  }
});

module.exports = router;