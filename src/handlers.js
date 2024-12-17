import { fetchHelpContent } from "./utils.js";

const docs = await fetchHelpContent();
const helpTextContent = "Type 'help' for list of supported commands. THIS SITE IS A WORK IN PROGRESS!!!!";

// COMMAND: unrecognized
export function handleDefault(cmd) {
  // if not allowed show command not recognized
  return `${cmd}: command not recognized${helpTextContent}`;
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
              ${helpTextContent}`;
    }
  }

  // show help text for all commands
  return `SUPPORTED COMMANDS:
  - help [command] - shows detailed information for each command
  - cd - change directory
  - ls 
  - cat
  - echo - print a string to the terminal
  - banner - display default banner
  - whoisneem
  - whoami - display current user
  - hostname - display current hostname
  - contact - display links to email and linkedin
  - repo - open repo on github in new tab
  - history - print command history
  - clear - clear terminal and command history`;
}

// COMMAND: repo
export function handleRepo(res) {
  const URL = 'https://github.com/NeemZ16/neemo-emu';
  res.innerText = "Opening repository in new tab...";

  // open new tab and change text after 0.5s; return AFTER completion
  return new Promise((resolve) => {
    setTimeout(() => {
      window.open(URL, '_blank');
      res.innerText = "Opened repo in new tab!"
      resolve();
    }, 500);
  })
}

// COMMAND: clear
export function handleClear() {
  localStorage.removeItem('history');

  const terminal = document.getElementById("terminal");
  terminal.innerHTML = "";
}

// COMMAND: history
export function handleHistory(res) {
  let history = localStorage.getItem('history');
  if (!history) {
    res.innerHTML = "No history found";
    return;
  }

  history = JSON.parse(history);
  let resText = "";

  function genPad(idx) {
    const maxIndexWidth = String(history.length).length;
    let ret = String(idx);
    while (ret.length < maxIndexWidth) {
      ret = " " + ret;
    }
    return ret.replace(" ", "&nbsp;");
  }

  for (let i = 0; i < history.length; i++) {
    const obj = history[i];
    resText += `${genPad(i + 1)} ${obj.command}<br>`;
  }

  res.innerHTML = resText;
}
