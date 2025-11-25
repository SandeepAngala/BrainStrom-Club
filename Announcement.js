const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['General', 'Academic', 'Event', 'Important', 'Club News'],
    default: 'General'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  author: {
    type: String,
    required: true
  },
  publishDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  attachments: [{
    filename: String,
    path: String,
    size: Number
  }],
  tags: [{
    type: String
  }]
}, {
  timestamps: true
});

// Index for better search performance
announcementSchema.index({ title: 'text', content: 'text' });
announcementSchema.index({ publishDate: -1 });

module.exports = mongoose.model('Announcement', announcementSchema);