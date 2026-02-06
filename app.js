/ Recipe data
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

// Select container
const recipeContainer = document.querySelector("#recipe-container");

// Create single recipe card
const createRecipeCard = (recipe) => {
  return `
    <div class="recipe-card" data-id="${recipe.id}">
      <h3>${recipe.title}</h3>
      <div class="recipe-meta">
        <span>⏱️ ${recipe.time} min</span>
        <span class="difficulty ${recipe.difficulty}">
          ${recipe.difficulty}
        </span>
      </div>
      <p>${recipe.description}</p>
    </div>
  `;
};

// Render recipes
const renderRecipes = (recipeList) => {
  const recipeHTML = recipeList
    .map(recipe => createRecipeCard(recipe))
    .join("");

  recipeContainer.innerHTML = recipeHTML;
};

// Initialize app
renderRecipes(recipes);
