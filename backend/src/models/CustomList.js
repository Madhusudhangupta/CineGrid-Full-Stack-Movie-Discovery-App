const mongoose = require('mongoose');

const customListSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, trim: true, maxlength: 500 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  movies: [{ type: Number }], // TMDb movie IDs
  isPublic: { type: Boolean, default: false, index: true },
  coverImage: { type: String }, // URL
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

customListSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Compound index
customListSchema.index({ user: 1, createdAt: -1 });
customListSchema.index({ isPublic: 1, createdAt: -1 });

module.exports = mongoose.model('CustomList', customListSchema);
