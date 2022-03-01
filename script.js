const word = document.getElementById('word');
const text = document.getElementById('text');
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const endgameEl = document.getElementById('end-game');
const settingsBtn = document.getElementById('settings-btn');
const settingsForm = document.getElementById('settings-form');
const settings = document.getElementById('settings');
const difficultySelect = document.getElementById('difficulty');

const numWordsToFetch = 20;
//URL to fetch a single word from random word API, with swear words not allowed
const apiUrl = `https://random-word-api.herokuapp.com/word?number=${numWordsToFetch}&swear=0`;

let words = [];
let randomWord = '';
let score = 0;
let time = 10;
let curWordIndex = 0;

// Focus to input on start
text.focus();

const getRandomWord = async () => {
    // if no words in array, or user has reached the end, fetch & push in more random words
    if (words.length === 0 || curWordIndex === words.length - 3) {
        const result = await fetch(apiUrl);
        const fetchedWords = await result.json();
        words.push(fetchedWords);
    }
    curWordIndex++;
    return await words[0][curWordIndex - 1];
};

// Add word to DOM
const addWordToDOM = async () => {
    randomWord = await getRandomWord();
    word.innerHTML = randomWord;
};

// Update score v
const updateScore = () => {
    score++;
    scoreEl.textContent = score;
};

addWordToDOM();

// Event Listeners

text.addEventListener('input', (e) => {
    const insertedText = e.target.value;

    if (insertedText === randomWord) {
        addWordToDOM();
        updateScore();

        // Clear
        e.target.value = '';
    }
});
