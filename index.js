const terminal = document.getElementById("terminal");
const helpTextContent = "Type 'help' for list of supported commands";
let dir = "~";


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
    if (e.key==="Enter") {
      processCommand(input.value)
      input.value = "";
    }
  })
  
  // create prompt and add to screen
  const prompt = document.createElement("div");
  prompt.classList.add("prompt");
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
  
  // create response element and default message
  const response = document.createElement("p");
  response.classList.add("response");
  
  const allowed = ['help', 'cd', 'ls', 'cat', 'man', 'banner', 'whoisneem', 'whoami', 'contact', 'repo', 'history', 'clear', 'exit'];
  const splitCmd = cmd.split(' ');
  const command = splitCmd[0];
  
  if (!allowed.includes(command)) {
    // if not allowed show command not recognized
    response.innerHTML = `${splitCmd[0]}: command not recognized<br>${helpTextContent}`;
  } else if (command === 'help') {
    // show help text
    response.innerText = `SUPPORTED COMMANDS:
                          - help - shows all commands and what they do
                          - cd
                          - ls
                          - cat
                          - man [command] - shows manual for specific command
                          - banner - print ascii banner
                          - whoisneem - brief bio
                          - whoami - guest
                          - contact - output links to email and linkedin
                          - repo - open repo on github in new tab
                          - history - print command history
                          - clear - clear screen and display prompt, but do NOT clear history
                          - exit - clear command history and exit session`;

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

  // append response and display new prompt
  terminal.appendChild(response);
  displayPrompt();
}

// on load
displayPrompt();