const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    minlength: [2, 'First name must be at least 2 characters'],
    maxlength: [50, 'First name must be at most 50 characters'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    minlength: [2, 'Last name must be at least 2 characters'],
    maxlength: [50, 'Last name must be at most 50 characters'],
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    lowercase: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username must be at most 30 characters'],
    match: [/^[a-z0-9_.-]+$/, 'Username can only contain lowercase letters, numbers, dot, hyphen, and underscore'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/,
      'Please fill a valid email address',
    ],
  },
  name: { type: String, trim: true },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false,
  },
  bio: { type: String, trim: true, maxlength: 500 },
  avatar: { type: String }, // URL
  preferences: {
    genres: [{ type: Number }],
    languages: [{ type: String }],
    notifyOnRelease: { type: Boolean, default: true },
    notifyOnRecommendation: { type: Boolean, default: true },
    notifyOnComment: { type: Boolean, default: true },
  },
  privacy: {
    profileVisibility: { type: String, enum: ['public', 'private', 'friends'], default: 'public' },
    showWatchlist: { type: Boolean, default: true },
    showReviews: { type: Boolean, default: true },
  },
  viewingHistory: [
    {
      movieId: { type: Number },
      viewedAt: { type: Date, default: Date.now },
    },
  ],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now },
});

userSchema.pre('validate', function(next) {
  const fullName = `${this.firstName || ''} ${this.lastName || ''}`.trim();
  if (fullName) this.name = fullName;
  next();
});

// Hash password before save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Generate JWT token
userSchema.methods.generateAuthToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Compare passwords
userSchema.methods.comparePassword = async function(candidatePwd) {
  return await bcrypt.compare(candidatePwd, this.password);
};

module.exports = mongoose.model('User', userSchema);
