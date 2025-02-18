let itemListArray = [];

const titleinput = document.getElementById('titleinput');
const nameinput = document.getElementById('nameinput');
const timeinput = document.getElementById('timeinput');
const instructionsinput = document.getElementById('instructionsinput');
const descriptioninput = document.getElementById('descriptioninput');
const itemInput = document.getElementById('itemInput');
const submitButton = document.getElementById('submit');

titleinput.addEventListener('input', checkFormValidity);
nameinput.addEventListener('input', checkFormValidity);
timeinput.addEventListener('input', checkFormValidity);
instructionsinput.addEventListener('input', checkFormValidity);
descriptioninput.addEventListener('input', checkFormValidity);
itemInput.addEventListener('input', checkFormValidity);

document.getElementById('itemList').addEventListener('DOMNodeInserted', checkFormValidity);
document.getElementById('itemList').addEventListener('DOMNodeRemoved', checkFormValidity);

function checkFormValidity() {
    let title = titleinput.value;
    let name = nameinput.value;
    let time = timeinput.value;
    let description = descriptioninput.value;
    let instructions = instructionsinput.value;

    let isValid =
        title !== '' &&
        name !== '' &&
        time !== '' &&
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

document.getElementById('submit').addEventListener('click', function() {
    let title = titleinput.value
    let name = nameinput.value
    let time = timeinput.value
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

    if (confirm('Please confirm title:  ' + title)) {
    } else {
        return;
    }

    if (confirm('Please confirm your name/handle:  ' + name)) {
    } else {
        return;
    }

    if (confirm('Please confirm cook/bake/prep time:  ' + time)) {
    } else {
        return;
    }

    if (confirm('Please confirm ingredients:  ' + itemListArray)) {
    } else {
        return;
    }

    if (confirm('Please confirm description:  ' + description)) {
    } else {
        return;
    }

    if (confirm('Please confirm instructions:  ' + instructions)) {
    } else {
        return;
    }

    if (confirm('By uploading a recipe, you understand that it is not possible to modify and delete it. It will be public information listed here: https://hf.co/datasets/sharktide/recipes. The creators of FindMyFood are not liable or responsible for any infringments of copyright on the recipe that you created.')) {
    } else {
        return;
    }

    
    alert("Sending data. This make take a few minutes. Do not close this page or press the create button again, even if a response does not come quickly. ");

    changeSubmitButtonColor(true);
    console.log(title);
    console.log(name);
    console.log(time);
    console.log(itemListArray);
    console.log(description);
    console.log(instructions);

    const filename = title;
    const recipeData = {
        name: title,
        time: time,
        creator: name,
        ingredients: itemListArray,
        description: description,
        instructions: instructions
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
        //window.location.href = '/';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error: Could not save the recipe.');
        window.location.href = '/';
    });
});

checkFormValidity();
