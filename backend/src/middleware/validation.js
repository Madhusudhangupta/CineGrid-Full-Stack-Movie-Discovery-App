const Joi = require('joi');
const logger = require('../utils/logger');

const validateRequest = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(
    { body: req.body, query: req.query, params: req.params },
    { abortEarly: false }
  );
  if (error) {
    logger.warn(`Validation error: ${error.message}`);
    return res.status(400).json({
      error: 'Validation Error',
      details: error.details.map((d) => d.message),
    });
  }
  req.validated = value;
  next();
};

module.exports = { validateRequest };
