const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  movieId: { type: Number, required: true }, // acts as mediaId
  mediaType: { type: String, enum: ['movie', 'tv'], default: 'movie' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Review', reviewSchema);