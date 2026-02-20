const express = require('express');
const crypto = require('crypto');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const PasswordReset = require('../models/PasswordReset');
const sendEmail = require('../utils/sendEmail');
const logger = require('../utils/logger');

const router = express.Router();

const validate = (schema, type = 'body') => (req, res, next) => {
  const { error } = schema.validate(req[type]);
  if (error) { error.isJoi = true; return next(error); }
  next();
};

const forgotPasswordSchema = Joi.object({ email: Joi.string().email().required() });
const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
});

router.post('/forgot', validate(forgotPasswordSchema), async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.json({ message: 'If email exists, reset link sent.' });

    await PasswordReset.deleteMany({ user: user._id });

    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const expiresAt = new Date(Date.now() + 3600000); // 1 hour

    await new PasswordReset({ user: user._id, token: hashedToken, expiresAt }).save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}&email=${email}`;

    const html = `<p>Click to reset password: <a href="${resetUrl}">${resetUrl}</a></p>
                  <p>This link expires in 1 hour.</p>`;

    const emailSent = await sendEmail(email, 'Password Reset - CineGrid', html);

    if (!emailSent) return res.status(500).json({ error: 'Failed to send email' });

    res.json({ message: 'If email exists, reset link sent.' });
  } catch (err) {
    logger.error(`Forgot password: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/reset', validate(resetPasswordSchema), async (req, res) => {
  try {
    const { token, password, confirmPassword, email } = req.body;
    if (password !== confirmPassword) return res.status(400).json({ error: 'Passwords do not match' });

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const resetRecord = await PasswordReset.findOne({ token: hashedToken, expiresAt: { $gt: new Date() } }).populate('user');

    if (!resetRecord) return res.status(400).json({ error: 'Invalid or expired token' });
    if (resetRecord.user.email !== email) return res.status(400).json({ error: 'Email mismatch' });

    const hashedPwd = await bcrypt.hash(password, 10);
    resetRecord.user.password = hashedPwd;
    await resetRecord.user.save();
    await resetRecord.deleteOne();

    await sendEmail(email, 'CineGrid Password Reset Successful', `<p>Your password has been reset successfully.</p>`);

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    logger.error(`Reset password: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/verify-token', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: 'Token required' });
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const resetRecord = await PasswordReset.findOne({ token: hashedToken, expiresAt: { $gt: new Date() } });
    if (!resetRecord) return res.status(400).json({ error: 'Invalid or expired token' });
    res.json({ message: 'Token valid' });
  } catch (err) {
    logger.error(`Verify token: ${err.message}`);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
