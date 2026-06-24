
const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  movies: [{ type: Number }], // Legacy
  items: [{ 
    mediaId: { type: Number, required: true },
    mediaType: { type: String, enum: ['movie', 'tv'], default: 'movie' }
  }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Watchlist', watchlistSchema);