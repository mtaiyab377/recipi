// Recipe data
const recipes = [
  {
    id: 1,
    title: "Creamy Garlic Pasta",
    time: 25,
    difficulty: "easy",
    description: "A quick and creamy pasta loaded with garlic flavor.",
    category: "pasta"
  },
  {
    id: 2,
    title: "Chicken Curry",
    time: 60,
    difficulty: "medium",
    description: "A rich and spicy chicken curry with Indian spices.",
    category: "curry"
  },
  {
    id: 3,
    title: "Avocado Salad",
    time: 15,
    difficulty: "easy",
    description: "Fresh avocado salad with lemon and olive oil.",
    category: "salad"
  },
  {
    id: 4,
    title: "Beef Stroganoff",
    time: 75,
    difficulty: "hard",
    description: "Classic beef stroganoff with mushrooms and sour cream.",
    category: "beef"
  },
  {
    id: 5,
    title: "Vegetable Stir Fry",
    time: 30,
    difficulty: "medium",
    description: "Colorful vegetables tossed in a savory stir-fry sauce.",
    category: "vegetarian"
  },
  {
    id: 6,
    title: "Margherita Pizza",
    time: 90,
    difficulty: "hard",
    description: "Traditional Italian pizza with fresh basil and mozzarella.",
    category: "pizza"
  },
  {
    id: 7,
    title: "Tomato Soup",
    time: 35,
    difficulty: "easy",
    description: "Warm and comforting tomato soup made from scratch.",
    category: "soup"
  },
  {
    id: 8,
    title: "Lamb Biryani",
    time: 120,
    difficulty: "hard",
    description: "Aromatic rice dish layered with spiced lamb.",
    category: "rice"
  }
];
// State variables
let currentFilter = 'all';
let currentSort = 'none';
// NEW: Add these
let searchQuery = '';
let favorites = JSON.parse(localStorage.getItem('recipeFavorites')) || [];
let debounceTimer;

// Select container
const recipeContainer = document.querySelector("#recipe-container");

// NEW: Select all filter and sort buttons
const filterButtons = document.querySelectorAll('.filter-btn');
const sortButtons = document.querySelectorAll('.sort-btn');

// NEW: Add these
const searchInput = document.querySelector('#search-input');
const clearSearchBtn = document.querySelector('#clear-search');
const recipeCountDisplay = document.querySelector('#recipe-count');

// Create single recipe card
const createRecipeCard = (recipe) => {
      // Check if favorited
    const isFavorited = favorites.includes(recipe.id);
    const heartIcon = isFavorited ? '❤️' : '🤍';
    return `
        <div class="recipe-card" data-id="${recipe.id}">
        <!-- NEW: Favorite Button -->
            <button class="favorite-btn ${isFavorited ? 'favorited' : ''}" 
                    data-recipe-id="${recipe.id}">
                ${heartIcon}
            </button>
            <h3>${recipe.title}</h3>
            <div class="recipe-meta">
                <span>⏱️ ${recipe.time} min</span>
                <span class="difficulty ${recipe.difficulty}">${recipe.difficulty}</span>
            </div>
            <p>${recipe.description}</p>
            
            <!-- NEW: Toggle Buttons -->
            <div class="card-actions">
                <button class="toggle-btn" data-recipe-id="${recipe.id}" data-toggle="steps">
                    📋 Show Steps
                </button>
                <button class="toggle-btn" data-recipe-id="${recipe.id}" data-toggle="ingredients">
                    🥗 Show Ingredients
                </button>
            </div>
            
            <!-- NEW: Ingredients Section (hidden by default) -->
            <div class="ingredients-container" data-recipe-id="${recipe.id}">
                <h4>Ingredients:</h4>
                <ul>
                    ${recipe.ingredients.map(ingredient => <li>${ingredient}</li>).join('')}
                </ul>
            </div>
            
            <!-- NEW: Steps Section (hidden by default) -->
            <div class="steps-container" data-recipe-id="${recipe.id}">
                <h4>Cooking Steps:</h4>
                ${createStepsHTML(recipe.steps)}
            </div>
        </div>
    `;
};

// ============================================
// PURE FILTER FUNCTIONS
// ============================================
// These functions don't modify the original array
// They return a NEW filtered array

// Filter recipes by difficulty level
const filterByDifficulty = (recipes, difficulty) => {
    return recipes.filter(recipe => recipe.difficulty === difficulty);
};

// Filter recipes by maximum cooking time
const filterByTime = (recipes, maxTime) => {
    return recipes.filter(recipe => recipe.time <= maxTime);
};

// Apply the current filter
const applyFilter = (recipes, filterType) => {
    switch(filterType) {
        case 'easy':
            return filterByDifficulty(recipes, 'easy');
        case 'medium':
            return filterByDifficulty(recipes, 'medium');
        case 'hard':
            return filterByDifficulty(recipes, 'hard');
        case 'quick':
            return filterByTime(recipes, 30);
        case 'all':
        default:
            return recipes;  // Return all recipes (no filter)
    }
};

// ============================================
// PURE FILTER FUNCTIONS
// ============================================

// NEW: Search filter
const filterBySearch = (recipes, query) => {
    if (!query || query.trim() === '') {
        return recipes;
    }
    
    const lowerQuery = query.toLowerCase().trim();
    
    return recipes.filter(recipe => {
        // Search in title
        const titleMatch = recipe.title
            .toLowerCase()
            .includes(lowerQuery);
        
        // Search in ingredients
        const ingredientMatch = recipe.ingredients.some(ingredient =>
            ingredient.toLowerCase().includes(lowerQuery)
        );
        
        // Search in description
        const descriptionMatch = recipe.description
            .toLowerCase()
            .includes(lowerQuery);
        
        return titleMatch || ingredientMatch || descriptionMatch;
    });
};
// NEW: Favorites filter
const filterFavorites = (recipes) => {
    // Return only recipes whose id exists in favorites array
    return recipes.filter(recipe => 
        favorites.includes(recipe.id)
    );
};


// ============================================
// PURE SORT FUNCTIONS
// ============================================
// sort() mutates the original array, so we create a copy first

// Sort recipes by name (A-Z)
const sortByName = (recipes) => {
    // Create a copy with spread operator, then sort
    return [...recipes].sort((a, b) => a.title.localeCompare(b.title));
};

// Sort recipes by cooking time (fastest first)
const sortByTime = (recipes) => {
    // Create a copy with spread operator, then sort
    return [...recipes].sort((a, b) => a.time - b.time);
};

// Apply the current sort
const applySort = (recipes, sortType) => {
    switch(sortType) {
        case 'name':
            return sortByName(recipes);
        case 'time':
            return sortByTime(recipes);
        case 'none':
        default:
            return recipes;  // Return as-is (no sorting)
    }
};

// Render recipes
const renderRecipes = (recipeList) => {
  const recipeHTML = recipeList
    .map(recipe => createRecipeCard(recipe))
    .join("");

  recipeContainer.innerHTML = recipeHTML;
};

// ============================================
// INITIALIZATION
// ============================================

// Set up event listeners on page load
setupEventListeners();

// Initial render with default filter/sort
updateDisplay();

console.log('Easy recipes:', filterByDifficulty(recipes, 'easy'));
console.log('Quick recipes:', filterByTime(recipes, 30));

// ============================================
// MAIN UPDATE FUNCTION
// ============================================
// This function combines filter + sort + render

const updateDisplay = () => {
    // Step 1: Start with all recipes
    let recipesToDisplay = recipes;
    
    // Step 2: Apply current filter
    recipesToDisplay = applyFilter(recipesToDisplay, currentFilter);
    
    // Step 3: Apply current sort
    recipesToDisplay = applySort(recipesToDisplay, currentSort);
    
    // Step 4: Render the filtered and sorted recipes
    renderRecipes(recipesToDisplay);
    
    // Step 5: Log for debugging
    console.log(Displaying ${recipesToDisplay.length} recipes (Filter: ${currentFilter}, Sort: ${currentSort}));
};

// ============================================
// UI HELPER FUNCTIONS
// ============================================

// Update which button looks "active"
const updateActiveButtons = () => {
    // Update filter buttons
    filterButtons.forEach(btn => {
        const filterType = btn.dataset.filter;
        if (filterType === currentFilter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Update sort buttons
    sortButtons.forEach(btn => {
        const sortType = btn.dataset.sort;
        if (sortType === currentSort) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
};

// ============================================
// EVENT HANDLERS
// ============================================

// Handle filter button clicks
const handleFilterClick = (event) => {
    const filterType = event.target.dataset.filter;
    
    // Update state
    currentFilter = filterType;
    
    // Update UI
    updateActiveButtons();
    updateDisplay();
};

// Handle sort button clicks
const handleSortClick = (event) => {
    const sortType = event.target.dataset.sort;
    
    // Update state
    currentSort = sortType;
    
    // Update UI
    updateActiveButtons();
    updateDisplay();
};

// ============================================
// EVENT LISTENER SETUP
// ============================================

const setupEventListeners = () => {
    // Attach click handlers to all filter buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', handleFilterClick);
    });
    
    // Attach click handlers to all sort buttons
    sortButtons.forEach(btn => {
        btn.addEventListener('click', handleSortClick);
    });
    
    console.log('Event listeners attached!');

};
