
// Get the recipe name from the query parameter
const urlParams = new URLSearchParams(window.location.search);

const str = urlParams.get('ingredients');
const ingredients = JSON.parse(str);

const recipeDetailContainer = document.getElementById('recipe-detail');

const editurl =  `/newrecipe.html?title=${urlParams.get('title')}&time=${urlParams.get('time')}&name=${urlParams.get('name')}&ingredients=${urlParams.get('ingredients')}&desc=${urlParams.get('desc')}&inst=${urlParams.get('inst')}`

console.log(editurl)

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

    if (urlParams.get('title') == '' || urlParams.get('title') == null) {
        alert("Title field is required");
        return;
    }
    if (urlParams.get('name') == '' || urlParams.get('name') == null) {
        alert("Name field is required");
        return;
    }
    if (urlParams.get('time') == '' || urlParams.get('time') == null) {
        alert("Cook/Bake time field is required");
        return;
    }
    if (ingredients === undefined || urlParams.get('ingredients').length == 0) {
        alert("Ingredients field is required");
        return;
    }
    if (urlParams.get('desc') == '' || urlParams.get('desc') == null) {
        alert("Description field is required");
        return;
    }
    if (urlParams.get('inst') == '' || urlParams.get('inst') == null) {
        alert("Instructions are required");
        return;
    }

    if (!(confirm('Are you sure you would like to upload the recipe? This action cannot be undone.'))) {
        return
    }

    console.log('check')

    alert("Sending data. This make take a few minutes. Do not close this page or press the create button again, even if a response does not come quickly. ");
    
    console.log(urlParams.get('title'));
    console.log(urlParams.get('time'));
    console.log(urlParams.get('name'));
    console.log(ingredients);
    console.log(urlParams.get('desc'));
    console.log(urlParams.get('inst'));

    const filename = urlParams.get('title');
    const recipeData = {
        name: urlParams.get('title'),
        time: urlParams.get('time'),
        creator: urlParams.get('name'),
        ingredients: ingredients,
        description: urlParams.get('desc'),
        instructions: urlParams.get('inst')
    };




    fetch('https://sharktide-recipe-api.hf.space/add/recipe?filename=' + encodeURIComponent(filename), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(recipeData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        if (data.Status == 'Recipe added successfully.') {
            alert('Recipe Added Successfully, it may take up to 20 minutes for it to update across the site')
            window.location.href = '/';
        }
        else {
            alert(data.Status);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error: Could not save the recipe.');
        window.location.href = '/';
    });

})

document.getElementById('edit').addEventListener('click', function() {
    window.location.href = editurl;
})