
const express = require('express');
const router = express.Router();

// Define routes here
router.get('/', (req, res) => {
  res.send('Hello from the router!');
});

module.exports = router;
