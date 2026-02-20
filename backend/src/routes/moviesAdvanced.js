const express = require('express');
const Joi = require('joi');
const { discoverMovies, fetchProviders } = require('../utils/api');
const logger = require('../utils/logger');

const router = express.Router();

const validate = (schema, type) => (req, res, next) => {
  const { error } = schema.validate(req[type]);
  if (error) {
    error.isJoi = true;
    return next(error);
  }
  next();
};

const advancedSearchSchema = Joi.object({
  query: Joi.string().min(1).max(256).optional(),
  genres: Joi.string().optional(),
  yearFrom: Joi.number().integer().min(1800).max(2050).optional(),
  yearTo: Joi.number().integer().min(1800).max(2050).optional(),
  ratingMin: Joi.number().min(0).max(10).optional(),
  ratingMax: Joi.number().min(0).max(10).optional(),
  sortBy: Joi.string().valid('popularity.desc', 'popularity.asc', 'rating.desc', 'rating.asc', 'release_date.desc', 'release_date.asc').default('popularity.desc'),
  page: Joi.number().integer().min(1).default(1),
  language: Joi.string().default('en-US'),
});

router.get('/advanced-search', validate(advancedSearchSchema, 'query'), async (req, res) => {
  try {
    const params = {};
    if (req.query.query) {
      params.query = req.query.query;
    }
    if (req.query.genres) {
      params.with_genres = req.query.genres;
    }
    if (req.query.yearFrom) {
      params['primary_release_date.gte'] = `${req.query.yearFrom}-01-01`;
    }
    if (req.query.yearTo) {
      params['primary_release_date.lte'] = `${req.query.yearTo}-12-31`;
    }
    if (req.query.ratingMin) {
      params['vote_average.gte'] = req.query.ratingMin;
    }
    if (req.query.ratingMax) {
      params['vote_average.lte'] = req.query.ratingMax;
    }
    params.sort_by = req.query.sortBy;
    params.page = req.query.page;
    params.language = req.query.language;

    const data = await discoverMovies(params);
    res.json(data);
  } catch (error) {
    logger.error('Advanced movie search error: ' + error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const decadeSchema = Joi.object({
  decade: Joi.number().integer().min(1800).max(2050).required(),
  page: Joi.number().integer().min(1).default(1),
});

router.get('/by-decade/:decade', validate(decadeSchema, 'params'), async (req, res) => {
  try {
    const yearStart = req.params.decade;
    const yearEnd = Number(yearStart) + 9;
    const params = {
      'primary_release_date.gte': `${yearStart}-01-01`,
      'primary_release_date.lte': `${yearEnd}-12-31`,
      page: req.query.page || 1,
      sort_by: 'popularity.desc',
      language: 'en-US',
    };
    const data = await discoverMovies(params);
    res.json(data);
  } catch (error) {
    logger.error('Movies by decade error: ' + error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const personSchema = Joi.object({
  personId: Joi.number().integer().required(),
  page: Joi.number().integer().min(1).default(1),
});

router.get('/by-person/:personId', validate(personSchema, 'params'), async (req, res) => {
  try {
    // For simplicity, use TMDb person movie credits endpoint in utils/api
    const data = await require('../utils/api').fetchPersonMovieCredits(req.params.personId);
    res.json(data);
  } catch (error) {
    logger.error('Movies by person error: ' + error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const streamingSchema = Joi.object({
  provider: Joi.number().integer().required(),
  page: Joi.number().integer().min(1).default(1),
});

router.get('/streaming/:provider', validate(streamingSchema, 'params'), async (req, res) => {
  try {
    const params = {
      with_watch_providers: req.params.provider,
      watch_region: 'US',
      page: req.query.page || 1,
      sort_by: 'popularity.desc',
      language: 'en-US'
    };
    const data = await discoverMovies(params);
    res.json(data);
  } catch (error) {
    logger.error('Movies by streaming provider error: ' + error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:id/providers', async (req, res) => {
  try {
    const data = await fetchProviders(req.params.id);
    res.json(data);
  } catch (error) {
    logger.error('Movie providers error: ' + error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
