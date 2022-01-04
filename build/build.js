import { 
    checkAuth, 
    getCharacter,
    logout, 
    createCharacter,
    updateBottom,
    updateHead,
    updateMiddle,
    updateChatchphrases
} from '../fetch-utils.js';

checkAuth();

const headDropdown = document.getElementById('head-dropdown');
const middleDropdown = document.getElementById('middle-dropdown');
const bottomDropdown = document.getElementById('bottom-dropdown');
const headEl = document.getElementById('head');
const middleEl = document.getElementById('middle');
const bottomEl = document.getElementById('bottom');
const reportEl = document.getElementById('report');
const chatchphrasesEl = document.getElementById('chatchphrases');
const catchphraseInput = document.getElementById('catchphrase-input');
const catchphraseButton = document.getElementById('catchphrase-button');
const logoutButton = document.getElementById('logout');

// we're still keeping track of 'this session' clicks, so we keep these lets
let headCount = 0;
let middleCount = 0;
let bottomCount = 0;

headDropdown.addEventListener('change', async() => {
    // increment the correct count in state
    headCount++;
    // update the head in supabase with the correct data
    const newHead = headDropdown.value;

    await updateHead(newHead);

    refreshData();
});


middleDropdown.addEventListener('change', async() => {
    // increment the correct count in state
    middleCount++;
    // update the middle in supabase with the correct data
    const newMiddle = middleDropdown.value;

    await updateMiddle(newMiddle);

    refreshData();
});


bottomDropdown.addEventListener('change', async() => {
    // increment the correct count in state
    bottomCount++;
    // update the bottom in supabase with the correct data

    const newBottom = bottomDropdown.value;

    await updateBottom(newBottom);

    refreshData();
});

catchphraseButton.addEventListener('click', async() => {
    
    // go fetch the old catch phrases
    const character = await getCharacter();
    // update the catchphrases array locally by pushing the new catchphrase into the old array
    character.catchphrases.push(catchphraseInput.value);
    // update the catchphrases in supabase by passing the mutated array to the updateCatchphrases function
    await updateChatchphrases(character.catchphrases);
    refreshData();

    catchphraseInput.value = '';
});

window.addEventListener('load', async() => {
    let character = await getCharacter;
    // on load, attempt to fetch this user's character

    // if this user turns out not to have a character
    if (!character) {
        // create a new character with correct defaults for all properties (head, middle, bottom, catchphrases)
        const defaultCharacter = {
            head: '',
            middle: '',
            bottom: '',
            catchphrases: []
        };

        await createCharacter(defaultCharacter);
    }
    // and put the character's catchphrases in state (we'll need to hold onto them for an interesting reason);

    // then call the refreshData function to set the DOM with the updated data
    refreshData();
});

logoutButton.addEventListener('click', () => {
    logout();
});

function displayStats() {
    reportEl.textContent = `In this session, you have changed the head ${headCount} times, the body ${middleCount} times, and the pants ${bottomCount} times. And nobody can forget your character's classic catchphrases:`;
}


async function fetchAndDisplayCharacter() {
    // fetch the caracter from supabase
    const character = await getCharacter();
    // if the character has a head, display the head in the dom
    if (character.head)
        headEl.style.backgroundImage = `url(../assets/${character.head}-head.png)`;
    // if the character has a middle, display the middle in the dom
    if (character.middle)
        middleEl.style.backgroundImage = `url(../assets/${character.middle}-middle.png)`;
    // if the character has a pants, display the pants in the dom
    if (character.pants)
        bottomEl.style.backgroundImage = `url(../assets/${character.pants}-pants.png)`;
    // loop through catchphrases and display them to the dom (clearing out old dom if necessary)
    chatchphrasesEl.textContent = '';

    for (let catchphrase of character.catchphrases) {
        const catchphraseElem = document.createElement('p');

        catchphraseElem.textContent = catchphrase;

        chatchphrasesEl.append(catchphraseElem);
    }
}

function refreshData() {
    displayStats();
    fetchAndDisplayCharacter();
}
