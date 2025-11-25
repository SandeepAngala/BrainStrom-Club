const express = require('express');
const Leadership = require('../models/Leadership');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'server/uploads/leadership/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'leader-' + uniqueSuffix + path.extname(file.originalname));
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

// GET all leadership members (public)
router.get('/', async (req, res) => {
  try {
    const { position, department, active = 'true' } = req.query;
    const filter = {};
    
    if (position) filter.position = position;
    if (department) filter.department = department;
    if (active === 'true') filter.isActive = true;
    
    const leaders = await Leadership.find(filter)
      .sort({ displayOrder: 1, position: 1 });
    
    res.json(leaders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leadership', error: error.message });
  }
});

// GET single leadership member
router.get('/:id', async (req, res) => {
  try {
    const leader = await Leadership.findById(req.params.id);
    if (!leader) {
      return res.status(404).json({ message: 'Leadership member not found' });
    }
    res.json(leader);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leadership member', error: error.message });
  }
});

// POST create leadership member (admin only)
router.post('/', authMiddleware, adminMiddleware, upload.single('image'), async (req, res) => {
  try {
    const leaderData = req.body;
    if (req.file) {
      leaderData.image = {
        filename: req.file.filename,
        path: req.file.path
      };
    }
    
    // Parse social links if they come as string
    if (typeof leaderData.socialLinks === 'string') {
      leaderData.socialLinks = JSON.parse(leaderData.socialLinks);
    }
    
    const leader = new Leadership(leaderData);
    await leader.save();
    res.status(201).json(leader);
  } catch (error) {
    res.status(400).json({ message: 'Error creating leadership member', error: error.message });
  }
});

// PUT update leadership member (admin only)
router.put('/:id', authMiddleware, adminMiddleware, upload.single('image'), async (req, res) => {
  try {
    const leaderData = req.body;
    if (req.file) {
      leaderData.image = {
        filename: req.file.filename,
        path: req.file.path
      };
    }
    
    // Parse social links if they come as string
    if (typeof leaderData.socialLinks === 'string') {
      leaderData.socialLinks = JSON.parse(leaderData.socialLinks);
    }
    
    const leader = await Leadership.findByIdAndUpdate(
      req.params.id,
      leaderData,
      { new: true, runValidators: true }
    );
    if (!leader) {
      return res.status(404).json({ message: 'Leadership member not found' });
    }
    res.json(leader);
  } catch (error) {
    res.status(400).json({ message: 'Error updating leadership member', error: error.message });
  }
});

// DELETE leadership member (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const leader = await Leadership.findByIdAndDelete(req.params.id);
    if (!leader) {
      return res.status(404).json({ message: 'Leadership member not found' });
    }
    res.json({ message: 'Leadership member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting leadership member', error: error.message });
  }
});

// GET leadership by position
router.get('/position/:position', async (req, res) => {
  try {
    const leaders = await Leadership.find({
      position: req.params.position,
      isActive: true
    }).sort({ displayOrder: 1 });
    
    res.json(leaders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leadership by position', error: error.message });
  }
});

// GET main leadership (Chancellor, Vice Chancellor, HOD)
router.get('/filter/main', async (req, res) => {
  try {
    const mainPositions = ['Chancellor', 'Vice Chancellor', 'HOD'];
    const leaders = await Leadership.find({
      position: { $in: mainPositions },
      isActive: true
    }).sort({ displayOrder: 1 });
    
    res.json(leaders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching main leadership', error: error.message });
  }
});

module.exports = router;