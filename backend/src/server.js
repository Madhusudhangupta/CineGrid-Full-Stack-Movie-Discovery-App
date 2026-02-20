require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
// const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth')
const commentsRoutes = require('./routes/comments');
const moviesRoutes = require('./routes/movies')
const moviesAdvancedRoutes = require('./routes/moviesAdvanced');
const reviewsRoutes = require('./routes/reviews');
const recommendationsRoutes = require('./routes/recommendations');
const watchlistRoutes = require('./routes/watchlist');
const notificationsRoutes = require('./routes/notifications');
const customListsRoutes = require('./routes/customLists');
const profileRoutes = require('./routes/profile');
const passwordResetRoutes = require('./routes/passwordReset');

// dotenv.config();
require('mandatoryenv').load([
    'MONGO_URI',
    'PORT',
    'JWT_SECRET',
    'TMDB_API_KEY',
    'TMDB_BASE_URL'
]);

const app = express();
connectDB();

const corsOptions = {
  origin: '*',
  credentials: true
};

app.use(cors(corsOptions));

// security headers
app.use(helmet());

// // basic rate limiting for all API routes
// app.use(
//   '/api/',
//   rateLimit({
//     windowMs: 15*60*1000,
//     max: 300,
//     standardHeaders: true,
//     legacyHeaders: false,
//   })
// );

app.use(express.json());

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Cinesphere</title>
      </head>
      <body>
        <h1>Welcome to Cinesphere Backend</h1>
        <p>Server is working fine...</p>
      </body>
    </html>
  `);
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/movies', moviesRoutes)
app.use('/api/movies-advanced', moviesAdvancedRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/recommendations', recommendationsRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/custom-lists', customListsRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/password-reset', passwordResetRoutes);

// global error handler to catch unhandled errors
app.use((err, req, res, next) => {
  // console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));

