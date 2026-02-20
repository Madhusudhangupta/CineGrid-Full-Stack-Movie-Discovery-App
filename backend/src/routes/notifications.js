const express = require('express');
const Joi = require('joi');
const authMiddleware = require('../middleware/auth');
const Notification = require('../models/Notification');
const router = express.Router();

const validate = (schema, type = 'body') => (req, res, next) => {
  const { error } = schema.validate(req[type]);
  if (error) {
    error.isJoi = true;
    return next(error);
  }
  next();
};

const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(20),
  unreadOnly: Joi.boolean().optional(),
});

const notificationIdSchema = Joi.object({ notificationId: Joi.string().required() });

// Get notifications with pagination and optional unread filter
router.get('/', authMiddleware, validate(paginationSchema, 'query'), async (req, res) => {
  try {
    const { page, limit, unreadOnly } = req.query;
    const skip = (page - 1) * limit;

    const query = { user: req.user._id };
    if (unreadOnly === true || unreadOnly === 'true') query.isRead = false;

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Notification.countDocuments(query),
      Notification.countDocuments({ user: req.user._id, isRead: false }),
    ]);

    res.json({
      items: notifications,
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
      unreadCount,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Get unread notifications count
router.get('/unread-count', authMiddleware, async (req, res) => {
  try {
    const count = await Notification.countDocuments({ user: req.user._id, isRead: false });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
});

// Mark notification as read
router.patch('/:notificationId/read', authMiddleware, validate(notificationIdSchema, 'params'), async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.notificationId);
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    if (notification.user.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Not authorized' });

    notification.isRead = true;
    await notification.save();
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

// Mark all notifications as read
router.patch('/mark-all-read', authMiddleware, async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
});

// Delete notification
router.delete('/:notificationId', authMiddleware, validate(notificationIdSchema, 'params'), async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.notificationId);
    if (!notification) return res.status(404).json({ error: 'Not found' });
    if (notification.user.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Not authorized' });

    await notification.deleteOne();
    res.json({ message: 'Notification deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

// Clear all read notifications
router.delete('/clear/read', authMiddleware, async (req, res) => {
  try {
    await Notification.deleteMany({ user: req.user._id, isRead: true });
    res.json({ message: 'Read notifications cleared' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear notifications' });
  }
});

module.exports = router;
