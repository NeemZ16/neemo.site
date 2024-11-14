import { displayBanner, handleHelp, handleDefault } from './handlers.js';
import { replacePrompt, displayPrompt } from './utils.js';

export const terminal = document.getElementById("terminal");
export let dir = "~";


export function processCommand(cmd) {
  // if empty do nothing
  if (!cmd) {
    return;
  }

  // remove currPrompt and replace input with p
  replacePrompt();

  // create response element and default message
  const response = document.createElement("p");
  response.classList.add("response");

  // set up local storage
  if (!localStorage.getItem("history")) {
    localStorage.setItem("history", []);
  }
  
  const splitCmd = cmd.split(' ');
  const command = splitCmd[0];
  const args = splitCmd.splice(1);

  if (command === 'help') {
    response.innerText = handleHelp(args);
  } else if (command === 'cd') {

  } else if (command === 'ls') {

  } else if (command === 'cat') {

  } else if (command === 'man') {

  } else if (command === 'banner') {
    displayBanner(response, args);
  } else if (command === 'whoisneem') {

  } else if (command === 'whoami') {
    response.innerText = 'guest';
  } else if (command === 'contact') {

  } else if (command === 'repo') {

  } else if (command === 'history') {

  } else if (command === 'clear') {

  } else {
    response.innerText = handleDefault(command);
  }

  const history = localStorage.getItem('history');

  // show response in terminal
  terminal.appendChild(response);
  displayPrompt();
}

// on load
displayPrompt();