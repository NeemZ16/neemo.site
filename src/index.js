import { replacePrompt, displayPrompt, handleInput, displayHistory } from './utils.js';
import { displayBanner } from './handlers.js';

export const terminal = document.getElementById("terminal");
export let dir = "~";

export function processCommand(cmd) {
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
  const command = splitCmd[0];
  const args = splitCmd.splice(1);
  handleInput(command, args, response);

  // add input and response as a kv pair to local storage
  let history = localStorage.getItem('history');
  history = history ? JSON.parse(history) : {};
  history[cmd] = response.innerHTML;
  localStorage.setItem('history', JSON.stringify(history));

  // show response in terminal
  terminal.appendChild(response);
  displayPrompt();
}

// define load behaviour in function and call on script load
function runOnLoad() {
  // load history
  let history = localStorage.getItem('history')
  
  // if no history item set (initial load no commands), display banner and prompt
  if (!history) {
    const originalBanner = document.createElement('div');
    displayBanner(originalBanner);
    terminal.appendChild(originalBanner);
    displayPrompt();
    return;
  }
  history = JSON.parse(history);
  
  console.log("history on refresh:", history);
  
  // if clear is only item in history, refresh = fresh start
  if (!(Object.keys(history)[0] === "clear" && Object.keys(history).length > 1)) {
    const originalBanner = document.createElement('div');
    displayBanner(originalBanner);
    terminal.appendChild(originalBanner);
    localStorage.removeItem('history');
  }

  // TODO: load items from history and add to dom
  displayHistory(history);

  displayPrompt();
}

runOnLoad()