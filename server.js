const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const scrapingRoutes = require('./routes/scraper');
const searchRoutes = require('./routes/search');
const { initializeDatabase } = require('./db/database');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize database
initializeDatabase();

// Routes
app.use('/api/scrape', scrapingRoutes);
app.use('/api/search', searchRoutes);

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
