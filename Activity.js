const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Project', 'Competition', 'Workshop', 'Community Service', 'Research', 'Achievement', 'Other'],
    default: 'Other'
  },
  status: {
    type: String,
    enum: ['Planned', 'In Progress', 'Completed', 'On Hold'],
    default: 'Planned'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  participants: [{
    name: String,
    role: String,
    studentId: String
  }],
  leader: {
    type: String,
    required: true
  },
  images: [{
    filename: String,
    path: String,
    caption: String
  }],
  achievements: [{
    title: String,
    description: String,
    date: Date
  }],
  skills: [{
    type: String
  }],
  technologies: [{
    type: String
  }],
  isHighlighted: {
    type: Boolean,
    default: false
  },
  visibility: {
    type: String,
    enum: ['Public', 'Members Only', 'Private'],
    default: 'Public'
  },
  tags: [{
    type: String
  }]
}, {
  timestamps: true
});

// Indexes for better performance
activitySchema.index({ status: 1 });
activitySchema.index({ type: 1 });
activitySchema.index({ startDate: -1 });
activitySchema.index({ isHighlighted: 1 });

module.exports = mongoose.model('Activity', activitySchema);