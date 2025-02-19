
// Get the recipe name from the query parameter
const urlParams = new URLSearchParams(window.location.search);

const str = urlParams.get('ingredients');
const ingredients = JSON.parse(str);

const recipeDetailContainer = document.getElementById('recipe-detail');

// Set the full recipe details
const recipeNameElem = document.createElement('h2');
recipeNameElem.textContent = urlParams.get('title');

const recipeTimeElem = document.createElement('h4');
recipeTimeElem.textContent = '⌚: ' + urlParams.get('time') + ' minutes'

const recipeCreatorElem = document.createElement('p');
recipeCreatorElem.textContent = 'By: ' + urlParams.get('name');

const ingredientsElem = document.createElement('p');
ingredientsElem.textContent = 'Ingredients: ' + ingredients.join(', ');

const descriptionElem = document.createElement('p');
descriptionElem.textContent = urlParams.get('desc');

const instructionsElem = document.createElement('p');
instructionsElem.textContent = 'Instructions: ' + urlParams.get('inst');

// Append to the container
recipeDetailContainer.appendChild(recipeNameElem);
recipeDetailContainer.appendChild(recipeTimeElem);
recipeDetailContainer.appendChild(recipeCreatorElem);
recipeDetailContainer.appendChild(ingredientsElem);
recipeDetailContainer.appendChild(descriptionElem);
recipeDetailContainer.appendChild(instructionsElem);

console.log(urlParams.get('title'));
console.log(urlParams.get('name'));
console.log(urlParams.get('time'));
console.log(ingredients);
console.log(urlParams.get('desc'));
console.log(urlParams.get('inst'));






document.getElementById('confirm').addEventListener('click', function() {

    if (urlParams.get('title') == '') {
        alert("Title field is required");
        return;
    }
    if (urlParams.get('name') == '') {
        alert("Name field is required");
        return;
    }
    if (urlParams.get('time') == '') {
        alert("Cook/Bake time field is required");
        return;
    }
    if (ingredients === undefined || urlParams.get('ingredients').length == 0) {
        alert("Ingredients field is required");
        return;
    }
    if (urlParams.get('desc') == '') {
        alert("Description field is required");
        return;
    }
    if (urlParams.get('inst') == '') {
        alert("Instructions are required");
        return;
    }

    if (!(confirm('Are you sure you would like to upload the recipe? This action cannot be undone.'))) {
        return
    }

    console.log('check')

})