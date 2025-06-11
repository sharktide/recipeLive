const urlParams = new URLSearchParams(window.location.search);

async function fetchRecipeDetails() {
    try {
        // Get the recipe name from the query parameter
        const recipeName = urlParams.get('recipe');
        document.title = recipeName        
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
                recipeDiffElem.textContent = recipe.row.diff = ' 🔵'
            }

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
            recipeDetailContainer.appendChild(recipeCategoryElem);
            recipeDetailContainer.appendChild(recipeDiffElem);
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
document.getElementById('downloadBtn').addEventListener('click', function() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
        orientation: 'portrait', 
        unit: 'mm',             
        format: 'letter',             
        });
    
        doc.html(document.body, {
        margin: [10, 10, 10, 10],
        x: 10,
        y: 10,
        html2canvas: {
            scale: 0.15,
        },
        callback: function (doc) {
            doc.save(`${urlParams.get('recipe')}.pdf`);
        }
    });
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
#print-button, #downloadBtn {
    color:rgb(0, 0, 0);
    background-color: #ffffff;
    border: 4px solid #458cdd;
    border-radius: 5px;
    cursor: pointer;
    margin: 10px;
}
#print-button:hover, #downloadBtn:hover {
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
  

fetchRecipeDetails()
setbg()


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
