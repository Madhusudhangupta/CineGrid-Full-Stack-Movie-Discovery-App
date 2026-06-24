
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  movieId: { type: Number, required: true }, // acts as mediaId
  mediaType: { type: String, enum: ['movie', 'tv'], default: 'movie' },
  comment: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Comment', commentSchema);