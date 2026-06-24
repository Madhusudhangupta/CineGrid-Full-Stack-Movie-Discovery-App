const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: [
      'USER_RATED_MOVIE',
      'USER_ADDED_TO_WATCHLIST',
      'USER_CREATED_CUSTOM_LIST',
      'USER_COMMENTED_ON_MOVIE',
      'USER_EARNED_ACHIEVEMENT'
    ],
    required: true,
  },
  mediaId: {
    type: Number,
    required: false,
  },
  mediaType: {
    type: String,
    enum: ['movie', 'tv'],
    default: 'movie',
  },
  mediaTitle: {
    type: String, // Cached title to avoid fetching from TMDB constantly
    required: false,
  },
  rating: {
    type: Number, // Used if type is USER_RATED_MOVIE
    required: false,
  },
  listId: {
    type: mongoose.Schema.Types.ObjectId, // Used if type is USER_CREATED_CUSTOM_LIST
    ref: 'CustomList',
    required: false,
  },
  achievementName: {
    type: String, // Used if type is USER_EARNED_ACHIEVEMENT
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index to quickly fetch feeds for followed users
ActivitySchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Activity', ActivitySchema);
