const terminal = document.getElementById("terminal");
const helpTextContent = "Type 'help' for list of supported commands";
let dir = "~";

function escapeHTML(input) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

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

function displayBanner() {
  const asciiArt = document.createElement("pre");
  asciiArt.innerHTML = `
   ____  ___  ___  ____ ___  ____     ____
  / __ \\/ _ \\/ _ \\/ __ \`__ \\/ __ \\   /_  /
 / / / /  __/  __/ / / / / / /_/ /    / /_
/_/ /_/\\___/\\___/_/ /_/ /_/\\____/    /___/  v1.0.0\n\n\n`;

  const helpText = document.createElement("p")
  helpText.textContent = helpTextContent;

  terminal.appendChild(asciiArt);
  asciiArt.insertAdjacentElement("afterend", helpText);
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

  const allowed = ['help', 'cd', 'ls', 'cat', 'banner', 'whoisneem', 'whoami', 'contact', 'repo', 'history', 'clear', 'exit'];
  const splitCmd = cmd.split(' ');
  const command = splitCmd[0];

  // set up local storage
  if (!localStorage.getItem("history")) {
    localStorage.setItem("history", []);
  }

  if (!allowed.includes(command)) {
    // if not allowed show command not recognized
    response.innerHTML = `${splitCmd[0]}: command not recognized<br>${helpTextContent}`;
  } else if (command === 'help') {
    // show help text
    response.innerText = `SUPPORTED COMMANDS:
                          - help [command] - shows all commands and what they do
                          - cd
                          - ls
                          - cat
                          - banner - display banner
                          - whoisneem
                          - whoami
                          - contact - display links to email and linkedin
                          - repo - open repo on github in new tab
                          - history - print command history
                          - clear - clear terminal and command history
                          - exit - clear command history and close window`;

  } else if (command === 'cd') {

  } else if (command === 'ls') {

  } else if (command === 'cat') {

  } else if (command === 'man') {

  } else if (command === 'banner') {
    displayBanner();
  } else if (command === 'whoisneem') {

  } else if (command === 'whoami') {

  } else if (command === 'contact') {

  } else if (command === 'repo') {

  } else if (command === 'history') {

  } else if (command === 'clear') {

  } else if (command === 'exit') {
    
  }

  const history = localStorage.getItem('history');
  console.log(history);

  // show response in terminal
  terminal.appendChild(response);
  displayPrompt();
}

// on load
displayPrompt();