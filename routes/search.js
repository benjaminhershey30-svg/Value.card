const express = require('express');
const router = express.Router();
const { getFromDatabase, addToDatabase } = require('../db/database');
const { scrapeMultipleSources } = require('../services/scraper');

// Search endpoint
router.get('/', async (req, res) => {
  try {
    const { q, category, maxPrice, discount } = req.query;
    const filters = {
      query: q,
      category,
      maxPrice: parseInt(maxPrice) || 1000,
      discount: parseInt(discount) || 20
    };

    // First, try to get cached results from database
    let results = await getFromDatabase(filters);

    // If no cache or query is specific, perform fresh scrape
    if (!results || results.length === 0 || q) {
      results = await scrapeMultipleSources(filters);
      
      // Save results to database
      if (results && results.length > 0) {
        results.forEach(item => addToDatabase(item));
      }
    }

    // Apply additional filtering
    const filtered = applyFilters(results, filters);

    res.json({
      success: true,
      message: filtered.length > 0 ? `Found ${filtered.length} deals` : 'No deals found',
      results: filtered,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching for collectibles',
      error: error.message
    });
  }
});

// Helper function to apply filters
function applyFilters(items, filters) {
  return items.filter(item => {
    const priceMatch = item.currentPrice <= filters.maxPrice;
    const discountMatch = ((item.marketPrice - item.currentPrice) / item.marketPrice) * 100 >= filters.discount;
    return priceMatch && discountMatch;
  });
}

module.exports = router;
