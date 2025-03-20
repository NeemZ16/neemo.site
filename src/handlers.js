import { fetchHelpContent, escapeHTML, unEscapeHTML } from "./utils.js";

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
    // unsupported cmd arg
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

// COMMAND: contact
function handleContact(args, res) {
  if (args.length === 0) {
    const emailLink = document.createElement("a");
    emailLink.href = "mailto:neemzam2+site@gmail.com?subject=Site%20Message%20-%20";
    emailLink.target = "_blank";
    emailLink.textContent = "neemzam2[at]gmail.com";

    const githubLink = document.createElement("a");
    githubLink.href = "https://github.com/Neemz16";
    githubLink.target = "_blank";
    githubLink.textContent = "github.com/Neemz16";

    const linkedinLink = document.createElement("a");
    linkedinLink.href = "https://www.linkedin.com/in/neem-zaman";
    linkedinLink.target = "_blank";
    linkedinLink.textContent = "linkedin.com/in/neem-zaman";

    const email = document.createElement("p");
    email.textContent = "- Email: ";
    email.appendChild(emailLink);

    const github = document.createElement("p");
    github.textContent = "- GitHub: ";
    github.appendChild(githubLink);

    const linkedin = document.createElement("p");
    linkedin.textContent = "- LinkedIn: ";
    linkedin.appendChild(linkedinLink);

    res.appendChild(linkedin);
    res.appendChild(email);
    res.appendChild(github);

  } else if (args.length === 1 && args[0] === "-m") {
    res.innerText = "Please provide a message after '-m'."
  } else if (args[0] === "-m") {
    res.innerText = "IMPLEMENTATION IN PROGRESS";
  } else {
    res.innerText = `Usage: ${docs.contact.usage}. Type 'help contact' for more information.`;
  }
}

// COMMAND: ls
function handleLs(args, res) {
  let ret = "blog.html\tnotes.txt\tabout";
  if (args.length > 1) {
    ret = `Usage: ${docs.ls.usage}`;
  } else if (args.length === 1 && args[0] == "-a") {
    ret = ".secrets.txt\t" + ret;
  } else if (args.length === 1) {
    ret = `Usage: ${docs.ls.usage}. Type 'help ls' for more information.`;
  }

  const pre = document.createElement("pre");
  pre.innerText = ret;
  pre.classList.add("yellow");
  res.appendChild(pre);
}

// COMMAND: open
function handleOpen(args, res) {
  if (args.length === 0) {
    res.innerText = "Please choose which file you want to open. Type 'ls' to see available files.";
  } else if (args.length === 1) {
    // TODO: complete implementation
    let ret = "open: Requested file not found. Type 'ls' to see available files.";

    if (args[0] == "blog.html") {
      ret = "No blog entries yet!";
    } else if (args[0] == "notes.txt") {
      ret = "No notes yet!";
    } else if (args[0] == ".secrets.txt") {
      ret = "🥚";
    } else if (args[0] == "about") {
      ret = "IMPLEMENTATION IN PROGRESS";
    }

    res.innerText = ret;
  } else {
    res.innerText = `Usage: ${docs.open.usage}`;
  }
}

// COMMAND: about
function handleAbout(res) {
  const bio = document.createElement("p");
  bio.classList.add("limWidth");
  const projects = document.createElement("p");
  const skills = document.createElement("p");
  const img = document.createElement("img");
  
  // set img content
  img.src = "neem.png";
  img.alt = "Neem in front of plants";
  res.appendChild(img);

  // set bio content
  bio.innerHTML = "Hi! I'm <span class='green'>Neem</span> and I'm a <span class='yellow'>Fullstack Software Engineer</span>. ";
  bio.innerHTML += "I will be graduating from the <span class='green'>University at Buffalo</span> with a BS in <span class='yellow'>Computer Science</span> in <span class='green'>May 2025</span>. ";
  bio.innerHTML += "I enjoy tinkering with systems to figure out how they work, and I love <span class='yellow'>building</span> things (software, wood, 3D printing, fabric, anything really...)";
  res.appendChild(bio);
  
  // set skills content
  skills.innerHTML = "<br>My go-to <span class='green'>technologies</span>:";
  skills.innerHTML += "<br>- Languages: JavaScript, TypeScript, Python, Java";
  skills.innerHTML += "<br>- Databases: SQL (MySQL, PostgreSQL), MongoDB";
  skills.innerHTML += "<br>- Frameworks: React, Express, Flask, Django";
  res.appendChild(skills);

  // set projects content
  projects.innerHTML = "<br>Here are some <span class='green'>projects</span> I have worked on:";
  projects.innerHTML += "<br>- <a href='https://devu.app' target='_blank'>DevU</a> - Autograding platform for the CSE department at UB featuring an open API";
  projects.innerHTML += "<br>- <a href='https://unfold.studio' target='blank'>Unfold Studio</a> - Interactive storytelling platform developed by <a href='https://chrisproctor.net/' class='green'>Dr. Chris Proctor</a>";
  projects.innerHTML += "<br>- <a href=''>This site :)</a> - Feel free to explore, there are some hidden easter eggs...";
  projects.innerHTML += "<br>- <span class='green'>Ludu</span> - [IN PROGRESS] An online multiplayer version of the popular boardgame!";
  res.appendChild(projects);
  
  // show contact
  res.innerHTML += "<br><p class='green'>LINKS:</p>"
  handleContact([], res);
  
  res.innerHTML += "<br>";
  res.innerHTML += "To learn more, type 'open about'";
}

// COMMAND: echo
function handleEcho(args, res) {
  const escWriteOp = escapeHTML(">");
  const escAppOp = escapeHTML(">>");

  if (args.length >= 1 && (args[0] == escWriteOp || args[0] == escAppOp)) {
    res.innerText = `Usage: ${docs.echo.usage}. Type 'help echo' for more information.`;
  } else if (args.length >= 3 &&
    (args.includes(escWriteOp) || args.includes(escAppOp)) &&
    (args[0] != escWriteOp || args[0] != escAppOp)) {

    // parse content, operator, and filename
    const filename = unEscapeHTML(args[args.length - 1]);
    const op = args[args.length - 2];
    const content = unEscapeHTML(args.slice(0, args.length - 2).join(" "));

    // check action
    let action = "append";
    if (op == escWriteOp) {action = "write";}
    
    // placeholder filename
    res.innerText = `Failed to ${action} '${content}' to ${filename}. IMPLEMENTATION IN PROGRESS.`
  } else {
    // html already being escaped when processing request
    res.innerHTML = args.join(" ");
  }
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
  const noArgsCmds = ['banner', 'about', 'hostname', 'repo', 'history', 'clear', 'hello', 'hi', 'howdy'];
  if (noArgsCmds.includes(command) && args.length > 0) {
    response.innerText = `${command}: command does not support arguments`;
    return;
  }

  switch (command) {
    case 'hello':
    case 'howdy':
    case 'hi':
      response.innerText = 'hi there! type \'help\' to see what you can do :)';
      break;
    case 'help':
      handleHelp(args, response);
      break;
    case 'ls':
      handleLs(args, response);
      break;
    case 'open':
      handleOpen(args, response);
      break;
    case 'banner':
      displayBanner(response);
      break;
    case 'about':
      handleAbout(response);
      break;
    case 'whoami':
      response.innerText = 'guest';
      break;
    case 'hostname':
      response.innerText = window.location.hostname;
      break;
    case 'contact':
      handleContact(args, response);
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
      handleEcho(args, response);
      break;
    default:
      handleDefault(command, response);
      break;
  }
}