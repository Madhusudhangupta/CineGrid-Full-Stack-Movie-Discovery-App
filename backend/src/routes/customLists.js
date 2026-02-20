const express = require('express');
const Joi = require('joi');
const authMiddleware = require('../middleware/auth');
const CustomList = require('../models/CustomList');

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

  const [lists, total] = await Promise.all([
    CustomList.find({ user: req.user._id }).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
    CustomList.countDocuments({ user: req.user._id }),
  ]);

  res.json({ items: lists, page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) });
});

// Create new list
router.post('/', authMiddleware, validate(createListSchema), async (req, res) => {
  const { name, description, isPublic, coverImage } = req.body;
  const list = new CustomList({ name, description, isPublic, coverImage, user: req.user._id, movies: [] });
  await list.save();
  res.status(201).json(list);
});

// Add movie to list
router.post('/:listId/movies', authMiddleware, async (req, res) => {
  const { listId } = req.params;
  const { movieId } = req.body;

  const list = await CustomList.findById(listId);
  if (!list) return res.status(404).json({ error: 'List not found' });
  if (list.user.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Not authorized' });
  if (list.movies.includes(movieId)) return res.status(400).json({ error: 'Movie already added' });
  
  list.movies.push(movieId);
  await list.save();
  res.json(list);
});

// Remove movie from list
router.delete('/:listId/movies/:movieId', authMiddleware, async (req, res) => {
  const { listId, movieId } = req.params;

  const list = await CustomList.findById(listId);
  if (!list) return res.status(404).json({ error: 'List not found' });
  if (list.user.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Not authorized' });

  list.movies = list.movies.filter(id => id !== Number(movieId));
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

module.exports = router;
