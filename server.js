const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Mock data for collectibles (since real scraping requires handling dynamic content)
const mockCollectibleData = {
  coins: [
    {
      title: 'Rare 1943 Copper Penny',
      category: 'coins',
      currentPrice: 450,
      marketPrice: 800,
      image: '🪙',
      description: 'Original 1943 copper penny in excellent condition',
      source: 'Collectibles Marketplace',
      link: 'https://example.com/item/1943-penny'
    },
    {
      title: 'Morgan Silver Dollar 1881',
      category: 'coins',
      currentPrice: 120,
      marketPrice: 250,
      image: '🪙',
      description: 'High-grade Morgan silver dollar from 1881',
      source: 'Numismatic Exchange',
      link: 'https://example.com/item/morgan-1881'
    },
    {
      title: 'Ancient Roman Coin Collection',
      category: 'coins',
      currentPrice: 300,
      marketPrice: 600,
      image: '🪙',
      description: 'Set of 5 authentic Roman coins',
      source: 'Ancient Coins Ltd',
      link: 'https://example.com/item/roman-coins'
    }
  ],
  cards: [
    {
      title: 'Charizard Holographic Pokemon Card 1st Edition',
      category: 'cards',
      currentPrice: 800,
      marketPrice: 2000,
      image: '🎴',
      description: 'Base Set Charizard in near mint condition',
      source: 'TCG Market',
      link: 'https://example.com/item/charizard-holo'
    },
    {
      title: 'Magic The Gathering Black Lotus',
      category: 'cards',
      currentPrice: 5000,
      marketPrice: 12000,
      image: '🎴',
      description: 'Beta edition Black Lotus, lightly played',
      source: 'Card Kingdom',
      link: 'https://example.com/item/black-lotus'
    },
    {
      title: 'Yu-Gi-Oh Blue Eyes White Dragon 1st Edition',
      category: 'cards',
      currentPrice: 350,
      marketPrice: 800,
      image: '🎴',
      description: 'Rare vintage trading card',
      source: 'Card Exchange',
      link: 'https://example.com/item/blue-eyes'
    }
  ],
  'action-figures': [
    {
      title: 'Vintage Star Wars Han Solo Action Figure 1977',
      category: 'action-figures',
      currentPrice: 450,
      marketPrice: 1200,
      image: '🦸',
      description: 'Original Kenner action figure with original packaging',
      source: 'Vintage Toys Market',
      link: 'https://example.com/item/han-solo-77'
    },
    {
      title: 'Super Mario Bros Luigi Action Figure Prototype',
      category: 'action-figures',
      currentPrice: 600,
      marketPrice: 1500,
      image: '🦸',
      description: 'Rare prototype from 1989 production run',
      source: 'Nintendo Collectibles',
      link: 'https://example.com/item/luigi-proto'
    }
  ],
  memorabilia: [
    {
      title: 'Signed Beatles Album "Abbey Road"',
      category: 'memorabilia',
      currentPrice: 2000,
      marketPrice: 5000,
      image: '⭐',
      description: 'Album signed by all four members',
      source: 'Music Memorabilia Co',
      link: 'https://example.com/item/abbey-road-signed'
    },
    {
      title: 'Muhammad Ali Autographed Boxing Gloves',
      category: 'memorabilia',
      currentPrice: 1500,
      marketPrice: 3500,
      image: '⭐',
      description: 'Authentic signed boxing gloves with certificate',
      source: 'Sports Heritage',
      link: 'https://example.com/item/ali-gloves'
    }
  ],
  vintage: [
    {
      title: 'Atari 2600 Console with Original Games',
      category: 'vintage',
      currentPrice: 250,
      marketPrice: 600,
      image: '🕰️',
      description: 'Fully functional original console from 1977',
      source: 'Retro Gaming Hub',
      link: 'https://example.com/item/atari-2600'
    },
    {
      title: 'Nintendo Game Boy Original (Gray) 1989',
      category: 'vintage',
      currentPrice: 180,
      marketPrice: 400,
      image: '🕰️',
      description: 'Working condition with original packaging',
      source: 'Portable Console Collector',
      link: 'https://example.com/item/gameboy-89'
    }
  ],
  comics: [
    {
      title: 'Action Comics #1 - First Superman Appearance',
      category: 'comics',
      currentPrice: 35000,
      marketPrice: 100000,
      image: '📚',
      description: 'Facsimile edition of the historic first appearance',
      source: 'Comic Kingdom',
      link: 'https://example.com/item/action-1'
    },
    {
      title: 'Amazing Fantasy #15 - First Spider-Man',
      category: 'comics',
      currentPrice: 8000,
      marketPrice: 20000,
      image: '📚',
      description: 'Restored facsimile of the classic issue',
      source: 'Marvel Vault',
      link: 'https://example.com/item/af-15'
    }
  ],
  stamps: [
    {
      title: 'British Penny Black Stamp 1840',
      category: 'stamps',
      currentPrice: 800,
      marketPrice: 2000,
      image: '📮',
      description: 'First adhesive postage stamp ever issued',
      source: 'Philatelic Society',
      link: 'https://example.com/item/penny-black'
    },
    {
      title: 'Inverted Jenny Stamp USA 1918',
      category: 'stamps',
      currentPrice: 5000,
      marketPrice: 12000,
      image: '📮',
      description: 'Rare stamp with inverted airplane image',
      source: 'Stamp Collectors Exchange',
      link: 'https://example.com/item/jenny-inverted'
    }
  ],
  sports: [
    {
      title: 'Michael Jordan Signed Jersey 1996',
      category: 'sports',
      currentPrice: 3000,
      marketPrice: 8000,
      image: '⚽',
      description: 'Authentic Chicago Bulls jersey signed during championship season',
      source: 'Sports Memorabilia World',
      link: 'https://example.com/item/mj-jersey'
    },
    {
      title: 'Babe Ruth Autographed Baseball',
      category: 'sports',
      currentPrice: 2000,
      marketPrice: 5000,
      image: '⚽',
      description: 'Signed by the legendary baseball icon',
      source: 'Baseball Heritage',
      link: 'https://example.com/item/ruth-ball'
    }
  ]
};

// API Search Endpoint
app.get('/api/search', (req, res) => {
  try {
    const { q, category, maxPrice = 1000, discount = 20 } = req.query;

    let results = [];

    // Search by query string
    if (q) {
      const query = q.toLowerCase();
      
      // Search across all categories
      Object.values(mockCollectibleData).forEach(items => {
        items.forEach(item => {
          const matchesQuery = 
            item.title.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query);
          
          if (matchesQuery) {
            results.push(item);
          }
        });
      });
    } 
    // Search by category
    else if (category && mockCollectibleData[category]) {
      results = mockCollectibleData[category];
    }

    // Apply filters
    const maxPriceNum = parseFloat(maxPrice);
    const discountNum = parseFloat(discount);

    results = results.filter(item => {
      const itemDiscount = ((item.marketPrice - item.currentPrice) / item.marketPrice) * 100;
      return item.currentPrice <= maxPriceNum && itemDiscount >= discountNum;
    });

    if (results.length === 0) {
      return res.json({
        success: false,
        results: [],
        message: 'No deals found matching your criteria. Try adjusting your filters or search term.'
      });
    }

    res.json({
      success: true,
      results: results,
      count: results.length
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Error performing search',
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Serve the index page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🎯 Value.card server running on http://localhost:${PORT}`);
  console.log(`📍 Open http://localhost:${PORT} in your browser to get started!`);
});
