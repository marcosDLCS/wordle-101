/* Dynamic behavior with JS */
/* -------------------------------------------------------------------------------- */

/* Imports */
/* -------------------------------------------------------------------------------- */

import { words } from "./words.js";

/* State */
/* -------------------------------------------------------------------------------- */

const max_attempts = 6;
const game = {
  randomWord: "",
  validAttempts: [],
  allAttempts: [],
};

/* Functions */
/* -------------------------------------------------------------------------------- */

function start() {
  // Reset the game object
  game.randomWord = selectRandomWord(words);
  game.validAttempts = [];
  game.allAttempts = [];

  // Draw list of valid attempts
  drawValidAttempts();

  // Reset list of attempts
  document.getElementById("list-of-attempts").innerHTML = "";

  // Give a hint
  console.log("Hint: ", game.randomWord);
}

function selectRandomWord(dictionary) {
  return dictionary[
    Math.floor(Math.random() * dictionary.length)
  ].toUpperCase();
}

function drawFooterYear() {
  document.getElementById("current-year").innerText = new Date().getFullYear();
}

function play() {
  event.preventDefault();

  const userAttempt = document.querySelector("#word-input").value.toUpperCase();

  addAttemptToList(userAttempt);
  const isValid = isValidAttempt(userAttempt);

  if (!isValid) {
    return;
  }
  game.validAttempts.push(userAttempt);
  drawValidAttempts();

  if (game.randomWord === userAttempt) {
    alert("Congrats! You win.");
    start();
  } else {
    alert(`Oh no! ${userAttempt} is not the daily hidden word.`);
  }

  document.querySelector("#word-input").value = "";
}

function isValidAttempt(attempt) {
  if (attempt === undefined || attempt === "") {
    alert("Invalid attempt: The word must not be null or empty");
    return false;
  }

  if (attempt.length > 5) {
    alert("Invalid attempt: The word length must not be more than 5");
    return false;
  }

  if (attempt.length < 5) {
    alert("Invalid attempt: The word length must not be less than 5");
    return false;
  }

  if (/\d/.test(attempt)) {
    alert("Invalid attempt: The word must not contain numbers");
    return false;
  }

  if (game.validAttempts.length > max_attempts - 1) {
    alert(
      `Invalid attempt: You have reached the maximum amount of attempts (${max_attempts})`
    );
    return false;
  }

  return true;
}

function addAttemptToList(attempt) {
  game.allAttempts.push(attempt);
  const listItem = document.createElement("li");
  listItem.innerText = attempt;

  document.getElementById("list-of-attempts").appendChild(listItem);
}

function drawValidAttempts() {
  const board = document.getElementById("board");
  board.innerHTML = "";

  game.validAttempts.forEach((item) => {
    const boardRow = document.createElement("div");
    boardRow.className = "board-row";
    boardRow.innerText = item;
    board.appendChild(boardRow);
  });
}

function reset() {
  start();
}

/* Events */
/* -------------------------------------------------------------------------------- */

document.getElementById("play-button").onclick = () => play();
document.getElementById("reset-button").onclick = () => reset();

/* Run */
/* -------------------------------------------------------------------------------- */

start();
drawFooterYear();
