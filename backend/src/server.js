require('dotenv').config();

const express = require('express');
const cors = require('cors');
// const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth')
const commentsRoutes = require('./routes/comments');
const moviesRoutes = require('./routes/movies')
const reviewsRoutes = require('./routes/reviews');
const recommendationsRoutes = require('./routes/recommendations');
const watchlistRoutes = require('./routes/watchlist');

// dotenv.config();
require('mandatoryenv').load([
    'MONGO_URI',
    'PORT',
    'JWT_SECRET',
    'TMDB_API_KEY'
]);

connectDB();

const app = express();
const corsOptions = {
  origin: '*',
  credentials: true
};

app.use(cors(corsOptions));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/movies', moviesRoutes)
app.use('/api/reviews', reviewsRoutes);
app.use('/api/recommendations', recommendationsRoutes);
app.use('/api/watchlist', watchlistRoutes);

// global error handler to catch unhandled errors
app.use((err, req, res, next) => {
  // console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

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
