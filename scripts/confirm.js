import { linkify } from './helper/linkify.js';

sb.auth.getUser()
.then(result => {
    if (result.data && result.data.user) {
        void 0
    } else {
        window.location.href="/auth"
    }
});

const recipeDetailContainer = document.getElementById('recipe-detail');

async function set() {
    const stored = sessionStorage.getItem('currentRecipe');
    if (!stored) {
        alert("No recipe found. Redirecting...");
        window.location.href = "/newrecipe";
        return;
    }

    const recipe = JSON.parse(stored);

    const recipeNameElem = document.createElement('h2');
    recipeNameElem.textContent = recipe.title;

    const recipeTimeElem = document.createElement('h4');
    recipeTimeElem.textContent = '⌚: ' + recipe.time + ' minutes';

    const recipeCreatorElem = document.createElement('p');
    recipeCreatorElem.textContent = 'By: ' + recipe.name;

    const recipeCategoryElem = document.createElement('p');
    recipeCategoryElem.textContent = recipe.category;

    const recipeDiffElem = document.createElement('p');
    recipeDiffElem.textContent = recipe.diff;

    const ingredientsElem = document.createElement('p');
    ingredientsElem.textContent = 'Ingredients: ' + recipe.ingredients.join(', ');

    const descriptionElem = document.createElement('p');
    descriptionElem.setAttribute('style', 'white-space: pre-wrap;');
    descriptionElem.textContent = recipe.desc.replace(/\\r\\n/g, '\n');

    const instructionsElem = document.createElement('p');
    instructionsElem.setAttribute('style', 'white-space: pre-wrap;');
    instructionsElem.textContent = recipe.inst.replace(/\\r\\n/g, '\n');

    // Append to container
    recipeDetailContainer.appendChild(recipeNameElem);
    recipeDetailContainer.appendChild(recipeTimeElem);
    recipeDetailContainer.appendChild(recipeCreatorElem);
    recipeDetailContainer.appendChild(recipeCategoryElem);
    recipeDetailContainer.appendChild(recipeDiffElem);
    recipeDetailContainer.appendChild(ingredientsElem);
    recipeDetailContainer.appendChild(descriptionElem);
    recipeDetailContainer.appendChild(instructionsElem);
}

async function addlink() {
    await set()
    linkify()
}

addlink()

document.getElementById('confirm').addEventListener('click', function () {
    const stored = sessionStorage.getItem('currentRecipe');
    if (!stored) {
        alert("No recipe found. Redirecting...");
        window.location.href = "/newrecipe";
        return;
    }

    const recipe = JSON.parse(stored);

    const requiredFields = [
        { key: 'title', label: 'Title' },
        { key: 'name', label: 'Name' },
        { key: 'time', label: 'Cook/Bake time' },
        { key: 'category', label: 'Category' },
        { key: 'diff', label: 'Difficulty' },
        { key: 'ingredients', label: 'Ingredients' },
        { key: 'desc', label: 'Description' },
        { key: 'inst', label: 'Instructions' }
    ];

    for (const { key, label } of requiredFields) {
        const val = recipe[key];
        if (val == null || (typeof val === 'string' && val.trim() === '') || (Array.isArray(val) && val.length === 0)) {
            alert(`${label} field is required`);
            return;
        }
    }

    sb.auth.getSession()
        .then(({ data }) => {
            const token = data?.session?.access_token;
            if (!confirm('Are you sure you would like to upload the recipe? This action cannot be undone.')) {
                return;
            }

            alert("Sending data. This may take a few moments. Please don’t close the page.");

            const recipeData = {
                name: recipe.title,
                time: recipe.time,
                creator: recipe.name,
                category: recipe.category,
                diff: recipe.diff,
                ingredients: recipe.ingredients,
                description: recipe.desc,
                instructions: recipe.inst,
            };

            console.log("Uploading recipe:", recipeData);

            return fetch('https://sharktide-recipe2.hf.space/supabase/add/recipe', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(recipeData)
            });
        })
        .then(response => {
            if (!response) return;
            return response.json();
        })
        .then(data => {
            if (!data) return;
            console.log("Success:", data);
            if (data.message === 'Recipe stored successfully!') {
                alert('Recipe Added Successfully! It may take up to 2 minutes to update across the site.');
                sessionStorage.removeItem('currentRecipe');
                window.location.href = '/';
            } else {
                alert(data.Status || 'Something went wrong.');
            }
        })
        .catch(error => {
            console.error("Upload failed:", error);
            alert('Error: Could not save the recipe.');
        });
});

document.getElementById('edit').addEventListener('click', function() {
    window.location.href = "/newrecipe";
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
