const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { 
    type: String, 
    enum: ['recommendation', 'comment-reply', 'release', 'like', 'milestone', 'system'], 
    required: true 
  },
  title: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  link: { type: String }, // URL for click action
  data: { type: mongoose.Schema.Types.Mixed }, // Extra payload
  isRead: { type: Boolean, default: false, index: true },
  createdAt: { type: Date, default: Date.now },
});

// Indexes for query performance
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

// TTL index: Notifications auto-delete after 30 days
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

module.exports = mongoose.model('Notification', notificationSchema);
