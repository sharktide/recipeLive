import { getPaginationParams, setupPaginationControls, hidebtns } from './helper/pagination.js';

const urlParams = new URLSearchParams(window.location.search);
const diff_filter = urlParams.get('diff');
const category_filter = urlParams.get('category');
const time_filter = urlParams.get('time');
const favorite_filter = urlParams.get('favorites')
const diff_dropdown = document.getElementById('diff-dropdown');
const category_dropdown = document.getElementById('category-dropdown');
const time_dropdown = document.getElementById('time-dropdown');
const favorite_dropdown = document.getElementById('favorite-dropdown')
const se = document.getElementById('search-recipes')

async function doFetch(offset, limit) {
    const q = urlParams.get('search')
    if (q) {
        const z = await fetch(`https://sharktide-recipe2.hf.space/supabase/recipes/paged?offset=${offset}&limit=${limit}&search=${q}`);
        return z
    } else {
        alert('Could Not Find Search Query')
    }
}

async function fetchRecipes() {
    try {
        const { offset, limit } = getPaginationParams(urlParams);
        const response = await doFetch(offset, limit)
        if (response === "nr") {
            return 0
        }
        const data = await response.json();
        const recipes = data.rows;

        const blacklistResponse = await fetch('data/approved.json');
        const blacklistData = await blacklistResponse.json();
        const blacklist = blacklistData.badRecipes;

        const recipesContainer = document.getElementById('recipes-container');
        
        const verifiedContainer = document.createElement('div');
        const unverifiedContainer = document.createElement('div');
        
        verifiedContainer.id = 'verified-recipes';
        unverifiedContainer.id = 'unverified-recipes';
        
        const verifiedTitle = document.createElement('h2');
        verifiedTitle.textContent = 'Search Results';
        const unverifiedTitle = document.createElement('h2');
        unverifiedTitle.textContent = 'Blacklisted Search Results';
        
        verifiedContainer.appendChild(verifiedTitle);
        unverifiedContainer.appendChild(unverifiedTitle);

        switch (urlParams.get('diff')) {
            case 'Easy':
                diff_dropdown.value = 'Easy 🟢'
                break
            case 'Medium':
                diff_dropdown.value = 'Medium 🟡'
                break
            case 'Hard':
                diff_dropdown.value = 'Hard 🔴'
                break
            case 'Other': 
                diff_dropdown.value = 'Other 🔵'
                break
            default:
                diff_dropdown.value = 'Choose Difficulty'
                break
        }
        switch (urlParams.get('category')) {
            case null:
                category_dropdown.value = 'Select Category'
                break
            default:
                category_dropdown.value = urlParams.get('category')
                break
        }
        switch (urlParams.get('time')) {
            case null:
                time_dropdown.value = 'Select Time'
                break
            default:
                time_dropdown.value = urlParams.get('time')
                break
        }
        switch (urlParams.get('favorites')) {
            case null:
                favorite_dropdown.value = 'All ☆'
                break
            default:
                favorite_dropdown.value = urlParams.get('favorites')
                break
        }

        // Get favorited recipes from localStorage
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

        recipes.forEach(recipe => {
            const recipeName = recipe.row.name;
            const recipeId = recipe.row.id
            // Apply category filter
            if (category_filter && category_filter !== 'Select Category' && recipe.row.category !== category_filter) {
                return;
            }

            // Apply time filter
            if (time_filter) {
                const time = recipe.row.time;
                if (time_filter == '< 5 minutes' && time >= 5) return;
                else if (time_filter == '5 - 10 minutes' && (time < 5 || time > 10)) return;
                else if (time_filter == '10 - 15 minutes' && (time < 10 || time > 15)) return;
                else if (time_filter == '15 - 20 minutes' && (time < 15 || time > 20)) return;
                else if (time_filter == '20 - 25 minutes' && (time < 20 || time > 25)) return;
                else if (time_filter == '> 25 minutes' && time <= 25) return;
            }
            if (favorite_filter) {
                if (favorite_filter == 'Unfavorited Only ☆') {
                    if (favorites.includes(recipeName)) return;
                }
                else if (favorite_filter == 'Favorites Only ⭐') {
                    if (!(favorites.includes(recipeName))) return;
                }
            }

            const recipeCard = document.createElement('div');
            recipeCard.classList.add('recipe-card');

            if (diff_filter == null || diff_filter == undefined) {
                console.log(diff_filter);
            }
            else if ((diff_filter == 'Easy') && (!(recipe.row.diff == 'Easy'))) {
                return;
            }
            else if ((diff_filter == 'Medium') && (!(recipe.row.diff == 'Medium'))) {
                return;
            }
            else if ((diff_filter == 'Hard') && (!(recipe.row.diff == 'Hard'))) {
                return;
            }
            else if ((diff_filter == 'Other') && (!(recipe.row.diff == 'Other'))) {
                return;
            }

            const recipeLink = `/recipeviewer?recipe=${encodeURIComponent(recipeId)}`;
            
            const recipeNameElem = document.createElement('h3');
            recipeNameElem.textContent = recipeName;
            
            const recipeTimeElem = document.createElement('h4');
            recipeTimeElem.textContent = '⌚: ' + recipe.row.time + ' minutes';
            
            const recipeCreatorElem = document.createElement('p');
            recipeCreatorElem.textContent = 'By: ' + recipe.row.creator;

            const recipeCategoryElem = document.createElement('p');
            recipeCategoryElem.textContent = recipe.row.category;

            const recipeDiffElem = document.createElement('p');

            if (recipe.row.diff == 'Easy') {
                recipeDiffElem.textContent = recipe.row.diff + ' 🟢';
            }
            else if (recipe.row.diff == 'Medium') {
                recipeDiffElem.textContent = recipe.row.diff + ' 🟡';
            }
            else if (recipe.row.diff == 'Hard') {
                recipeDiffElem.textContent = recipe.row.diff + ' 🔴'
            }
            else {
                recipeDiffElem.textContent = 'Other 🔵'
            }
            
            const recipeIngredients = document.createElement('p');
            recipeIngredients.textContent = 'Ingredients: ' + recipe.row.ingredients.join(', ');
            
            const recipeLinkElem = document.createElement('a');
            recipeLinkElem.href = recipeLink;
            recipeLinkElem.textContent = "View Recipe Details ↗";
            // Create the favorite button// Create the favorite button
            const favoriteButton = document.createElement('button');
            favoriteButton.textContent = 'Favorite';
            favoriteButton.classList.add('favorite-button');
            favoriteButton.classList.add('cta-button');

            // Check if recipe is already favorited
            if (favorites.includes(recipeName)) {
                favoriteButton.textContent = 'Unfavorite';
                favoriteButton.classList.add('unfavorited');  // Add unfavorited class if the recipe is favorited
                favoriteButton.disabled = false;  // Enable the button to allow unfavoriting
            }

            // Add event listener to the favorite button
            favoriteButton.addEventListener('click', () => {
                if (favorites.includes(recipeName)) {
                    // Remove from favorites (unfavorite)
                    favorites = favorites.filter(favorite => favorite !== recipeName);
                    favoriteButton.textContent = 'Favorite';  // Change button text to 'Favorite'
                    favoriteButton.classList.remove('unfavorited');  // Remove the unfavorited class
                } else {
                    // Add to favorites
                    favorites.push(recipeName);
                    favoriteButton.textContent = 'Unfavorite';  // Change button text to 'Unfavorite'
                    favoriteButton.classList.add('unfavorited');  // Add the unfavorited class
                }
                // Save the updated favorites list to localStorage
                localStorage.setItem('favorites', JSON.stringify(favorites));
                // Update the button's disabled state
                favoriteButton.disabled = false;  // Re-enable the button
            });
            
            recipeCard.appendChild(recipeNameElem);
            recipeCard.appendChild(recipeTimeElem);
            recipeCard.appendChild(recipeCreatorElem);
            recipeCard.appendChild(recipeCategoryElem);
            recipeCard.appendChild(recipeDiffElem);
            recipeCard.appendChild(recipeIngredients);
            recipeCard.appendChild(recipeLinkElem);
            recipeCard.appendChild(favoriteButton);  // Append the favorite button
            
            if (blacklist.includes(recipeName)) {
                unverifiedContainer.appendChild(recipeCard);
            } else {
                verifiedContainer.appendChild(recipeCard);
            }
        });

        recipesContainer.appendChild(verifiedContainer);
        recipesContainer.appendChild(unverifiedContainer);

        setupPaginationControls({ offset, limit, totalCount: data.total_count });

    } catch (error) {
        console.error('Error fetching recipes:', error);
        alert(`Error Fetching Recipes: ${error}`)
    } finally {
        // Hide the loading spinner and reveal inputs
        document.getElementById("loading-spinner").style.display = "none";
        document.getElementById("make").style.display = "block";
    }
}

// Function to set background and other styling remains the same
function setbg() {
    /** * @param {string} styleString */
    const addStyle = (() => {
        const style = document.createElement('style');
        document.head.append(style);
        return (styleString) => style.textContent = styleString;
    })();

    addStyle(` 
    .center { 
      margin: auto; 
      width: 100%; 
      height: 200%; 
      padding: 10px; 
      text-align: center; 
      align-items: center; 
      background-image: url(images/recipe-bg.png); 
      background-repeat: no-repeat; 
      background-size: cover; 
      box-shadow: 5px 5px lightgray; 
    } 
    #recipes-container { 
      font-family: "Montserrat", sans-serif; 
      display: flex; 
      flex-direction: column; 
      gap: 40px; 
      margin-top: 20px; 
    } 
    #verified-recipes, #unverified-recipes { 
      display: grid; 
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); 
      gap: 20px; 
    } 
    #verified-recipes h2, #unverified-recipes h2 { 
      grid-column: 1 / -1; 
      text-align: center; 
    } 
    .recipe-card { 
      background-color: #ffffff; 
      border: 1px solid #ddd; 
      border-radius: 8px; 
      padding: 20px; 
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
    } 
    .recipe-card h3 { 
      font-size: 1.5rem; 
      margin-bottom: 10px; 
    } 
    .recipe-card p { 
      font-size: 1rem; 
      margin-bottom: 10px; 
    } 
    .recipe-card p:first-child { 
      font-weight: bold; 
    } 
    .favorite-button { 
      background-color: #ffcc00; 
      border: none; 
      padding: 10px 15px; 
      font-size: 14px; 
      cursor: pointer; 
      border-radius: 5px; 
      margin-top: 10px; 
      transition: all 0.3s ease;
      filter: brightness(1.0);
    }
    .favorite-button:hover {
      filter: brightness(0.8);
    } 
    .favorite-button:disabled { 
      background-color: #ccc; 
      cursor: not-allowed; 
    }
    .favorite-button {
    background-color: #ffcc00;
    }

    .favorite-button.unfavorited {
        background-color:rgb(119, 168, 219); /* Red color for unfavoriting */
    }
    .cta-button:hover {
        transform: translateY(-3px);
    }

    .cta-button:active {
        transform: translateY(1px);
    }

    `);
}

diff_dropdown.addEventListener('change', function() {
    let currentDiffValue = '';
    if (diff_dropdown.value == 'Choose Difficulty') {
        currentDiffValue = 'Choose Difficulty';
    }
    else if (diff_dropdown.value == 'Easy 🟢') {
        currentDiffValue = 'Easy';
    }
    else if (diff_dropdown.value == 'Medium 🟡') {
        currentDiffValue = 'Medium';
    }
    else if (diff_dropdown.value == 'Hard 🔴') {
        currentDiffValue = 'Hard';
    }
    else if (diff_dropdown.value == 'Other 🔵') {
        currentDiffValue = 'Other';
    }
    window.location.href = `/search?diff=${currentDiffValue}&category=${category_dropdown.value}&time=${time_dropdown.value}&favorites=${favorite_dropdown.value}&search=${se.value}`; 
});

category_dropdown.addEventListener('change', function() {
    window.location.href = `/search?diff=${diff_filter || 'Choose Difficulty'}&category=${category_dropdown.value}&time=${time_dropdown.value}&favorites=${favorite_dropdown.value}&search=${se.value}`;
});

time_dropdown.addEventListener('change', function() {
    window.location.href = `/search?diff=${diff_filter || 'Choose Difficulty'}&category=${category_dropdown.value}&time=${time_dropdown.value}&favorites=${favorite_dropdown.value}&search=${se.value}`;
});

favorite_dropdown.addEventListener('change', function() {
    window.location.href = `/search?diff=${diff_filter || 'Choose Difficulty'}&category=${category_dropdown.value}&time=${time_dropdown.value}&favorites=${favorite_dropdown.value}&search=${se.value}`;
})

document.getElementById('searchbutton').addEventListener('click', function() {
    window.location.href = window.location.href = `/search?diff=${diff_filter || 'Choose Difficulty'}&category=${category_dropdown.value}&time=${time_dropdown.value}&favorites=${favorite_dropdown.value}&search=${se.value}`
})
setbg();

if (urlParams.get('search')) {
    se.value = urlParams.get('search')
    fetchRecipes()
} else {
    document.getElementById("loading-spinner").style.display = "none";
    hidebtns()
    document.getElementById("make").style.display = "block";
}