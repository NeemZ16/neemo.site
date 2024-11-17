import { replacePrompt, displayPrompt, handleInput } from './utils.js';

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

  handleInput(command, args, response)


  const history = localStorage.getItem('history');

  // show response in terminal
  terminal.appendChild(response);
  displayPrompt();
}

// on load
displayPrompt();