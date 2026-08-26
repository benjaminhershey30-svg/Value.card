const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '../value-card.db');

let db = null;

// Initialize database
function initializeDatabase() {
  db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error('Database connection error:', err);
    } else {
      console.log('Connected to SQLite database');
      createTables();
    }
  });
}

// Create tables if they don't exist
function createTables() {
  db.serialize(() => {
    // Collectibles table
    db.run(`
      CREATE TABLE IF NOT EXISTS collectibles (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        currentPrice REAL NOT NULL,
        marketPrice REAL NOT NULL,
        category TEXT,
        source TEXT,
        link TEXT,
        image TEXT,
        discovered DATETIME DEFAULT CURRENT_TIMESTAMP,
        lastUpdated DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Search history table
    db.run(`
      CREATE TABLE IF NOT EXISTS search_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        query TEXT,
        category TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        resultCount INTEGER
      )
    `);

    // Wishlist table
    db.run(`
      CREATE TABLE IF NOT EXISTS wishlist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        itemId TEXT NOT NULL,
        addedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        notes TEXT,
        FOREIGN KEY (itemId) REFERENCES collectibles(id)
      )
    `);

    console.log('Database tables created/verified');
  });
}

// Get items from database
function getFromDatabase(filters) {
  return new Promise((resolve, reject) => {
    let query = 'SELECT * FROM collectibles WHERE 1=1';
    const params = [];

    if (filters.category && filters.category !== 'all') {
      query += ' AND category = ?';
      params.push(filters.category);
    }

    if (filters.query) {
      query += ' AND (title LIKE ? OR description LIKE ?)';
      params.push(`%${filters.query}%`);
      params.push(`%${filters.query}%`);
    }

    if (filters.maxPrice) {
      query += ' AND currentPrice <= ?';
      params.push(filters.maxPrice);
    }

    query += ' ORDER BY discovered DESC LIMIT 100';

    db.all(query, params, (err, rows) => {
      if (err) {
        console.error('Database query error:', err);
        reject(err);
      } else {
        resolve(rows || []);
      }
    });
  });
}

// Add item to database
function addToDatabase(item) {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT OR REPLACE INTO collectibles 
      (id, title, description, currentPrice, marketPrice, category, source, link, image, lastUpdated)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `;

    const params = [
      item.id,
      item.title,
      item.description || '',
      item.currentPrice,
      item.marketPrice,
      item.category,
      item.source,
      item.link,
      item.image || null
    ];

    db.run(query, params, (err) => {
      if (err) {
        console.error('Database insert error:', err);
        reject(err);
      } else {
        resolve(item.id);
      }
    });
  });
}

// Add to wishlist
function addToWishlist(itemId, notes = '') {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO wishlist (itemId, notes) VALUES (?, ?)',
      [itemId, notes],
      function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
}

// Get wishlist
function getWishlist() {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT c.*, w.notes, w.addedAt FROM collectibles c 
       JOIN wishlist w ON c.id = w.itemId 
       ORDER BY w.addedAt DESC`,
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      }
    );
  });
}

// Record search
function recordSearch(query, category, resultCount) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO search_history (query, category, resultCount) VALUES (?, ?, ?)',
      [query, category, resultCount],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

// Close database
function closeDatabase() {
  if (db) {
    db.close();
  }
}

module.exports = {
  initializeDatabase,
  getFromDatabase,
  addToDatabase,
  addToWishlist,
  getWishlist,
  recordSearch,
  closeDatabase
};
