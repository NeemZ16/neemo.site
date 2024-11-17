import { terminal, dir, processCommand } from './index.js'
import { displayBanner, handleHelp, handleDefault } from './handlers.js';

/**
 * get json data for all commands
 * @returns {JSON} data
 */
export async function fetchHelpContent() {
  try {
    const response = await fetch('src/help.json');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

export function escapeHTML(input) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function replacePrompt() {
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

export function displayPrompt() {
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

function noArgs(cmd) {
  return `${cmd}: command does not support arguments`;
}

/**
 * Handles input and calls appropriate handler function. 
 * Sets response innerText.
 * 
 * @param {string} command 
 * @param {Array<string>} args 
 * @param {HTMLParagraphElement} response 
 */
export function handleInput(command, args, response) {

  const noArgsCmds = ['banner', 'whoami', 'hostname', 'repo', 'history', 'clear'];
  if (noArgsCmds.includes(command) && args.length > 0) {
    response.innerText = noArgs(command);
    return;
  }

  switch (command) {
    case 'help':
      response.innerText = handleHelp(args);
      break;
    case 'cd':
      break;
    case 'ls':
      break;
    case 'cat':
      break;
    case 'man':
      break;
    case 'banner':
      displayBanner(response);
      break;
    case 'whoisneem':
      break;
    case 'whoami':
      response.innerText = 'guest';
      break;
    case 'hostname':
      response.innerText = window.location.hostname;
      break;
    case 'contact':
      break;
    case 'repo':
      break;
    case 'history':
      break;
    case 'clear':
      break;
    case 'echo':
      break;
    default:
      response.innerText = handleDefault(command);
      break;
  }

}