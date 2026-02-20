
const express = require('express');
const authMiddleware = require('../middleware/auth');
const Comment = require('../models/Comment');
const router = express.Router();

router.get('/:movieId', async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1,1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
    const skip = (page - 1) * limit;
    const movieId = Number(req.params.movieId);

    const [items, total] = await Promise.all([
      Comment.find({ movieId })
        .sort({ createdAt: -1})
        .skip(skip)
        .limit(limit)
        .populate('user', 'name'),
      Comment.countDocuments({ movieId }),
    ]);
    res.json({ items, page, limit, total, pages: Math.ceil(total / limit) }); 
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { movieId, comment } = req.body;
    if(!Number.isFinite(Number(movieId))) {
      return res.status(400).json({ error: 'Invalid movieId' });
    }
    if(typeof comment !== 'string' || comment.trim().length === 0 || comment.length > 1000) {
      return res.status(400).json({ error: 'Comment must be 1-1000 characters' });
    }
    const newComment = new Comment({
      movieId: Number(movieId),
      comment: comment.trim(),
      user: req.user.userId,
    });
    await newComment.save();
    const populatedComment = await Comment.findById(newComment._id).populate('user', 'name');
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    if (comment.user.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

module.exports = router;
