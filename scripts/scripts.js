document.getElementById('findarecipe').addEventListener('click', function() {
    window.location.href = "/recipes"
});

document.getElementById('makearecipe').addEventListener('click', function() {
    window.location.href = "/newrecipe"
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
#findarecipe, #makearecipe {
    color:rgb(0, 0, 0);
    background-color: #ffffff;
    border: 4px solid #458cdd;
    border-radius: 5px;
    cursor: pointer;
    margin: 10px;
} 
#findarecipe {
    padding: 0.65rem;
}
#makearecipe {
    padding: 0.5rem;
} 
#findarecipe:hover, #makearecipe:hover {
    background-color: #98b6eb;
}
.intro {
    text-align: center;
    align-items: center;
    margin: auto;
    width: 100%;
    height: 200%;
    padding: 10px;
    background-image: url(images/recipe-bg.png);
    background-repeat: no-repeat;
    background-size: cover;
}   

`);
}

setbg()