
const members = [
    {
        username: "sudarsh",
        preferredName: null,
        url: "https://sudarsh.com"
    },
    {
        username: "vincent",
        preferredName: null,
        url: "https://vvvincent.me/",
    },
]
// Wait for DOM content to load before populating members list
document.addEventListener('DOMContentLoaded', () => {
    // Get the members list element
    const membersList = document.getElementById('members-list');

    // Populate the list with members
    members.forEach(member => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = member.url;
        a.textContent = member.preferredName || member.username;
        li.appendChild(a);
        membersList.appendChild(li);
    });
});

// Handle username availability checking
document.addEventListener('DOMContentLoaded', () => {
    const usernameInput = document.getElementById('username-input');
    
    usernameInput.addEventListener('input', () => {
        const username = usernameInput.value.trim().toLowerCase();
        const isUsernameTaken = members.some(member => 
            member.username.toLowerCase() === username
        );

        if (username === '') {
            usernameInput.style.borderColor = '#000'; // Reset to default
        } else if (isUsernameTaken) {
            usernameInput.style.borderColor = '#ff0000'; // Red for taken
        } else {
            usernameInput.style.borderColor = '#00ff00'; // Green for available
        }
    });
});

// Handle webring navigation
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function navigateWebring() {
    const username = getQueryParam('un');
    const direction = getQueryParam('d');

    console.log("username", username);
    console.log("direction", direction);

    if (!username || !direction) return;

    const currentIndex = members.findIndex(m => m.username.toLowerCase() === username.toLowerCase());
    if (currentIndex === -1) return;

    let nextIndex;
    if (direction === 'forward') {
        nextIndex = (currentIndex + 1) % members.length;
    } else if (direction === 'backward') {
        nextIndex = (currentIndex - 1 + members.length) % members.length;
    } else {
        return;
    }

    window.location.href = members[nextIndex].url;
}

// Run navigation on page load
document.addEventListener('DOMContentLoaded', navigateWebring);

document.addEventListener('DOMContentLoaded', () => {
    const linkUsernameInput = document.getElementById('link-username-input');
    const prevLink = document.getElementById('prev-link');
    const nextLink = document.getElementById('next-link');

    linkUsernameInput.addEventListener('input', () => {
        const username = linkUsernameInput.value.trim();
        if (username) {
            const baseUrl = window.location.origin + '/webring.html';
            prevLink.textContent = `${baseUrl}?un=${username}&d=backward`;
            nextLink.textContent = `${baseUrl}?un=${username}&d=forward`;
        } else {
            prevLink.textContent = '';
            nextLink.textContent = '';
        }
    });
});