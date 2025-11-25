const mongoose = require('mongoose');

const leadershipSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    required: true,
    enum: ['Chancellor', 'Vice Chancellor', 'HOD', 'Club President', 'Vice President', 'Secretary', 'Treasurer', 'Technical Lead', 'Event Coordinator', 'Other']
  },
  department: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String
  },
  bio: {
    type: String
  },
  image: {
    filename: String,
    path: String
  },
  socialLinks: {
    linkedin: String,
    twitter: String,
    github: String,
    website: String
  },
  achievements: [{
    title: String,
    year: String,
    description: String
  }],
  education: [{
    degree: String,
    institution: String,
    year: String
  }],
  expertise: [{
    type: String
  }],
  joinDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  officeHours: {
    type: String
  },
  officeLocation: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes for better performance
leadershipSchema.index({ position: 1 });
leadershipSchema.index({ displayOrder: 1 });
leadershipSchema.index({ isActive: 1 });

module.exports = mongoose.model('Leadership', leadershipSchema);