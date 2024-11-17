import { fetchHelpContent } from "./utils.js";

const docs = await fetchHelpContent();
const helpTextContent = "Type 'help' for list of supported commands";



// COMMAND: unrecognized
export function handleDefault(cmd) {
  // if not allowed show command not recognized
  return `${cmd}: command not recognized
  ${helpTextContent}`;
}

// COMMAND: banner
export function displayBanner(res) {
  const asciiArt = document.createElement("pre");
  asciiArt.innerHTML = `
     ____  ___  ___  ____ ___  ____     ____
    / __ \\/ _ \\/ _ \\/ __ \`__ \\/ __ \\   /_  /
   / / / /  __/  __/ / / / / / /_/ /    / /_
  /_/ /_/\\___/\\___/_/ /_/ /_/\\____/    /___/  v1.0.0
  
  `;

  const helpText = document.createElement("p");
  helpText.textContent = helpTextContent;

  // has to be appended before can insert help text element
  res.appendChild(asciiArt);
  asciiArt.insertAdjacentElement("afterend", helpText);
}

// COMMAND: help
export function handleHelp(args) {
  if (args.length > 1) {
    return `Usage: help [command]`;
  } 
  
  // show help text for single command if supported
  if (args.length === 1) {
    console.log("docs", docs);
    if (docs[args[0]]) {
      return docs[args[0]];
    } else {
      return `help: ${args[0]} is not a supported command
              ${helpTextContent}`
    }
  }

  // show help text for all commands
  return `SUPPORTED COMMANDS:
  - help [command] - shows detailed information for each command
  - cd
  - ls
  - cat
  - echo
  - banner - display default banner
  - whoisneem
  - whoami
  - contact - display links to email and linkedin
  - repo - open repo on github in new tab
  - history - print command history
  - clear - clear terminal and command history`;
}

