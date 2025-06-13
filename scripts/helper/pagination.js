export function getPaginationParams(urlParams, defaultLimit = 12) {
    const offset = parseInt(urlParams.get('offset') || '0', 10);
    const limit = parseInt(urlParams.get('limit') || defaultLimit, 12);
    return { offset, limit };
}

export function setupPaginationControls({ offset, limit, totalCount }) {
    const paginationContainer = document.getElementById('pagination-controls');
    paginationContainer.innerHTML = '';

    const prevButton = document.createElement('button');
    prevButton.textContent = '← Previous';
    prevButton.disabled = offset === 0;
    prevButton.addEventListener('click', () => {
        updateURLWithOffset(offset - limit);
    });

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next →';
    console.log(totalCount)
    nextButton.disabled = offset + limit >= totalCount;
    nextButton.addEventListener('click', () => {
        updateURLWithOffset(offset + limit);
    });

    paginationContainer.appendChild(prevButton);
    paginationContainer.appendChild(nextButton);
}

export function hidebtns() {
    document.getElementById("next-page").style.display = "none";
    document.getElementById("prev-page").style.display = "none";
}

function updateURLWithOffset(newOffset) {
    const url = new URL(window.location.href);
    url.searchParams.set('offset', newOffset);
    window.location.href = url.toString();
}
