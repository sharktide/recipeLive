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

        // Call the function when the page loads
        window.onload = fetchRecipeDetails;