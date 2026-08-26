const express = require('express');
const router = express.Router();
const { scrapeMultipleSources } = require('../services/scraper');

// Manual scrape trigger
router.post('/start', async (req, res) => {
  try {
    const { category } = req.body;
    
    res.json({
      success: true,
      message: 'Scraping started in background',
      taskId: Date.now()
    });

    // Run scraping in background (don't wait for response)
    scrapeMultipleSources({ category }).catch(err => {
      console.error('Background scraping error:', err);
    });

  } catch (error) {
    console.error('Scrape error:', error);
    res.status(500).json({
      success: false,
      message: 'Error starting scraper',
      error: error.message
    });
  }
});

// Get scraper status
router.get('/status', (req, res) => {
  res.json({
    success: true,
    status: 'active',
    lastScan: new Date(),
    message: 'Scraper is actively monitoring for deals'
  });
});

module.exports = router;
