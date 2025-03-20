import { terminal, dir, processCommand } from './index.js'

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

export function unEscapeHTML(input) {
  return input
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '\"')
    .replaceAll("&#039;", "\'");
}

export function replacePrompt() {
  const [domain, user, directory] = getPromptElements();

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
  const [domain, user, directory] = getPromptElements();

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
  // display each command and response
  for (let i = 0; i < history.length; i++) {
    const req = history[i].command;
    const res = history[i].response;

    const [domain, user, directory] = getPromptElements();

    const lastCommand = document.createElement("p");
    lastCommand.innerHTML = req;

    const lastResponse = document.createElement("p");
    lastResponse.innerHTML = res;
    lastResponse.classList.add("response");

    const prompt = document.createElement("div");
    prompt.classList.add("prompt");
    prompt.appendChild(user);
    prompt.appendChild(domain);
    prompt.appendChild(directory);
    prompt.appendChild(lastCommand);
    terminal.appendChild(prompt);
    terminal.appendChild(lastResponse);
  }
}

function getPromptElements() {
  const domain = document.createElement("span");
  domain.innerHTML = "@" + window.location.hostname;
  domain.classList.add("domain", "green");

  const user = document.createElement("span");
  user.classList.add("user", "green");
  user.innerHTML = "guest";

  const directory = document.createElement("span");
  directory.classList.add("directory");
  directory.innerHTML = ":" + dir + " $&nbsp;";

  return [domain, user, directory];
}