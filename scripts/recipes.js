const urlParams = new URLSearchParams(window.location.search);
const diff_filter = urlParams.get('diff')
const diff_dropdown = document.getElementById('diff-dropdown')
if (diff_filter == null || diff_filter == undefined || diff_filter == 'Choose Difficulty') {
    diff_dropdown.value = 'Choose Difficulty'
}
else if (diff_filter == 'Easy') {
    diff_dropdown.value = 'Easy 🟢'
}
else if (diff_filter == 'Medium') {
    diff_dropdown.value = 'Medium 🟡'
}
else if (diff_filter == 'Hard') {
    diff_dropdown.value = 'Hard 🔴'
}
else if (diff_filter == 'Other') {
    diff_dropdown.value = 'Other 🔵'
}
async function fetchRecipes() {
    try {
        const response = await fetch('https://datasets-server.huggingface.co/first-rows?dataset=sharktide%2Frecipes&config=default&split=train');
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
        verifiedTitle.textContent = 'Recipes';
        const unverifiedTitle = document.createElement('h2');
        unverifiedTitle.textContent = 'Blacklisted Recipes';
        
        verifiedContainer.appendChild(verifiedTitle);
        unverifiedContainer.appendChild(unverifiedTitle);
        
        recipes.forEach(recipe => {
            const recipeCard = document.createElement('div');
            recipeCard.classList.add('recipe-card');
            if (diff_filter == null || diff_filter == undefined) {
                console.log(diff_filter);
            }
            else if ((diff_filter == 'Easy') && (!(recipe.row.diff == 'Easy'))) {
                return
            }
            else if ((diff_filter == 'Medium') && (!(recipe.row.diff == 'Medium'))) {
                return
            }
            else if ((diff_filter == 'Hard') && (!(recipe.row.diff == 'Hard'))) {
                return
            }
            else if ((diff_filter == 'Other') && (!(recipe.row.diff == 'Other'))) {
                return
            }
            const recipeName = recipe.row.name;
            const recipeLink = `/recipeviewer?recipe=${encodeURIComponent(recipeName)}`;
            
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
            
            recipeCard.appendChild(recipeNameElem);
            recipeCard.appendChild(recipeTimeElem);
            recipeCard.appendChild(recipeCreatorElem);
            recipeCard.appendChild(recipeCategoryElem);
            recipeCard.appendChild(recipeDiffElem);

            recipeCard.appendChild(recipeIngredients);
            recipeCard.appendChild(recipeLinkElem);
            
            if (blacklist.includes(recipeName)) {
            unverifiedContainer.appendChild(recipeCard);
            } else {
            verifiedContainer.appendChild(recipeCard);
            }
        });
    
        recipesContainer.appendChild(verifiedContainer);
        recipesContainer.appendChild(unverifiedContainer);
    
        // Add search functionality
        document.getElementById('search-recipes').addEventListener('input', function() {
            const query = this.value.toLowerCase();
            const recipeCards = document.querySelectorAll('.recipe-card');
            recipeCards.forEach(card => {
            const recipeName = card.querySelector('h3').textContent.toLowerCase();
            const recipeIngredients = card.querySelector('p').textContent.toLowerCase();
            if (recipeName.includes(query) || recipeIngredients.includes(query)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
            });
        });
    
        } catch (error) {
        console.error('Error fetching recipes:', error);
        }
    }
  
  
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
    `);
}
diff_dropdown.addEventListener('change', function() {
    let currentDiffValue = ''
    if (diff_dropdown.value == 'Choose Difficulty') {
        currentDiffValue = 'Choose Difficulty'
    }
    else if (diff_dropdown.value == 'Easy 🟢') {
        currentDiffValue = 'Easy'
    }
    else if (diff_dropdown.value == 'Medium 🟡') {
        currentDiffValue = 'Medium'
    }
    else if (diff_dropdown.value == 'Hard 🔴') {
        currentDiffValue = 'Hard'
    }
    else if (diff_dropdown.value == 'Other 🔵') {
        currentDiffValue = 'Other'
    }
    window.location.href = `/recipes?diff=${currentDiffValue}`
})  
window.onload = fetchRecipes;
setbg();


// Copyright 2025 Rihaan Meher

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
