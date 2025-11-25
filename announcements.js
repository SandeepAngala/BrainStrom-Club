const express = require('express');
const Announcement = require('../models/Announcement');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET all announcements (public)
router.get('/', async (req, res) => {
  try {
    const { category, priority, limit = 10, page = 1 } = req.query;
    const filter = { isActive: true };
    
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    
    const announcements = await Announcement.find(filter)
      .sort({ publishDate: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await Announcement.countDocuments(filter);
    
    res.json({
      announcements,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching announcements', error: error.message });
  }
});

// GET single announcement
router.get('/:id', async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    res.json(announcement);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching announcement', error: error.message });
  }
});

// POST create announcement (admin only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const announcement = new Announcement(req.body);
    await announcement.save();
    res.status(201).json(announcement);
  } catch (error) {
    res.status(400).json({ message: 'Error creating announcement', error: error.message });
  }
});

// PUT update announcement (admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    res.json(announcement);
  } catch (error) {
    res.status(400).json({ message: 'Error updating announcement', error: error.message });
  }
});

// DELETE announcement (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting announcement', error: error.message });
  }
});

// GET announcements by category
router.get('/category/:category', async (req, res) => {
  try {
    const announcements = await Announcement.find({
      category: req.params.category,
      isActive: true
    }).sort({ publishDate: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching announcements', error: error.message });
  }
});

module.exports = router;