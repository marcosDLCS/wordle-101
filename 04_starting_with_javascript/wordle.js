/* Dynamic behavior with JS */
/* -------------------------------------------------------------------------------- */

/* Imports */
/* -------------------------------------------------------------------------------- */

import { words } from "./words.js";

/* State */
/* -------------------------------------------------------------------------------- */

let randomWord = "";

/* Functions */
/* -------------------------------------------------------------------------------- */

function selectRandomWord(dictionary) {
  return dictionary[
    Math.floor(Math.random() * dictionary.length)
  ].toUpperCase();
}

function start() {
  randomWord = selectRandomWord(words);
  console.log("Hint: ", randomWord);
  document.getElementById("list-of-attempts").innerHTML = "";
}

function drawFooterYear() {
  document.getElementById("current-year").innerText = new Date().getFullYear();
}

function play() {
  const userAttempt = document.querySelector("#word-input").value.toUpperCase();
  validateAttempt();
  document.querySelector("#word-input").value = "";

  if (randomWord === userAttempt) {
    alert("Congrats! You win.");
    start();
  } else {
    alert(`Oh no! ${userAttempt} is not the daily hidden word.`);
    addAttemptToList(userAttempt);
  }

  event.preventDefault();
}

function validateAttempt(attempt) {
  if (attempt === undefined || attempt === "") {
    console.log("The attempt must not be null or empty");
  }
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

start();
drawFooterYear();
