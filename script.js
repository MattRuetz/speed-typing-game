const word = document.getElementById('word');
const text = document.getElementById('text');
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const endgameEl = document.getElementById('end-game-container');
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
// Set difficulty to local storage value, or default to medium
let difficulty =
    localStorage.getItem('difficulty') !== null
        ? localStorage.getItem('difficulty')
        : 'medium';

// Focus to input on start
text.focus();

// Alter select list to show difficulty chosen
difficultySelect.value =
    localStorage.getItem('difficulty') !== null
        ? localStorage.getItem('difficulty')
        : 'medium';

const getRandomWord = async () => {
    // if no words in array, or user has reached the end, fetch & push in more random words
    if (words.length === 0 || curWordIndex === words.length - 1) {
        const result = await fetch(apiUrl);
        const fetchedWords = await result.json();
        words = fetchedWords;
        curWordIndex = 0;
        console.log(words);
    }

    curWordIndex++;
    return await words[curWordIndex - 1];
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

const updateTime = () => {
    time--;
    timeEl.innerHTML = time + 's';

    if (time === 0) {
        clearInterval(timeInterval);
        // Game over
        gameOver();
    }
};

// Show end-game-container
const gameOver = () => {
    endgameEl.innerHTML = `
    <h1>⏰ Time ran out! ⏰</h1>
    <p>Your Final Score: ${score}</p>
    <button onclick="location.reload()">Reload</button>
    `;

    endgameEl.style.display = 'flex';
};

// ON LOAD
addWordToDOM();
// Start countdown clock
const timeInterval = setInterval(updateTime, 1000);

// Event Listeners

// Typing
text.addEventListener('input', (e) => {
    const insertedText = e.target.value;

    if (insertedText === randomWord) {
        addWordToDOM();
        updateScore();

        // Clear
        e.target.value = '';

        difficulty == 'hard'
            ? (time += 2)
            : difficulty == 'medium'
            ? (time += 4)
            : (time += 6);

        updateTime();
    }
});

// Settings Button
settingsBtn.addEventListener('click', () => settings.classList.toggle('hide'));

settingsForm.addEventListener('change', (e) => {
    difficulty = e.target.value;
    localStorage.setItem('difficulty', difficulty);
});
