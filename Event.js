const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Workshop', 'Seminar', 'Competition', 'Social', 'Meeting', 'Conference', 'Other'],
    default: 'Other'
  },
  organizer: {
    type: String,
    required: true
  },
  maxParticipants: {
    type: Number,
    default: null
  },
  currentParticipants: {
    type: Number,
    default: 0
  },
  registrationRequired: {
    type: Boolean,
    default: false
  },
  registrationDeadline: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'],
    default: 'Upcoming'
  },
  image: {
    filename: String,
    path: String
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  requirements: {
    type: String
  },
  contactEmail: {
    type: String
  },
  tags: [{
    type: String
  }]
}, {
  timestamps: true
});

// Indexes for better performance
eventSchema.index({ date: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ category: 1 });

module.exports = mongoose.model('Event', eventSchema);