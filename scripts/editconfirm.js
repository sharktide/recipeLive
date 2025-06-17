import { linkify } from './helper/linkify.js';

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

const recipeDetailContainer = document.getElementById('recipe-detail');

const id = urlParams.get('id');
const temp = JSON.parse(sessionStorage.getItem('editRecipeConfirm'));

if (!id || !temp) {
    alert("Missing recipe ID or recipe data.");
    window.location.href = "/";
}

const {
    title,
    name,
    time,
    category,
    diff,
    ingredients,
    desc,
    inst
} = temp;

async function set() {
    const recipeNameElem = document.createElement('h2');
    recipeNameElem.textContent = title;

    const recipeTimeElem = document.createElement('h4');
    recipeTimeElem.textContent = '⌚: ' + time + ' minutes';

    const recipeCreatorElem = document.createElement('p');
    recipeCreatorElem.textContent = 'By: ' + name;

    const recipeCategoryElem = document.createElement('p');
    recipeCategoryElem.textContent = category;

    const recipeDiffElem = document.createElement('p');
    recipeDiffElem.textContent = diff;

    const ingredientsElem = document.createElement('p');
    ingredientsElem.textContent = 'Ingredients: ' + ingredients.join(', ');

    const descriptionElem = document.createElement('p');
    descriptionElem.setAttribute('style', 'white-space: pre-wrap;');
    descriptionElem.textContent = (desc || '').replace(/\\r\\n|\\n/g, '\r\n');

    const instructionsElem = document.createElement('p');
    instructionsElem.setAttribute('style', 'white-space: pre-wrap;');
    instructionsElem.textContent = (inst || '').replace(/\\r\\n|\\n/g, '\r\n');

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
    const id = urlParams.get('id');

    if (!id) {
        alert("Missing recipe ID.");
        return;
    }

    if (!title || !name || !time ||
        !category || !diff || !desc ||
        !inst || !ingredients || ingredients.length === 0) {
        alert("All fields are required.");
        return;
    }

    sb.auth.getSession().then(({ data }) => {
        const token = data?.session?.access_token;

        if (!confirm('Are you sure you want to update this recipe? This action cannot be undone.')) {
            return;
        }

        alert("Sending data. Please do not refresh or navigate away...");

        const recipeData = {
            name: title,
            time,
            creator: name,
            category,
            diff,
            ingredients,
            description: desc,
            instructions: inst,
        };

        fetch(`https://sharktide-recipe2.hf.space/supabase/edit/recipe?id=${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
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


document.getElementById('edit').addEventListener('click', function () {
    sessionStorage.setItem('editRecipe', JSON.stringify(temp)); // push current state back
    window.location.href = `/edit?id=${id}`;
});



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
