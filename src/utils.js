import { terminal, dir, processCommand } from './index.js'
import { displayBanner, handleHelp, handleDefault, handleRepo, handleClear } from './handlers.js';

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

export function displayHistory(history) {
  console.log('loading history from: ', history);
  Object.entries(history).forEach(([key, value]) => {
    console.log("key:", key, "value:", value);
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
    lastCommand.innerHTML = key;

    const prompt = document.createElement("div");
    prompt.classList.add("prompt");
    prompt.appendChild(user);
    prompt.appendChild(domain);
    prompt.appendChild(directory);
    prompt.appendChild(lastCommand);
    terminal.appendChild(prompt);
  })
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

  // if command doesn't take arguments show noArgs message if args provided
  const noArgsCmds = ['banner', 'whoami', 'hostname', 'repo', 'history', 'clear', 'hello', 'hi'];
  if (noArgsCmds.includes(command) && args.length > 0) {
    response.innerText = `${command}: command does not support arguments`;
    return;
  }

  switch (command) {
    case 'hello':
    case 'hi':
      response.innerText = 'hi there! type \'help\' to see what you can do :)';
      break;
    case 'help':
      response.innerText = handleHelp(args);
      break;
    case 'cd':
      break;
    case 'ls':
      break;
    case 'cat':
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
      handleRepo(response);
      break;
    case 'history':
      break;
    case 'clear':
      handleClear();
      break;
    case 'echo':
      // HTML already being escaped when process command called
      response.innerHTML = args.join(" ");
      break;
    default:
      response.innerHTML = handleDefault(command);
      break;
  }
}