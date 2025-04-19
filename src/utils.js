import { terminal, dir, processCommand, notesDB } from './index.js'
import { onValue } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";

/**
 * get json data for all commands
 * @returns {JSON} data
 */
export async function fetchHelpContent() {
  try {
    const response = await fetch('/help.json');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

export async function fetchAboutContent() {
  try {
    const response = await fetch('/about.json');
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
  input.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
      await processCommand(escapeHTML(input.value));
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

export function formatDate(isoString) {
  const date = new Date(isoString);
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

  // get date components
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // format digits to be 2 digit always
  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  // return final formatted string
  return `${month} ${formattedDay}, ${year} - ${formattedHours}:${formattedMinutes}`;
}

// Function to fetch notes and return them as a Promise
export function fetchNotes() {
  return new Promise((resolve, reject) => {
    let notes = [];

    onValue(notesDB, (snapshot) => {
      notes = [];

      // Add some default notes
      notes.push("hello world!");
      notes.push("computer bugs started with actual bugs");
      notes.push("have you tried 'ls -a' yet?");
      notes.push("leave a note with 'echo [content] >> notes.txt'");

      // Loop through the Firebase snapshot and add the notes
      if (snapshot.val()) {
        Object.entries(snapshot.val()).forEach(([key, value]) => {
          notes.push(`${formatDate(value.createdAt)} - ${value.content}`);
        });
      }

      // Resolve the Promise with the notes array
      resolve(notes);
    }, (error) => {
      // Handle any errors (if needed)
      reject(error);
    });
  });
}

export async function sendEmail(content, sender) {
  const templateParams = {
    name: sender,
    content: content,
  }
  const serviceID = "service_751j1hg";
  const templateID = "template_j5crotn";

  try {
    const res = await emailjs.send(serviceID, templateID, templateParams);
    return res;
  } catch (err) {
    return `Failed to send message. Error: ${err}`;
  }
}

export function simulateCommand(command) {
  // set input value
  const input = document.querySelector("input");
  input.value = command;

  // press enter to execute command
  const enterDown = new KeyboardEvent("keydown", {
    key: "Enter",
    "keyCode": 13,
    "which": 13,
    "code": "Enter",
    bubbles: true
  });

  input.dispatchEvent(enterDown);
}