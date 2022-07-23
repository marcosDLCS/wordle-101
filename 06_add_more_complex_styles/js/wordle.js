/* JS */
/* -------------------------------------------------------------------------------- */

/* Imports */
/* -------------------------------------------------------------------------------- */

import { words } from "./words.js";

/* State */
/* -------------------------------------------------------------------------------- */

const max_attempts = 6;
const word_length = 5;
const game = {
  randomWord: "",
  status: "",
  validAttempts: [],
  allAttempts: [],
};

/* Functions */
/* -------------------------------------------------------------------------------- */

function start() {
  // Reset the game object
  game.randomWord = selectRandomWord(words);
  game.status = "playing";
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
    document.querySelector("#word-input").value = "";
    return;
  }

  game.validAttempts.push(userAttempt);
  drawValidAttempts();

  if (game.randomWord === userAttempt) {
    alert("Congrats! You win.");
    game.status = "win";
  } else {
    alert(`Oh no! ${userAttempt} is not the daily hidden word.`);
  }

  document.querySelector("#word-input").value = "";
}

function isValidAttempt(attempt) {
  if (game.status === "win") {
    alert("You have won! Please restart the game to play again");
    return false;
  }

  if (game.status === "defeat") {
    alert("You have lost! Please restart the game to play again");
    return false;
  }

  if (attempt === undefined || attempt === "") {
    alert("Invalid attempt: The word must not be null or empty");
    return false;
  }

  if (attempt.length > word_length) {
    alert(
      `Invalid attempt: The word length must not be more than ${word_length}`
    );
    return false;
  }

  if (attempt.length < word_length) {
    alert(
      `Invalid attempt: The word length must not be less than ${word_length}`
    );
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
    game.status = "defeat";
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
  document.querySelectorAll(".grid-item").forEach((element) => {
    element.innerHTML = "";
    element.className = "grid-item";
  });

  game.validAttempts.forEach((word, wordIndex) => {
    const letters = word.split("");
    const itemStatus = game.randomWord === word ? "correct-item" : "wrong-item";

    letters.forEach((letter, letterIndex) => {
      const gridItem = document.querySelector(
        `.grid-item:nth-child(${wordIndex * word_length + letterIndex + 1})`
      );
      gridItem.innerText = letter;
      gridItem.classList.add(itemStatus);
    });
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
