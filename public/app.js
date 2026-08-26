// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const categoryBtns = document.querySelectorAll('.category-btn');
const applyFiltersBtn = document.getElementById('applyFilters');
const resultsContainer = document.getElementById('results');
const noResultsMsg = document.getElementById('noResults');
const loadingSpinner = document.getElementById('loadingSpinner');
const maxPriceInput = document.getElementById('maxPrice');
const discountThresholdInput = document.getElementById('discountThreshold');

let currentCategory = null;
let currentSearch = null;
let allResults = [];

// Event Listeners
searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleSearch();
});

categoryBtns.forEach(btn => {
  btn.addEventListener('click', handleCategoryClick);
});

applyFiltersBtn.addEventListener('click', handleFilterApply);

// Handle Search
async function handleSearch() {
  const query = searchInput.value.trim();
  if (!query) {
    alert('Please enter a search term');
    return;
  }
  
  currentSearch = query;
  currentCategory = null;
  clearActiveCategory();
  await fetchResults(query);
}

// Handle Category Click
async function handleCategoryClick(e) {
  const category = e.target.dataset.category;
  
  // Toggle category selection
  if (currentCategory === category) {
    currentCategory = null;
    e.target.classList.remove('active');
  } else {
    clearActiveCategory();
    currentCategory = category;
    e.target.classList.add('active');
  }
  
  if (currentCategory) {
    currentSearch = null;
    searchInput.value = '';
    await fetchResults(null, currentCategory);
  } else {
    resultsContainer.innerHTML = '';
    noResultsMsg.classList.remove('hidden');
  }
}

// Clear Active Category
function clearActiveCategory() {
  categoryBtns.forEach(btn => btn.classList.remove('active'));
}

// Fetch Results from Backend
async function fetchResults(searchQuery, category) {
  showLoading(true);
  resultsContainer.innerHTML = '';
  noResultsMsg.classList.add('hidden');
  
  try {
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    if (category) params.append('category', category);
    params.append('maxPrice', maxPriceInput.value || 1000);
    params.append('discount', discountThresholdInput.value || 20);
    
    const response = await fetch(`/api/search?${params.toString()}`);
    const data = await response.json();
    
    if (data.success && data.results.length > 0) {
      allResults = data.results;
      displayResults(data.results);
    } else {
      noResultsMsg.classList.remove('hidden');
      noResultsMsg.textContent = data.message || 'No deals found. Try adjusting your filters or search term.';
    }
  } catch (error) {
    console.error('Error fetching results:', error);
    noResultsMsg.textContent = 'Error fetching results. Please try again.';
    noResultsMsg.classList.remove('hidden');
  } finally {
    showLoading(false);
  }
}

// Display Results
function displayResults(results) {
  resultsContainer.innerHTML = '';
  
  results.forEach(item => {
    const card = document.createElement('div');
    card.className = 'item-card';
    
    const discountPercent = Math.round(((item.marketPrice - item.currentPrice) / item.marketPrice) * 100);
    
    card.innerHTML = `
      <div class="item-image">
        ${item.image ? `<img src="${item.image}" alt="${item.title}" onerror="this.src='🏷️'">` : '🏷️'}
      </div>
      <div class="item-content">
        <span class="item-category">${item.category || 'Collectible'}</span>
        <h3 class="item-title">${escapeHtml(item.title)}</h3>
        <p class="item-description">${escapeHtml(item.description || '')}</p>
        
        <div class="price-section">
          <div>
            <div class="current-price">$${item.currentPrice.toFixed(2)}</div>
            <div class="market-price">Market: $${item.marketPrice.toFixed(2)}</div>
          </div>
          <div class="discount-badge">${discountPercent}% OFF</div>
        </div>
        
        <div class="item-source">
          <strong>Source:</strong> ${escapeHtml(item.source)}
        </div>
        
        <a href="${item.link}" target="_blank" class="item-link">View Deal</a>
      </div>
    `;
    
    resultsContainer.appendChild(card);
  });
}

// Handle Filter Apply
function handleFilterApply() {
  if (currentSearch) {
    fetchResults(currentSearch);
  } else if (currentCategory) {
    fetchResults(null, currentCategory);
  } else {
    alert('Please search for something or select a category first');
  }
}

// Show/Hide Loading Spinner
function showLoading(show) {
  if (show) {
    loadingSpinner.classList.remove('hidden');
  } else {
    loadingSpinner.classList.add('hidden');
  }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Initialize - Show message on load
window.addEventListener('load', () => {
  noResultsMsg.textContent = 'Select a category or search for collectibles to get started!';
  noResultsMsg.classList.remove('hidden');
});
