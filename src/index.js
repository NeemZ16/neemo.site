import { displayBanner, handleHelp} from './handlers.js';
import { escapeHTML } from './utils.js';

const terminal = document.getElementById("terminal");
export const helpTextContent = "Type 'help' for list of supported commands";
let dir = "~";

function replacePrompt() {
  const domain = document.createElement("span");
  domain.innerHTML = "@" + window.location.hostname;
  domain.classList.add("domain");

  const user = document.createElement("span");
  user.classList.add("user");
  user.innerHTML = "guest";

  const directory = document.createElement("span");
  directory.classList.add("directory");
  directory.innerHTML = ":" + dir + " $&nbsp;";

  const lastCommand = document.createElement("p");

  // get last input value
  const currInput = document.querySelector("#currPrompt input");
  lastCommand.textContent = currInput.value;
  
  // remove last prompt
  const lastPrompt = document.getElementById('currPrompt');
  lastPrompt.remove();

  // create prompt and add to screen
  const prompt = document.createElement("div");
  prompt.classList.add("prompt");
  prompt.appendChild(user);
  prompt.appendChild(domain);
  prompt.appendChild(directory);
  prompt.appendChild(lastCommand);
  terminal.appendChild(prompt);
}

function displayPrompt() {
  // create spans for prompt
  const domain = document.createElement("span");
  domain.innerHTML = "@" + window.location.hostname;
  domain.classList.add("domain");

  const user = document.createElement("span");
  user.classList.add("user");
  user.innerHTML = "guest";

  const directory = document.createElement("span");
  directory.classList.add("directory");
  directory.innerHTML = ":" + dir + " $&nbsp;";

  // create input and process command
  const input = document.createElement("input");
  input.setAttribute("spellcheck", "false");
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      processCommand(escapeHTML(input.value));
    }
  })

  // create prompt and add to screen
  const prompt = document.createElement("div");
  prompt.classList.add("prompt");
  prompt.id = 'currPrompt';
  prompt.appendChild(user);
  prompt.appendChild(domain);
  prompt.appendChild(directory);
  prompt.appendChild(input);
  terminal.appendChild(prompt);
  input.focus();
}

function processCommand(cmd) {
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

  } else if (command === 'contact') {

  } else if (command === 'repo') {

  } else if (command === 'history') {

  } else if (command === 'clear') {

  } else {
    // if not allowed show command not recognized
    response.innerText = `${splitCmd[0]}: command not recognized
                          ${helpTextContent}`;
  }

  const history = localStorage.getItem('history');

  // show response in terminal
  terminal.appendChild(response);
  displayPrompt();
}

// on load
displayPrompt();