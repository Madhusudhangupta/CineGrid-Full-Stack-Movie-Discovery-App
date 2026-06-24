const User = require('../models/User');
const Review = require('../models/Review');
const CustomList = require('../models/CustomList');
const Activity = require('../models/Activity');

const ACHIEVEMENTS = {
  FIRST_REVIEW: {
    name: 'Critic',
    description: 'Wrote your first review.',
    icon: '✍️',
  },
  TEN_MOVIES: {
    name: 'Cinephile',
    description: 'Watched 10 movies/shows.',
    icon: '🍿',
  },
  FIRST_LIST: {
    name: 'Curator',
    description: 'Created your first custom list.',
    icon: '📋',
  },
};

const checkAndGrantAchievement = async (userId, achievementKey) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const achievementData = ACHIEVEMENTS[achievementKey];
    if (!achievementData) return;

    // Check if already earned
    const hasAchievement = user.achievements.some((a) => a.name === achievementData.name);
    if (hasAchievement) return;

    // Grant
    user.achievements.push(achievementData);
    await user.save();

    // Create activity
    await Activity.create({
      user: userId,
      type: 'USER_EARNED_ACHIEVEMENT',
      achievementName: achievementData.name,
    });
  } catch (error) {
    console.error('Error granting achievement:', error);
  }
};

const checkMilestones = async (userId, actionType) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    switch (actionType) {
      case 'REVIEW': {
        const reviewCount = await Review.countDocuments({ user: userId });
        if (reviewCount === 1) {
          await checkAndGrantAchievement(userId, 'FIRST_REVIEW');
        }
        break;
      }
      case 'WATCH': {
        if (user.viewingHistory && user.viewingHistory.length === 10) {
          await checkAndGrantAchievement(userId, 'TEN_MOVIES');
        }
        break;
      }
      case 'LIST': {
        const listCount = await CustomList.countDocuments({ user: userId });
        if (listCount === 1) {
          await checkAndGrantAchievement(userId, 'FIRST_LIST');
        }
        break;
      }
    }
  } catch (error) {
    console.error('Error checking milestones:', error);
  }
};

module.exports = {
  checkMilestones,
};
