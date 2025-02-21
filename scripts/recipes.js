async function fetchRecipes() {
    try {
        const response = await fetch('https://datasets-server.huggingface.co/first-rows?dataset=sharktide%2Frecipes&config=default&split=train');
        const data = await response.json();
        
        const recipes = data.rows;
        const recipesContainer = document.getElementById('recipes-container');

        recipes.forEach(recipe => {
            const recipeCard = document.createElement('div');
            recipeCard.classList.add('recipe-card');
            
            const recipeName = recipe.row.name;
            const recipeLink = `/recipeviewer?recipe=${encodeURIComponent(recipeName)}`; // Recipe link with query param (encoded)

            const recipeNameElem = document.createElement('h3');
            recipeNameElem.textContent = recipeName;

            const recipeTimeElem = document.createElement('h4');
            console.log(recipe.row.time)
            recipeTimeElem.textContent = '⌚: ' + recipe.row.time + ' minutes';
            console.log(recipeTimeElem)


            const recipeCreatorElem = document.createElement('p');
            recipeCreatorElem.textContent = 'By: ' + recipe.row.creator;

            const recipeIngredients = document.createElement('p');
            recipeIngredients.textContent = 'Ingredients: ' + recipe.row.ingredients.join(', ');

            const recipeLinkElem = document.createElement('a');
            recipeLinkElem.href = recipeLink;
            recipeLinkElem.textContent = "View Recipe Details ↗";

            recipeCard.appendChild(recipeNameElem);
            recipeCard.appendChild(recipeTimeElem);
            recipeCard.appendChild(recipeCreatorElem);
            recipeCard.appendChild(recipeIngredients);
            recipeCard.appendChild(recipeLinkElem);

            recipesContainer.appendChild(recipeCard);
        });

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
    /**
     * @param {string} styleString
    */
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
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    margin-top: 20px;
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

window.onload = fetchRecipes;
setbg()
