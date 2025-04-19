import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getDatabase, ref } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";
import { replacePrompt, displayPrompt, displayHistory, unEscapeHTML, simulateCommand } from './utils.js';
import { displayBanner, handleInput } from './handlers.js';

// intialize firebase
const dbConfig = {
  databaseURL: "https://neemo-site-default-rtdb.firebaseio.com/"
};
const app = initializeApp(dbConfig);
const db = getDatabase(app);
export const notesDB = ref(db, "notes");
export const blogDB = ref(db, "blogs");

// initialize emailjs
emailjs.init({
  publicKey: "ww8sQvOB6jOpK5L_J",
})

// initialize terminal variables
export const terminal = document.getElementById("terminal");
export let dir = "~";
let onHistoryIdx;

export async function processCommand(cmd) {
  if (!cmd) {
    return;
  }

  // remove currPrompt and replace input with p
  replacePrompt();

  // create response element and default message
  const response = document.createElement("p");
  response.classList.add("response");

  // process and handle input
  const splitCmd = cmd.split(' ');
  const command = splitCmd[0].toLowerCase();
  const args = splitCmd.splice(1);
  try {
    const givenResponse = await handleInput(command, args, response);

    // append input and response as a kv pair to local storage
    let history = localStorage.getItem('history');
    history = history ? JSON.parse(history) : [];

    // create command/response object
    const histItem = { "command": cmd, "response": givenResponse.innerHTML };

    // add item to history and set history
    history.push(histItem);
    localStorage.setItem('history', JSON.stringify(history));

    // reset global onHistoryIdx
    onHistoryIdx = history.length;

    // show response in terminal
    terminal.appendChild(response);
    displayPrompt();
  } catch (err) {
    response.textContent = `Something went wrong. Error: ${err}`;
    terminal.appendChild(response);
    displayPrompt();
  }
}

// define load behaviour in function and call on script load
function runOnLoad() {
  // attach functions to be available globally
  window.simulateCommand = simulateCommand;

  // load history
  let history = localStorage.getItem('history')
  const originalBanner = document.createElement('div');

  // if no history item set (initial load no commands), display banner and prompt
  if (!history) {
    const originalBanner = document.createElement('div');
    displayBanner(originalBanner);
    terminal.appendChild(originalBanner);
    displayPrompt();
    return;
  }

  history = JSON.parse(history);

  if (history[0].command === "clear" && history.length === 1) {
    // if clear is only item in history, refresh = fresh start
    displayBanner(originalBanner);
    terminal.appendChild(originalBanner);
    localStorage.removeItem('history');
  } else if (history[0].command === "clear" && history.length > 1) {
    // if first item is "clear" then remove from history
    history.shift();
    displayHistory(history);
  } else {
    // load items from history and add to dom
    displayBanner(originalBanner);
    terminal.appendChild(originalBanner);
    displayHistory(history);
  }

  // set global onHistoryIdx
  onHistoryIdx = history.length;

  displayPrompt();
}

// up/down to cycle through history
window.addEventListener("keydown", (e) => {
  const input = document.querySelector("input");
  // conditional for simulated keydown
  if (input) {
    input.focus();
  }

  // do nothing if no history
  let history = localStorage.getItem('history');
  if (!history || e.key !== "ArrowUp" && e.key !== "ArrowDown") {
    return;
  }

  history = JSON.parse(history);

  if (e.key === "ArrowUp") {
    // cycle up through history
    if (onHistoryIdx >= 1) {
      onHistoryIdx--;
    }
    input.value = unEscapeHTML(history[onHistoryIdx].command);

  } else if (e.key === "ArrowDown") {
    // cycle down through history
    if (onHistoryIdx < history.length - 1) {
      onHistoryIdx++;
      input.value = unEscapeHTML(history[onHistoryIdx].command);
    } else if (onHistoryIdx < history.length) {
      onHistoryIdx++;
      input.value = "";
    }
  }
})

runOnLoad()