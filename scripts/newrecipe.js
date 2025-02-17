let itemListArray = []; // This will store the items as a JavaScript array

function addItem() {
    const itemInput = document.getElementById('itemInput');
    const itemText = itemInput.value.trim();

    if (itemText !== "") {
    // Add the item to the array
    itemListArray.push(itemText);

    // Update the UI
    const li = document.createElement('li');
    li.textContent = itemText;

    // Create a remove button for each item
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.onclick = function() {
        removeItem(itemText, li);
    };
    li.appendChild(removeButton);

    document.getElementById('itemList').appendChild(li);
    itemInput.value = ""; // Clear the input field

    console.log(itemListArray); // Log the updated array for testing
    } else {
    alert("Please enter an item.");
    }
}

function removeItem(itemText, li) {
    // Remove the item from the array
    itemListArray = itemListArray.filter(item => item !== itemText);

    // Remove the item from the UI
    li.remove();

    console.log(itemListArray); // Log the updated array for testing
}

const titleinput = document.getElementById('titleinput');
const nameinput = document.getElementById('nameinput');
const timeinput = document.getElementById('timeinput');
const instructionsinput = document.getElementById('instructionsinput');
const descriptioninput = document.getElementById('descriptioninput');






document.getElementById('submit').addEventListener('click', function() {
    let title = titleinput.value
    let name = nameinput.value
    let time = timeinput.value
    let description = descriptioninput.value
    let instructions = instructionsinput.value

    if (title == '') {
        alert("Title field is required")
        return
    }
    if (name == '') {
        alert("Name field is required")
        return
    }
    if (time == '') {
        alert("Cook/Bake time field is required")
        return
    }
    if (itemListArray === undefined || itemListArray.length == 0) {
        alert("Ingredients field is required")
        return
    }
    if (description == '') {
        alert("Instructions are required")
        return
    }
    if (instructions == '') {
        alert("Instructions are required")
        return
    }
    console.log(title)
    console.log(name)
    console.log(time)
    console.log(itemListArray)
    console.log(description)
    console.log(instructions)


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
        alert(data.Status);

        window.location.href = '/'
    })
    .catch(error => {
        console.error('Error:', error);
        alert(data.Status);

        window.location.href = '/'
    });



}
)
