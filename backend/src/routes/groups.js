const express = require('express');
const Joi = require('joi');
const authMiddleware = require('../middleware/auth');
const Group = require('../models/Group');

const router = express.Router();

const validate = (schema, type = 'body') => (req, res, next) => {
  const { error } = schema.validate(req[type]);
  if (error) return res.status(400).json({ error: error.message });
  next();
};

const createGroupSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(1000).allow(''),
  isPrivate: Joi.boolean().default(false),
});

// List groups (with search)
router.get('/', authMiddleware, async (req, res) => {
  const { q, page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  const query = q ? { $text: { $search: q } } : {};
  
  if (!q) {
    query.isPrivate = false; // Show only public groups by default if no search
  }

  const [groups, total] = await Promise.all([
    Group.find(query)
      .select('name description avatar isPrivate members admins')
      .sort(q ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Group.countDocuments(query)
  ]);

  res.json({
    items: groups,
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    pages: Math.ceil(total / limit)
  });
});

// My Groups
router.get('/my-groups', authMiddleware, async (req, res) => {
  const groups = await Group.find({ members: req.user._id })
    .select('name description avatar isPrivate members admins')
    .sort({ createdAt: -1 });
  res.json(groups);
});

// Create group
router.post('/', authMiddleware, validate(createGroupSchema), async (req, res) => {
  const { name, description, isPrivate } = req.body;
  
  const existing = await Group.findOne({ name });
  if (existing) return res.status(400).json({ error: 'Group name already exists' });

  const group = new Group({
    name,
    description,
    isPrivate,
    members: [req.user._id],
    admins: [req.user._id]
  });

  await group.save();
  res.status(201).json(group);
});

// Get single group
router.get('/:id', authMiddleware, async (req, res) => {
  const group = await Group.findById(req.params.id)
    .populate('members', 'username name avatar')
    .populate('admins', 'username name avatar')
    .populate('discussions.user', 'username name avatar');
    
  if (!group) return res.status(404).json({ error: 'Group not found' });
  
  // Check if private and not a member
  if (group.isPrivate && !group.members.some(m => m._id.toString() === req.user._id.toString())) {
    return res.status(403).json({ error: 'This group is private. You must be a member to view it.' });
  }

  res.json(group);
});

// Join group
router.post('/:id/join', authMiddleware, async (req, res) => {
  const group = await Group.findById(req.params.id);
  if (!group) return res.status(404).json({ error: 'Group not found' });

  if (group.members.includes(req.user._id)) {
    return res.status(400).json({ error: 'You are already a member' });
  }

  group.members.push(req.user._id);
  await group.save();
  res.json({ message: 'Joined successfully' });
});

// Leave group
router.post('/:id/leave', authMiddleware, async (req, res) => {
  const group = await Group.findById(req.params.id);
  if (!group) return res.status(404).json({ error: 'Group not found' });

  group.members = group.members.filter(id => id.toString() !== req.user._id.toString());
  group.admins = group.admins.filter(id => id.toString() !== req.user._id.toString());
  
  // If no admins left but members exist, make first member an admin
  if (group.admins.length === 0 && group.members.length > 0) {
    group.admins.push(group.members[0]);
  }

  await group.save();
  res.json({ message: 'Left successfully' });
});

// Add discussion
router.post('/:id/discussions', authMiddleware, async (req, res) => {
  const { content } = req.body;
  if (!content || !content.trim()) return res.status(400).json({ error: 'Content is required' });

  const group = await Group.findById(req.params.id);
  if (!group) return res.status(404).json({ error: 'Group not found' });

  if (!group.members.includes(req.user._id)) {
    return res.status(403).json({ error: 'You must be a member to post' });
  }

  group.discussions.push({
    user: req.user._id,
    content: content.trim()
  });

  await group.save();
  res.json(group.discussions[group.discussions.length - 1]);
});

// Delete discussion
router.delete('/:id/discussions/:discussionId', authMiddleware, async (req, res) => {
  const group = await Group.findById(req.params.id);
  if (!group) return res.status(404).json({ error: 'Group not found' });

  const isAdmin = group.admins.includes(req.user._id);
  
  const discussionIndex = group.discussions.findIndex(d => d._id.toString() === req.params.discussionId);
  if (discussionIndex === -1) return res.status(404).json({ error: 'Discussion not found' });

  const isAuthor = group.discussions[discussionIndex].user.toString() === req.user._id.toString();

  if (!isAdmin && !isAuthor) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  group.discussions.splice(discussionIndex, 1);
  await group.save();

  res.json({ message: 'Discussion deleted' });
});

module.exports = router;
