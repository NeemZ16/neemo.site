const terminal = document.getElementById("terminal");
let dir = "~";

// on load
displayPrompt();


function displayBanner() {
  const asciiArt = document.createElement("pre");
  asciiArt.innerHTML = `
   ____  ___  ___  ____ ___  ____     ____
  / __ \\/ _ \\/ _ \\/ __ \`__ \\/ __ \\   /_  /
 / / / /  __/  __/ / / / / / /_/ /    / /_
/_/ /_/\\___/\\___/_/ /_/ /_/\\____/    /___/  v1.0.0\n\n\n`;

  const helpText = document.createElement("p")
  helpText.textContent = "Type 'help' for list of supported commands";

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

  // create textarea
  const input = document.createElement("input");


  // create prompt
  const prompt = document.createElement("div");
  prompt.classList.add("prompt");
  prompt.appendChild(user);
  prompt.appendChild(domain);
  prompt.appendChild(directory);
  prompt.appendChild(input);
  terminal.appendChild(prompt);
}