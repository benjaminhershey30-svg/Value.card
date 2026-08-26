![Value.card Logo](https://img.shields.io/badge/Value-card-667eea?style=for-the-badge)

# Value.card - Collectibles Deal Finder

**Find collectible items priced below their market value with Value.card!**

A web application that continuously scans multiple marketplaces to identify collectibles—coins, trading cards, action figures, memorabilia, and more—that are priced below their market value.

## Features

✨ **Core Functionality**
- 🔍 Real-time web scraping across multiple marketplaces
- 📊 Automatic market value comparison
- 🎯 Pre-set category filters (Coins, Cards, Action Figures, Memorabilia, etc.)
- 🎁 Custom search functionality
- 💰 Price filtering and discount threshold settings
- 📱 Fully responsive design

🚀 **User Experience**
- Clean, modern UI with gradient design
- Instant search results
- Deal cards showing current price, market value, and discount %
- Direct links to purchase deals
- Loading indicators for long-running searches
- Mobile-friendly layout

🗄️ **Backend**
- Express.js server
- SQLite database for caching results
- Mock scraper service (ready for real API integration)
- RESTful API endpoints
- Search history tracking

## Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend:** Node.js, Express.js
- **Database:** SQLite3
- **Scraping:** Axios, Cheerio
- **Development:** Nodemon

## Installation

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Setup

1. **Clone the repository:**
```bash
cd Value.card
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create environment file:**
```bash
cp .env.example .env
```

4. **Start the server:**
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

5. **Open in browser:**
```
http://localhost:5000
```

## Usage

### Basic Search
1. Enter a search term in the search bar (e.g., "Pokemon card", "rare coin")
2. Click "Search" or press Enter
3. Browse the results showing deals below market value

### Browse by Category
1. Click any category button (Coins, Cards, Action Figures, etc.)
2. Adjust max price and discount threshold as needed
3. Click "Apply Filters" to refresh results

### Filter Options
- **Max Price:** Set the maximum price you're willing to pay
- **Discount %:** Only show items with at least this discount percentage

## Project Structure

```
Value.card/
├── public/
│   ├── index.html           # Main HTML page
│   ├── styles.css           # Styling
│   └── app.js               # Frontend logic
├── routes/
│   ├── search.js            # Search API endpoint
│   └── scraper.js           # Scraper control endpoint
├── services/
│   └── scraper.js           # Web scraping logic
├── db/
│   └── database.js          # Database setup & queries
├── server.js                # Express server
├── package.json             # Dependencies
├── .env.example             # Environment template
└── README.md                # This file
```

## API Endpoints

### Search
**GET** `/api/search`
- Query parameters:
  - `q` - Search query (e.g., "Pokemon card")
  - `category` - Category filter (coins, cards, action-figures, etc.)
  - `maxPrice` - Maximum price filter
  - `discount` - Minimum discount percentage

**Response:**
```json
{
  "success": true,
  "message": "Found 12 deals",
  "results": [
    {
      "id": "item-123",
      "title": "Rare Pokemon Card",
      "currentPrice": 45.99,
      "marketPrice": 89.99,
      "category": "cards",
      "source": "eBay",
      "link": "https://...",
      "image": "https://...",
      "discovered": "2026-08-26T10:30:00Z"
    }
  ]
}
```

### Health Check
**GET** `/api/health`

### Scraper Status
**GET** `/api/scrape/status`

## Categories Supported

- 🪙 **Coins** - Rare coins, collectible coins, numismatics
- 🎴 **Trading Cards** - Pokemon, Magic, Baseball cards, etc.
- 🦸 **Action Figures** - Collectible figures, statues, toys
- ⭐ **Memorabilia** - Signed items, concert posters, celebrity goods
- 🕰️ **Vintage Items** - Antiques, retro products, classic pieces
- 📚 **Comics** - Comic books, graphic novels, rare editions
- 📮 **Stamps** - Rare stamps, commemorative stamps
- ⚽ **Sports Memorabilia** - Sports cards, signed jerseys, game-used items

## Future Enhancements

- [ ] Real API integrations with eBay, Amazon, Mercari, Poshmark
- [ ] User accounts and wishlist persistence
- [ ] Email alerts for new deals
- [ ] Advanced filtering (condition, grading, seller rating)
- [ ] Price history charts
- [ ] Mobile app
- [ ] Admin dashboard with scraper statistics
- [ ] Machine learning for better deal detection
- [ ] Integration with marketplace APIs for real-time data

## Real-World Scraping Implementation

Currently, the scraper uses mock data for demonstration. To implement real scraping:

1. **eBay API:** Use the eBay Finding API for search results
2. **Amazon:** Use Amazon Product Advertising API
3. **Mercari:** Implement web scraping with Puppeteer for dynamic content
4. **Custom Marketplaces:** Scrape individual marketplace HTML

## Important Legal Notes

⚠️ **Web Scraping Compliance:**
- Always check marketplace Terms of Service before scraping
- Respect `robots.txt` and rate limits
- Consider using official APIs when available
- Add appropriate delays between requests
- Identify your bot in User-Agent headers
- Handle legal liability appropriately

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - Feel free to use this project for personal or commercial purposes.

## Support

For issues, questions, or suggestions:
- Open a GitHub issue
- Check existing documentation
- Review the code comments

---

**Made with ❤️ for collectibles enthusiasts**
