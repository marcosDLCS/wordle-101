/* Dynamic behavior with JS */
/* -------------------------------------------------------------------------------- */

/* Imports */
/* -------------------------------------------------------------------------------- */

import { words } from "./words.js";

/* State */
/* -------------------------------------------------------------------------------- */

let randomWord = selectRandomWord(words);

/* Functions */
/* -------------------------------------------------------------------------------- */

function selectRandomWord(dictionary) {
  return dictionary[
    Math.floor(Math.random() * dictionary.length)
  ].toUpperCase();
}

function drawFooterYear() {
  document.getElementById("current-year").innerText = new Date().getFullYear();
}

function play() {
  const userAttempt = document.querySelector("#word-input").value.toUpperCase();
  document.querySelector("#word-input").value = "";

  if (randomWord === userAttempt) {
    alert("Congrats! You win.");
    reset();
  } else {
    alert(`Oh no! ${userAttempt} is not the daily hidden word.`);
    addAttemptToList(userAttempt);
  }

  event.preventDefault();
}

function validateAttempt(attempt) {
  if (attempt === undefined || attempt === "") {
    alert("The attempt must not be null or empty");
  }
}

function reset() {
  randomWord = selectRandomWord(words);
  console.log("Hint: ", randomWord);
  document.getElementById("list-of-attempts").innerHTML = "";
}

function addAttemptToList(attempt) {
  const listItem = document.createElement("li");
  listItem.innerText = attempt;

  document.getElementById("list-of-attempts").appendChild(listItem);
}

/* Events */
/* -------------------------------------------------------------------------------- */

document.getElementById("play-button").onclick = () => play();

/* Run */
/* -------------------------------------------------------------------------------- */

drawFooterYear();
console.log("Hint: ", randomWord);
