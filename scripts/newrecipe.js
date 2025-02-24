let itemListArray = [];

const urlParams = new URLSearchParams(window.location.search);


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
        submitButton.innerText = 'Create ✅';
    } else {
        submitButton.style.backgroundColor = 'darkgray';
        submitButton.style.color = 'gray';
        submitButton.innerText = 'Create 🚫';

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
try {
    const str = urlParams.get('ingredients');
    const ingredients = JSON.parse(str);
    
    if (ingredients === undefined || ingredients.length == 0) {
        console.error('Ingredients is null');
    }
    
    

    // Set the full recipe details
    titleinput.value = urlParams.get('title');

    timeinput.value = urlParams.get('time')

    nameinput.value = urlParams.get('name');

    categoryinput.value = urlParams.get('category');

    diffinput.value = urlParams.get('diff');

    ingredients.forEach(item => onloadaddItem(item));

    descriptioninput.value = urlParams.get('desc');

    instructionsinput.value = urlParams.get('inst');
} catch {}

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
    let description = descriptioninput.value
    let instructions = instructionsinput.value

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
    if (confirm('By uploading a recipe, you understand that it is not possible to modify and delete it. It will be public information listed here: https://hf.co/datasets/sharktide/recipes. The creators of FindMyFood are not liable or responsible for any infringments of copyright on the recipe that you created.')) {
    } else {
        return;
    }

    const stringRepresentation = JSON.stringify(itemListArray);
    console.log(stringRepresentation);


    confirmurl = `/confirm?title=${title}&time=${time}&name=${name}&category=${category}&diff=${diff}&ingredients=${stringRepresentation}&desc=${description}&inst=${instructions}`
    console.log(confirmurl)
    if (!(confirm('Proceed?'))) {
        return
    }
    window.location.href = confirmurl

});

checkFormValidity();
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
