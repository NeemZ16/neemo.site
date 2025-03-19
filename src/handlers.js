import { fetchHelpContent } from "./utils.js";

const docs = await fetchHelpContent();
const helpTextContent = "Type 'help' for list of supported commands.";

// COMMAND: unrecognized
function handleDefault(cmd, res) {
  // if not allowed show command not recognized
  res.innerText = `${cmd}: command not recognized. ${helpTextContent}`;
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
function handleHelp(args, res) {
  if (args.length > 1) {
    // show usage hint for help
    res.innerText = `Usage: ${docs.help.usage}`;

  } else if (args.length === 1) {
    // unsupported cmd
    const helpCmd = args[0];
    if (!(helpCmd in docs)) {
      res.innerText = `${helpCmd}: command not recognized. ${helpTextContent}`;
      return
    }
    
    // show base
    const returnHelp = document.createElement("pre");
    let helpText = `${helpCmd}: ${docs[helpCmd].base}`
    
    // show options
    if (Object.keys(docs[helpCmd].options).length > 0) {
      helpText += "\n\nOptions:"
      for (const [key, value] of Object.entries(docs[helpCmd].options)) {
        helpText += `\n  ${key}: ${value}`
      }
    }

    // show usage
    helpText += `\n\nUsage: ${docs[helpCmd].usage}`

    returnHelp.innerText = helpText;
    res.appendChild(returnHelp);

  } else {
    // show help text for all commands
    let helpText = "SUPPORTED COMMANDS:";
    for (const [key, value] of Object.entries(docs)) {
      helpText += `\n- ${key} - ${value.base}`
    };
    res.innerText = helpText;
  }
}

// COMMAND: repo
function handleRepo(res) {
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
function handleClear() {
  localStorage.removeItem('history');

  const terminal = document.getElementById("terminal");
  terminal.innerHTML = "";
}

// COMMAND: history
function handleHistory(res) {
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

function handleContact(res) {
  res.innerText = "IMPLEMENTATION IN PROGRESS";
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
      handleHelp(args, response);
      break;
    case 'ls':
      break;
    case 'open':
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
      handleContact(response);
      break;
    case 'repo':
      handleRepo(response);
      break;
    case 'history':
      handleHistory(response);
      break;
    case 'clear':
      handleClear();
      break;
    case 'echo':
      // HTML already being escaped when process command called
      response.innerHTML = args.join(" ");
      break;
    default:
      handleDefault(command, response);
      break;
  }
}