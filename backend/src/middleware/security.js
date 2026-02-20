const helmet = require('helmet');

const optional = (name) => {
  try {
    return require(name);
  } catch {
    return null;
  }
};

const mongoSanitize = optional('express-mongo-sanitize');
const xss = optional('xss-clean');
const hpp = optional('hpp');

const applySecurityMiddleware = (app) => {
  app.use(helmet());
  if (mongoSanitize) app.use(mongoSanitize());
  if (xss) app.use(xss());
  if (hpp) {
    app.use(hpp({
      whitelist: ['page', 'limit', 'sort', 'genre', 'year']
    }));
  }

  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });
};

module.exports = { applySecurityMiddleware };
