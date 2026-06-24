const express = require('express');
const { fetchTvById } = require('../utils/api');

const router = express.Router();

router.get('/:id', async (req, res) => {
  try {
    const tv = await fetchTvById(req.params.id);
    res.json(tv);
  } catch (error) {
    console.error('Failed to fetch TV show', { error, id: req.params.id });
    res.status(500).json({ error: 'Failed to fetch TV show' });
  }
});

module.exports = router;
