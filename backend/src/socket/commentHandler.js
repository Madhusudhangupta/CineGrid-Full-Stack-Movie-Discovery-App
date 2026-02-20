const Comment = require('../models/Comment');
const User = require('../models/User');
const logger = require('../utils/logger');
const jwt = require('jsonwebtoken');

module.exports = (io) => {
  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    // Join movie comment room
    socket.on('join-room', (movieId) => {
      socket.join(movieId);
    });

    // Leave movie comment room
    socket.on('leave-room', (movieId) => {
      socket.leave(movieId);
    });

    // Post new comment
    socket.on('new-comment', async ({ movieId, comment, token }) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId || decoded.id).select('name');
        if (!user) {
          return socket.emit('error', 'Authentication failed.');
        }

        const newComment = new Comment({
          movieId: Number(movieId),
          comment,
          user: user._id,
        });
        await newComment.save();

        const commentData = {
          _id: newComment._id,
          comment: newComment.comment,
          createdAt: newComment.createdAt,
          user: {
            _id: user._id,
            name: user.name,
          },
        };

        // Broadcast to room
        io.to(movieId).emit('comment-received', commentData);
      } catch (err) {
        logger.error(`Socket error on new-comment: ${err.message}`);
        socket.emit('error', 'Failed to post comment.');
      }
    });

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });
};
