import { helpTextContent } from "./index.js";
import { fetchHelpContent } from "./utils.js";

const docs = await fetchHelpContent();

function noArgs(cmd) {
  return `${cmd}: command does not support arguments`;
}

export function displayBanner(res, args) {
  if (args.length > 0) {
    res.innerText = noArgs("banner");
    return
  }

  const asciiArt = document.createElement("pre");
  asciiArt.innerHTML = `
     ____  ___  ___  ____ ___  ____     ____
    / __ \\/ _ \\/ _ \\/ __ \`__ \\/ __ \\   /_  /
   / / / /  __/  __/ / / / / / /_/ /    / /_
  /_/ /_/\\___/\\___/_/ /_/ /_/\\____/    /___/  v1.0.0\n\n\n`;

  const helpText = document.createElement("p");
  helpText.textContent = helpTextContent;

  // has to be appended before can insert help text element
  res.appendChild(asciiArt);
  asciiArt.insertAdjacentElement("afterend", helpText);
}

export function handleHelp(args) {
  if (args.length > 1) {
    return `Usage: help [command]`;
  } 
  
  // show help text for single command if supported
  if (args.length === 1) {
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
  - banner - display banner
  - whoisneem
  - whoami
  - contact - display links to email and linkedin
  - repo - open repo on github in new tab
  - history - print command history
  - clear - clear terminal and command history`;
}

