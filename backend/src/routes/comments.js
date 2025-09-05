
const express = require('express');
const authMiddleware = require('../middleware/auth');
const Comment = require('../models/Comment');
const router = express.Router();

router.get('/:movieId', async (req, res) => {
  try {
    const comments = await Comment.find({ movieId: req.params.movieId }).populate('user', 'name');
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  const { movieId, comment } = req.body;
  try {
    const newComment = new Comment({
      movieId,
      comment,
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