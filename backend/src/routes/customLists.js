const express = require('express');
const Joi = require('joi');
const authMiddleware = require('../middleware/auth');
const CustomList = require('../models/CustomList');
const Activity = require('../models/Activity');
const { checkMilestones } = require('../services/achievements');

const router = express.Router();

const validate = (schema, type = 'body') => (req, res, next) => {
  const { error } = schema.validate(req[type]);
  if (error) {
    error.isJoi = true;
    return next(error);
  }
  next();
};

const createListSchema = Joi.object({
  name: Joi.string().max(100).required(),
  description: Joi.string().max(500).allow(''),
  isPublic: Joi.boolean().default(false),
  coverImage: Joi.string().uri().optional(),
});

// Get current user's lists (paginated)
router.get('/my-lists', authMiddleware, async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const query = { $or: [{ user: req.user._id }, { collaborators: req.user._id }] };

  const [lists, total] = await Promise.all([
    CustomList.find(query).populate('collaborators', 'username avatar').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
    CustomList.countDocuments(query),
  ]);

  res.json({ items: lists, page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) });
});

// Create new list
router.post('/', authMiddleware, validate(createListSchema), async (req, res) => {
  const { name, description, isPublic, coverImage } = req.body;
  const list = new CustomList({ name, description, isPublic, coverImage, user: req.user._id, items: [] });
  await list.save();

  // Create activity
  if (isPublic) {
    try {
      await Activity.create({
        user: req.user._id,
        type: 'USER_CREATED_CUSTOM_LIST',
        listId: list._id,
      });
    } catch (actErr) {
      console.error('Failed to create custom list activity:', actErr);
    }
  }

  // Check milestones
  await checkMilestones(req.user._id, 'LIST');

  res.status(201).json(list);
});

// Add movie to list
router.post('/:listId/items', authMiddleware, async (req, res) => {
  const { listId } = req.params;
  const { mediaId, mediaType = 'movie' } = req.body;
  const list = await CustomList.findOne({ _id: listId, $or: [{ user: req.user._id }, { collaborators: req.user._id }] });
  if (!list) return res.status(404).json({ error: 'List not found' });
  
  if (!list.items) list.items = [];
  const exists = list.items.some(i => i.mediaId === Number(mediaId) && i.mediaType === mediaType);
  if (exists) return res.status(400).json({ error: 'Item already added' });
  
  list.items.push({ mediaId: Number(mediaId), mediaType });
  await list.save();
  res.json(list);
});

// Remove movie from list
router.delete('/:listId/items/:mediaId', authMiddleware, async (req, res) => {
  const { listId, mediaId } = req.params;
  const { mediaType = 'movie' } = req.query; // pass mediaType in query, or default to movie

  const list = await CustomList.findOne({ _id: listId, $or: [{ user: req.user._id }, { collaborators: req.user._id }] });
  if (!list) return res.status(404).json({ error: 'List not found' });

  if (list.items) {
    list.items = list.items.filter(item => !(item.mediaId === Number(mediaId) && item.mediaType === mediaType));
  }
  // Remove from legacy as well just in case
  if (list.movies) {
    list.movies = list.movies.filter(id => id !== Number(mediaId));
  }

  await list.save();
  res.json(list);
});

// Delete list
router.delete('/:listId', authMiddleware, async (req, res) => {
  const { listId } = req.params;
  const list = await CustomList.findById(listId);
  if (!list) return res.status(404).json({ error: 'List not found' });
  if (list.user.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Not authorized' });

  await list.deleteOne();
  res.json({ message: 'List deleted' });
});

// Add collaborator
router.post('/:listId/collaborators', authMiddleware, async (req, res) => {
  const { listId } = req.params;
  const { userId } = req.body;

  const list = await CustomList.findOne({ _id: listId, user: req.user._id });
  if (!list) return res.status(404).json({ error: 'List not found or you are not the owner' });
  
  if (list.collaborators.includes(userId)) return res.status(400).json({ error: 'User is already a collaborator' });
  
  list.collaborators.push(userId);
  await list.save();
  res.json(list);
});

// Remove collaborator
router.delete('/:listId/collaborators/:userId', authMiddleware, async (req, res) => {
  const { listId, userId } = req.params;

  const list = await CustomList.findOne({ _id: listId, user: req.user._id });
  if (!list) return res.status(404).json({ error: 'List not found or you are not the owner' });

  list.collaborators = list.collaborators.filter(id => id.toString() !== userId);
  await list.save();
  res.json(list);
});

module.exports = router;
