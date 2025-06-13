sb.auth.getUser()
.then(result => {
    if (result.data && result.data.user) {
        void 0
    } else {
        window.location.href="/auth"
    }
});

const urlParams = new URLSearchParams(window.location.search);

const id = urlParams.get('id');

if (!id) {
    alert("Missing recipe ID for editing.");
    window.location.href="/"
}

let itemListArray = [];



const titleinput = document.getElementById('titleinput');
const nameinput = document.getElementById('nameinput');
const timeinput = document.getElementById('timeinput');
const categoryinput = document.getElementById('categoryinput');
const diffinput = document.getElementById('diffinput')
const instructionsinput = document.getElementById('instructionsinput');
const descriptioninput = document.getElementById('descriptioninput');
const itemInput = document.getElementById('itemInput');
const submitButton = document.getElementById('submit');

titleinput.addEventListener('input', checkFormValidity);
nameinput.addEventListener('input', checkFormValidity);
timeinput.addEventListener('input', checkFormValidity);
categoryinput.addEventListener('input', checkFormValidity);
diffinput.addEventListener('input', checkFormValidity);
instructionsinput.addEventListener('input', checkFormValidity);
descriptioninput.addEventListener('input', checkFormValidity);
itemInput.addEventListener('input', checkFormValidity);

function checkFormValidity() {
    let title = titleinput.value;
    let name = nameinput.value;
    let time = timeinput.value;
    let category = categoryinput.value;
    let diff = diffinput.value
    let description = descriptioninput.value;
    let instructions = instructionsinput.value;

    let isValid =
        title !== '' &&
        name !== '' &&
        time !== '' &&
        category !== '' &&
        diff !== '' &&
        itemListArray.length > 0 &&
        description !== '' &&
        instructions !== '';

    changeSubmitButtonColor(isValid);
}

function changeSubmitButtonColor(isValid) {
    if (isValid) {
        submitButton.style.backgroundColor = 'green';
        submitButton.style.color = 'white';
        submitButton.innerText = 'Continue ✅';
    } else {
        submitButton.style.backgroundColor = 'darkgray';
        submitButton.style.color = 'gray';
        submitButton.innerText = 'Continue 🚫';

    }
}



function onloadaddItem(itemText) {
    if (itemText !== "") {
        itemListArray.push(itemText);

        const li = document.createElement('li');
        li.textContent = itemText;

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = function() {
            removeItem(itemText, li);
        };
        li.appendChild(removeButton);

        document.getElementById('itemList').appendChild(li);
        itemInput.value = "";

        console.log(itemListArray);
        checkFormValidity();
    } else {
        alert("Please enter an item.");
    }
}

function addItem() {
    const itemText = itemInput.value.trim();

    if (itemText !== "") {
        itemListArray.push(itemText);

        const li = document.createElement('li');
        li.textContent = itemText;

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = function() {
            removeItem(itemText, li);
        };
        li.appendChild(removeButton);

        document.getElementById('itemList').appendChild(li);
        itemInput.value = ""; 

        console.log(itemListArray);
        checkFormValidity()
    } else {
        alert("Please enter an item.");
    }
}

function removeItem(itemText, li) {
    itemListArray = itemListArray.filter(item => item !== itemText);

    li.remove();
    checkFormValidity()

    console.log(itemListArray);
}


async function startup() {
    try {
        const response = await fetch(`https://sharktide-recipe2.hf.space/supabase/recipebyid?id=${urlParams.get('id')}`);
        const data = await response.json(); // Parse JSON
        console.log(data); // Debugging step to check response structure

        const recipe = data.recipe?.row; // Extract recipe data safely

        if (!recipe) {
            console.error("Recipe data is missing!");
            document.getElementById('recipe-detail').textContent = "Recipe not found!";
            return;
        }

        // Set the full recipe details
        titleinput.value = recipe.name;
        timeinput.value = recipe.time;
        nameinput.value = recipe.creator;
        categoryinput.value = recipe.category;
        diffinput.value = recipe.diff;

        // Extract and process ingredients
        const ingredients = recipe.ingredients || [];
        if (ingredients.length === 0) {
            console.error("Ingredients is null or empty");
        } else {
            ingredients.forEach(item => onloadaddItem(item));
        }

        descriptioninput.value = recipe.description.replace(/\\r\\n/g, "\n");
        instructionsinput.value = recipe.instructions.replace(/\\r\\n/g, "\n");
        try {
            const ing = urlParams.get('ingredients');
            const ingredients = JSON.parse(ing);
            
            if (ingredients === undefined || ingredients.length == 0) {
                console.error('Ingredients is null');
            }
            itemListArray.forEach(item => {
                itemListArray = itemListArray.filter(i => i !== item); // Remove from array
                document.querySelectorAll("#itemList li").forEach(li => li.remove()); // Remove all elements
            });
            
            // get ingredients from editconfirm if there
            titleinput.value = urlParams.get('title');

            timeinput.value = urlParams.get('time')

            nameinput.value = urlParams.get('name');

            categoryinput.value = urlParams.get('category');

            diffinput.value = urlParams.get('diff');

            ingredients.forEach(item => onloadaddItem(item));

            descriptioninput.value = urlParams.get('desc');

            instructionsinput.value = urlParams.get('inst');
        } catch {}

    } catch (error) {
        console.error("Error fetching recipe details:", error);
    } finally {
        // Hide the loading spinner and reveal inputs
        document.getElementById("loading-spinner").style.display = "none";
        document.getElementById("make").style.display = "block";
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
.list-container {
    margin-bottom: 10px;
}
.list-container ul {
    list-style-type: none;
    padding-left: 0;
}
.list-container li {
    margin: 5px 0;
}
.list-container button {
    margin-left: 5px;
}

`);
}



document.getElementById('submit').addEventListener('click', function() {
    let title = titleinput.value
    let name = nameinput.value
    let time = timeinput.value
    let category = categoryinput.value
    let diff = diffinput.value
    let description = descriptioninput.value.replace(/\n/g, "\\r\\n")
    let instructions = instructionsinput.value.replace(/\n/g, "\\r\\n")

    if (title == '') {
        alert("Title field is required");
        changeSubmitButtonColor(false);
        return;
    }
    if (name == '') {
        alert("Name field is required");
        changeSubmitButtonColor(false);
        return;
    }
    if (time == '') {
        alert("Cook/Bake time field is required");
        changeSubmitButtonColor(false);
        return;
    }
    if (category == '') {
        alert("Category declaration is required");
        changeSubmitButtonColor(false);
        return;
    }
    if (diff == '') {
        alert("Difficulty field is required");
        changeSubmitButtonColor(false);
        return;
    }
    if (itemListArray === undefined || itemListArray.length == 0) {
        alert("Ingredients field is required");
        changeSubmitButtonColor(false);
        return;
    }
    if (description == '') {
        alert("Description field is required");
        changeSubmitButtonColor(false);
        return;
    }
    if (instructions == '') {
        alert("Instructions are required");
        changeSubmitButtonColor(false);
        return;
    }
    if (confirm('By editing a recipe, you understand that it will be public information. The creators of FindMyFood are not liable or responsible in any way for the actions you commit on this site. We reserve the right to edit and delete accounts and recipes as necessary with or without notice.')) {
    } else {
        return;
    }

    const stringRepresentation = JSON.stringify(itemListArray);
    console.log(stringRepresentation);


    confirmurl = `/editconfirm?id=${id}&title=${title}&time=${time}&name=${name}&category=${category}&diff=${diff}&ingredients=${stringRepresentation}&desc=${description}&inst=${instructions}`
    console.log(confirmurl)
    if (!(confirm('Proceed?'))) {
        return
    }
    window.location.href = confirmurl

});

checkFormValidity();
setbg()
startup()

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
