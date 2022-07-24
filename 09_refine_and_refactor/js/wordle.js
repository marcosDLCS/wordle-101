/* JS */
/* -------------------------------------------------------------------------------- */

/* Imports */
/* -------------------------------------------------------------------------------- */

import { words } from "./words.js";

/* Constants */
/* -------------------------------------------------------------------------------- */

const MAX_ATTEMPTS = 6;
const WORD_LENGTH = 5;

const GameStatus = {
  Win: "win",
  Defeat: "defeat",
};

const Messages = {
  Success: {
    EverythingIsOk: "🌈 - Everything is ok!",
    Winner: "🥳 - You have won! Please restart the game to play again",
  },
  Error: {
    Validation: {
      MaxAttempts: `❌ - Invalid: You have reached the maximum amount of attempts (${MAX_ATTEMPTS})`,
      LengthIsBig: `❌ - Invalid: The word length must not be more than ${WORD_LENGTH}`,
      LengthIsLow: `❌ - Invalid: The word length must not be less than ${WORD_LENGTH}`,
      NullOrEmpty: "❌ - Invalid: The word must not be null or empty",
      InvalidWord:
        "❌ - Invalid: The word must not contain numbers / punctuation",
    },
    NotTheWord: "💩 - Oh no! The word you entered is not the daily hidden word",
    Looser: "😔 - You have lost! Please restart the game to play again",
  },
};

/* State */
/* -------------------------------------------------------------------------------- */

let game = {
  randomWord: "",
  status: "",
  lastNotification: "",
  validAttempts: [],
  allAttempts: [],
};

/* Functions */
/* -------------------------------------------------------------------------------- */

/* Game actions */

function start() {
  // Reset the game object that contains the state
  game.randomWord = selectRandomWord(words);
  game.status = "playing";
  game.lastNotification = Messages.Success.EverythingIsOk;
  game.validAttempts = [];
  game.allAttempts = [];

  // Check if a previous game is stored in LocalStorage
  restorePreviousGame();

  // Draw the "notifications" section
  drawNotifications();

  // Draw the "board" section
  drawBoard();

  // Draw the list of valid attempts
  drawValidAttempts();

  // Draw the list of all attempts
  drawAllAttempts();

  // Draw the current year in the "footer" section
  drawFooterYear();

  // Save the current game status
  saveGameStatus();
}

function selectRandomWord(dictionary) {
  return dictionary[
    Math.floor(Math.random() * dictionary.length)
  ].toUpperCase();
}

function restorePreviousGame() {
  const previousGame = localStorage.getItem("game");
  if (typeof previousGame !== "undefined" && previousGame !== null) {
    game = JSON.parse(previousGame);
  }
}

function saveGameStatus() {
  localStorage.setItem("game", JSON.stringify(game));
}

function reset() {
  localStorage.clear();
  start();
}

function play() {
  // Prevent the "submit" default behavior
  event.preventDefault();

  const userAttempt = document.querySelector("#word-input").value.toUpperCase();

  game.allAttempts.push(userAttempt);
  drawAllAttempts();

  // Validate the user input against the game rules
  const isValid = isValidAttempt(userAttempt);
  drawNotifications();

  if (!isValid) {
    document.querySelector("#word-input").value = "";
    drawNotifications();
    saveGameStatus();
    return;
  }

  game.validAttempts.push(userAttempt);

  // Check if the word is correct or not
  if (game.randomWord === userAttempt) {
    game.lastNotification = Messages.Success.Winner;
    game.status = GameStatus.Win;
  } else {
    game.lastNotification = Messages.Error.NotTheWord;
  }

  // Check the victory
  if (game.validAttempts.length > MAX_ATTEMPTS - 1) {
    game.lastNotification = Messages.Error.Looser;
    game.status = GameStatus.Defeat;
  }

  // Clear user input and re-draw the board
  document.querySelector("#word-input").value = "";

  drawNotifications();
  drawValidAttempts();
  saveGameStatus();
}

/* Validations */

function isValidAttempt(attempt) {
  if (game.status === GameStatus.Win) {
    game.lastNotification = Messages.Success.Winner;
    return false;
  }

  if (game.status === GameStatus.Defeat) {
    game.lastNotification = Messages.Error.Looser;
    return false;
  }

  if (typeof attempt === "undefined" || attempt === "") {
    game.lastNotification = Messages.Error.Validation.NullOrEmpty;
    return false;
  }

  if (attempt.length > WORD_LENGTH) {
    game.lastNotification = Messages.Error.Validation.LengthIsBig;
    return false;
  }

  if (attempt.length < WORD_LENGTH) {
    game.lastNotification = Messages.Error.Validation.LengthIsLow;
    return false;
  }

  if (!/^[a-zA-Z]*$/.test(attempt)) {
    game.lastNotification = Messages.Error.Validation.InvalidWord;
    return false;
  }

  return true;
}

/* Draw the elements */

function drawNotifications() {
  const notificationSection = document.getElementById("notifications");
  notificationSection.innerHTML = "";

  const notification = document.createElement("p");
  notification.innerText = game.lastNotification;
  notificationSection.appendChild(notification);
}

function drawBoard() {
  const boardSection = document.getElementById("board");
  boardSection.innerHTML = "";

  for (let i = 0; i < MAX_ATTEMPTS * WORD_LENGTH; i++) {
    const boardItem = document.createElement("div");
    boardItem.className = "grid-item";
    boardSection.appendChild(boardItem);
  }
}

function drawAllAttempts() {
  const allAttempts = document.getElementById("list-of-attempts");
  allAttempts.innerHTML = "";

  game.allAttempts.forEach((attempt) => {
    const listItem = document.createElement("li");
    listItem.innerText = attempt;
    allAttempts.appendChild(listItem);
  });
}

function drawValidAttempts() {
  document.querySelectorAll(".grid-item").forEach((element) => {
    element.innerHTML = "";
    element.className = "grid-item";
  });

  game.validAttempts.forEach((word, wordIndex) => {
    const letters = word.split("");
    const markedLetters = [];

    letters.forEach(async (letter, letterIndex) => {
      if (wordIndex === game.validAttempts.length - 1) {
        await sleep(250 * letterIndex);
      }

      const gridItem = document.querySelector(
        `.grid-item:nth-child(${wordIndex * WORD_LENGTH + letterIndex + 1})`
      );
      gridItem.innerText = letter;

      let itemStatus = "wrong-item";
      if (game.randomWord.charAt(letterIndex) === letter) {
        itemStatus = "correct-item";
        markedLetters.push(letter);
      } else if (
        game.randomWord.includes(letter) &&
        markedLetters.indexOf(letter) === -1
      ) {
        itemStatus = "warn-item";
        markedLetters.push(letter);
      }

      gridItem.classList.add(itemStatus);
    });
  });
}

function drawFooterYear() {
  document.getElementById("current-year").innerText = new Date().getFullYear();
}

/* Other */

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* Events */
/* -------------------------------------------------------------------------------- */

document.getElementById("play-button").onclick = play;
document.getElementById("reset-button").onclick = reset;

/* Run */
/* -------------------------------------------------------------------------------- */

start();
