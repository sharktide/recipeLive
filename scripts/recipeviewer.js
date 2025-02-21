async function fetchRecipeDetails() {
    try {
        // Get the recipe name from the query parameter
        const urlParams = new URLSearchParams(window.location.search);
        const recipeName = urlParams.get('recipe');
        
        // Fetch recipe data
        const response = await fetch('https://datasets-server.huggingface.co/first-rows?dataset=sharktide%2Frecipes&config=default&split=train');
        const data = await response.json();
        
        const recipe = data.rows.find(r => r.row.name.toLowerCase() === recipeName.toLowerCase());

        if (recipe) {
            const recipeDetailContainer = document.getElementById('recipe-detail');
            
            // Set the full recipe details
            const recipeNameElem = document.createElement('h2');
            recipeNameElem.textContent = recipe.row.name;

            const recipeTimeElem = document.createElement('h4');
            recipeTimeElem.textContent = '⌚: ' + recipe.row.time + ' minutes'

            const recipeCreatorElem = document.createElement('p');
            recipeCreatorElem.textContent = 'By: ' + recipe.row.creator;

            const ingredientsElem = document.createElement('p');
            ingredientsElem.textContent = 'Ingredients: ' + recipe.row.ingredients.join(', ');

            const descriptionElem = document.createElement('p');
            descriptionElem.textContent = recipe.row.description;

            const instructionsElem = document.createElement('p');
            instructionsElem.textContent = 'Instructions: ' + recipe.row.instructions;

            // Append to the container
            recipeDetailContainer.appendChild(recipeNameElem);
            recipeDetailContainer.appendChild(recipeTimeElem);
            recipeDetailContainer.appendChild(recipeCreatorElem);
            recipeDetailContainer.appendChild(ingredientsElem);
            recipeDetailContainer.appendChild(descriptionElem);
            recipeDetailContainer.appendChild(instructionsElem);
        } else {
            // Handle case if recipe not found
            document.getElementById('recipe-detail').textContent = "Recipe not found!";
        }

    } catch (error) {
        console.error('Error fetching recipe details:', error);
    }
}
document.getElementById('print-button').addEventListener('click', function() {
    document.getElementById('print-button').style.display = 'none';
    document.getElementById('recipetexthi').style.display = 'none';
    document.getElementById('nav').style.display = 'none';


    window.print();
    document.getElementById('print-button').style.display = 'block';
    document.getElementById('recipetexthi').style.display = 'block';
    document.getElementById('nav').style.display = 'block';
    window.location.reload()


});

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
#print-button {
    color:rgb(0, 0, 0);
    background-color: #ffffff;
    border: 4px solid #458cdd;
    border-radius: 5px;
    cursor: pointer;
    margin: 10px;
}
#print-button:hover {
    background-color: lightgray;
} 

.cta-buttons {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
}

.cta-button {
    display: inline-block;
    padding: 15px 30px;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    text-decoration: none;
    background-color: #007bff;
    color: white;
    border-radius: 5px;
    transition: all 0.3s ease;
}

.cta-button:hover {
    background-color: #0056b3;
    transform: translateY(-3px);
}

.cta-button:active {
    background-color: #004085;
    transform: translateY(1px);
}
`);
}
  

// Call the function when the page loads
window.onload = fetchRecipeDetails;
setbg()