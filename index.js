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
  console.log(cmd);
  
  // if empty do nothing
  if (!cmd) {
    return;
  }
  
  // create response element and default message
  const response = document.createElement("p");
  response.innerHTML = `${cmd.split(' ')[0]}: command not recognized<br>${helpTextContent}`;
  response.classList.add("response");

  // append response and display new prompt
  terminal.appendChild(response);
  displayPrompt();
}

// on load
displayPrompt();