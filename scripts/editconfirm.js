sb.auth.getUser()
.then(result => {
    if (result.data && result.data.user) {
        void 0
    } else {
        window.location.href="/auth"
    }
});

// Get the recipe name from the query parameter
const urlParams = new URLSearchParams(window.location.search);

const str = urlParams.get('ingredients');
const ingredients = JSON.parse(str);

const recipeDetailContainer = document.getElementById('recipe-detail');

const editurl =  `/edit?id=${urlParams.get('id')}&title=${urlParams.get('title')}&time=${urlParams.get('time')}&name=${urlParams.get('name')}&category=${urlParams.get('category')}&diff=${urlParams.get('diff')}&ingredients=${urlParams.get('ingredients')}&desc=${urlParams.get('desc')}&inst=${urlParams.get('inst')}`

console.log(editurl)

// Set the full recipe details
const recipeNameElem = document.createElement('h2');
recipeNameElem.textContent = urlParams.get('title');

const recipeTimeElem = document.createElement('h4');
recipeTimeElem.textContent = '⌚: ' + urlParams.get('time') + ' minutes'

const recipeCreatorElem = document.createElement('p');
recipeCreatorElem.textContent = 'By: ' + urlParams.get('name');

const recipeCategoryElem = document.createElement('p');
recipeCategoryElem.textContent = urlParams.get('category')

const recipeDiffElem = document.createElement('p');
recipeDiffElem.textContent = urlParams.get('diff')

const ingredientsElem = document.createElement('p');
ingredientsElem.textContent = 'Ingredients: ' + ingredients.join(', ');

const descriptionElem = document.createElement('p');
descriptionElem.setAttribute('style', 'white-space: pre-wrap;')
const descriptionText = urlParams.get('desc') || ""
descriptionElem.textContent = descriptionText.replace(/\\r\\n|\\n/g, '\r\n');

const instructionsElem = document.createElement('p');
instructionsElem.setAttribute('style', 'white-space: pre-wrap;');
const instructionsText = urlParams.get('inst') || "";
instructionsElem.textContent = instructionsText.replace(/\\r\\n|\\n/g, '\r\n');

// Append to the container
recipeDetailContainer.appendChild(recipeNameElem);
recipeDetailContainer.appendChild(recipeTimeElem);
recipeDetailContainer.appendChild(recipeCreatorElem);
recipeDetailContainer.appendChild(recipeCategoryElem);
recipeDetailContainer.appendChild(recipeDiffElem);
recipeDetailContainer.appendChild(ingredientsElem);
recipeDetailContainer.appendChild(descriptionElem);
recipeDetailContainer.appendChild(instructionsElem);

console.log(urlParams.get('title'));
console.log(urlParams.get('name'));
console.log(urlParams.get('time'));
console.log(urlParams.get('category'));
console.log(urlParams.get('diff'));
console.log(ingredients);
console.log(urlParams.get('desc'));
console.log(urlParams.get('inst'));





document.getElementById('confirm').addEventListener('click', function () {
    const id = urlParams.get('id');

    if (!id) {
        alert("Missing recipe ID.");
        return;
    }

    if (!urlParams.get('title') || !urlParams.get('name') || !urlParams.get('time') ||
        !urlParams.get('category') || !urlParams.get('diff') || !urlParams.get('desc') ||
        !urlParams.get('inst') || !ingredients || ingredients.length === 0) {
        alert("All fields are required.");
        return;
    }

    sb.auth.getUser().then(result => {
        const userId = result.data?.user?.id;
        if (!userId) {
            alert("User not authenticated.");
            return;
        }

        if (!confirm('Are you sure you want to update this recipe? This action cannot be undone.')) {
            return;
        }

        alert("Sending data. Please do not refresh or navigate away...");

        const recipeData = {
            name: urlParams.get('title'),
            time: urlParams.get('time'),
            creator: urlParams.get('name'),
            category: urlParams.get('category'),
            diff: urlParams.get('diff'),
            ingredients,
            description: urlParams.get('desc'),
            instructions: urlParams.get('inst'),
            user_id: userId
        };

        fetch(`https://sharktide-recipe2.hf.space/supabase/edit/recipe?id=${id}`, {
            method: 'PATCH', // or 'PATCH' if you're doing partial updates
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(recipeData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            if (data.message?.toLowerCase().includes('success')) {
                alert('Recipe updated successfully! It may take up to 2 minutes to reflect on the site.');
                window.location.href = '/';
            } else {
                alert(`Error: ${data.message || data.Status || 'Unknown issue occurred.'}`);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Network error: Could not update the recipe.');
        });
    });
});


document.getElementById('edit').addEventListener('click', function() {
    window.location.href = editurl;
})


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
