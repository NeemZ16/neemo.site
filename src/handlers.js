import { fetchHelpContent, fetchAboutContent, escapeHTML, fetchNotes, sendEmail } from "./utils.js";
import { notesDB } from "./index.js";
import { push } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";

const docs = await fetchHelpContent();
const about = await fetchAboutContent();
const helpTextContent = "Type <button onClick=\"simulateCommand('help')\">'help'</button> for list of supported commands.";

// COMMAND: unrecognized
function handleDefault(cmd, res) {
  // if not allowed show command not recognized
  res.innerHTML = `${cmd}: command not recognized. ${helpTextContent}`;
}

// COMMAND: banner
export function displayBanner(res) {
  const asciiArt = document.createElement("pre");
  asciiArt.innerHTML = `
     ____  ___  ___  ____ ___     ____
    / __ \\/ _ \\/ _ \\/ __ \`__ \\   /_  /
   / / / /  __/  __/ / / / / /    / /_
  /_/ /_/\\___/\\___/_/ /_/ /_/    /___/  v1.1.0
  `;

  const helpText = document.createElement("p");
  helpText.innerHTML = helpTextContent;

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
      res.innerHTML = `${helpCmd}: command not recognized. ${helpTextContent}`;
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

    returnHelp.innerHTML = helpText;
    res.appendChild(returnHelp);

  } else {
    // show help text for all commands
    let helpText = "SUPPORTED COMMANDS:";
    for (const [key, value] of Object.entries(docs)) {
      helpText += `<p>- <button class="yellow" onClick="simulateCommand('${key}')">${key}</button> - ${value.base}</p>`;
    };
    helpText += "<br><p>Type 'help [command]' for more information on a specific command</p>";
    res.innerHTML = helpText;
  }
}

// COMMAND: repo
function handleRepo(res) {
  const URL = 'https://github.com/NeemZ16/neemo.site';
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
async function handleContact(args, res) {
  if (args.length === 0) {
    const emailLink = document.createElement("a");
    emailLink.href = "mailto:neemzam2+site@gmail.com?subject=Site%20Message%20-%20";
    emailLink.target = "_blank";
    emailLink.textContent = "neemzam2[at]gmail.com";

    const githubLink = document.createElement("a");
    githubLink.href = "https://github.com/Neemz16";
    githubLink.target = "_blank";
    githubLink.textContent = "github.com/NeemZ16";

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
    // parse content and sender
    let fromIndex = args.length;
    let sender = "@default_sender";

    if (args.includes("-from") && args.indexOf("-from") === args.length - 1) {
      // if it is the last element...
      res.innerText = "Please provide value for '-from' argument";
      return;
    } else if (args.includes("-from")) {
      // else join all the items in arg after that index
      fromIndex = args.indexOf("-from");
      sender = args.slice(fromIndex + 1).join(" ").trim();
    }

    const content = args.slice(1, fromIndex).join(" ").trim()
    if (!content) {
      res.innerText = `Please provide message content`;
      return;
    } else if (!sender) {
      res.innerText = `Please provide message sender`;
      return;
    }

    try {
      const response = await sendEmail(content, sender);
      if (response.status == 200) {
        res.innerText = "Message sent successfully!";
      } else {
        res.innerText = "Unable to send message :(";
      }
    } catch (err) {
      res.innerText = `Failed to send message. Error: ${err}`;
    }

  } else {
    res.innerHTML = `Usage: ${docs.contact.usage}. Type <button onClick="simulateCommand(help contact)">'help contact'</button> for more information.`;
  }
}

// COMMAND: ls
function handleLs(args, res) {
  let ret = "<button class='lsItem' onClick=\"simulateCommand('open blog.html')\">blog.html</button>";
  ret += "\t<button class='lsItem' onClick=\"simulateCommand('open notes.txt')\">notes.txt</button>";
  ret += "\t<button class='lsItem' onClick=\"simulateCommand('open about')\">about</button>";
  if (args.length > 1) {
    ret = `Usage: ${docs.ls.usage}`;
  } else if (args.length === 1 && args[0] == "-a") {
    ret = "<button class='lsItem' onClick=\"simulateCommand('open .secrets.txt')\">.secrets.txt</button>\t" + ret;
  } else if (args.length === 1) {
    ret = `Usage: ${docs.ls.usage}. Type <button onClick="simulateCommand(help ls)">'help ls'</button> for more information.`;
  }

  const pre = document.createElement("pre");
  pre.innerHTML = ret;
  pre.classList.add("yellow");
  res.appendChild(pre);
}

// COMMAND: open
async function handleOpen(args, res) {
  if (args.length === 0) {
    res.innerHTML = `Usage: ${docs.open.usage}. Type <button onClick=\"simulateCommand('ls')\">'ls'</button> to see available files.`;
  } else if (args.length === 1) {
    let ret = "open: Requested file not found. Type <button onClick=\"simulateCommand('ls')\">'ls'</button> to see available files.";

    if (args[0] == "blog.html") {
      ret = "No blog entries yet!";

    } else if (args[0] == "notes.txt") {
      try {
        const notes = await fetchNotes();
        ret = "NOTES:";
        for (const note of notes) {
          ret += `<br>- ${note}`;
        }
      } catch (err) {
        ret = `Unable to fetch notes. Error: ${err}`;
      }
    } else if (args[0] == ".secrets.txt") {
      ret = "🥚";

    } else if (args[0] == "about") {
      handleAbout([], res);
      return;
    }

    res.innerHTML = ret;
  } else {
    res.innerText = `Usage: ${docs.open.usage}`;
  }
}

// COMMAND: about
function handleAbout(args, res) {
  if (args.length == 0) {
    const bio = document.createElement("div");
    const img = document.createElement("img");

    // set img content
    img.src = "neem.png";
    img.alt = "Neem in front of plants";
    res.appendChild(img);
    res.innerHTML += "<br>";

    // set bio
    const intro = document.createElement("p");
    intro.classList.add("limWidth");
    intro.innerHTML = about.bio.intro;
    bio.appendChild(intro);
    bio.innerHTML += "<br>";

    const teach = document.createElement("p");
    teach.classList.add("limWidth");
    teach.innerHTML = about.bio.teaching;
    bio.appendChild(teach);
    bio.innerHTML += "<br>";

    const funFacts = document.createElement("div");
    funFacts.innerHTML += "Here are some <span class='yellow'>fun facts</span> about me:"
    funFacts.classList.add("limWidth");
    about.bio["selected fun facts"].forEach(fact => {
      const listItem = document.createElement("p");
      listItem.innerHTML = fact;
      funFacts.appendChild(listItem);
    });
    bio.appendChild(funFacts);
    bio.innerHTML += "<br>";

    // add bio
    res.appendChild(bio);
    
    // show contact
    res.innerHTML += "<p class='green'>LINKS:</p>"
    handleContact([], res);
    res.innerHTML += "<br>";

    res.innerHTML += "<button onClick=\"simulateCommand('about -proj')\">See Projects</button>";
    res.innerHTML += "<br>"
    res.innerHTML += "<button onClick=\"simulateCommand('about -skills')\">See Skills</button>";
  
  } else if (args.length == 1) {
    if (args[0] == "-proj") {
      const projects = document.createElement("div");
      projects.innerText = "These are some projects I have worked on:";

      for (const proj of about.projects) {
        const project = document.createElement("div");
        const title = document.createElement("p");
        title.innerHTML = `<a href="${proj.link}" target="_blank">${proj.title}</a>`;
        const description = document.createElement("p");
        description.innerHTML = "- <span class=\"green\">Description:</span> " + proj.description;
        const technologies = document.createElement("p");
        technologies.innerHTML = "- <span class=\"green\">Technologies:</span> " + proj.technologies;
        const tags = document.createElement("p");
        tags.innerHTML = "Tags: ";
        for (const tag of proj.tags) {
          tags.innerHTML += `<span class="yellow">#${tag}</span> `
        }
        project.appendChild(title);
        project.appendChild(description);
        project.appendChild(technologies);
        project.appendChild(tags);
        project.innerHTML += "<br>"
        projects.appendChild(project);
        projects.classList.add("limWidth");
      }

      res.appendChild(projects);
    
    } else if (args[0] == "-skills") {
      const skills = document.createElement("div");
      skills.innerHTML = "While I believe in choosing the <span class=\"green\">best tool for the job</span>, these are some <span class=\"green\">I work with often:</span>";
      
      for (const [key, value] of Object.entries(about.skills)) {
        const category = document.createElement("p");
        category.innerHTML = `<span class="yellow">${key}:</span> ${value}`;
        skills.appendChild(category);
      }
      res.appendChild(skills);
    
    } else {
      res.innerText = `Usage: ${docs.about.usage}`;
    }
  } else {
    res.innerText = `Usage: ${docs.about.usage}`;
  }
}

// COMMAND: echo
function handleEcho(args, res) {
  const escAppOp = escapeHTML(">>");

  if (args.length >= 1 && args[0] == escAppOp) {
    res.innerText = `Usage: ${docs.echo.usage}. Type <button onClick="simulateCommand('help echo')">'help echo'</button> for more information.`;
  } else if (args.length >= 3 && args.includes(escAppOp) && args[0] != escAppOp) {

    // parse content, operator, and filename
    const filename = args[args.length - 1];
    const op = args[args.length - 2];
    const content = args.slice(0, args.length - 2).join(" ").trim();

    if (!content) {
      res.innerText = "No content provided.";
      return
    }

    if (filename != "notes.txt") {
      res.innerText = `echo: Permission Denied - Cannot edit or create ${filename} as guest user.`;
      return
    }

    // add content to db
    let message = {};
    message.content = content;
    message.createdAt = new Date().toISOString();
    push(notesDB, message)
      .then(res.innerHTML = `Added <span class="green">'${content}'</span> to <span class="yellow">${filename}</span>!`)
      .catch((e) => {
        res.innerHTML = `Failed to append '${content}' to ${filename}. Error: ${e}.`;
      })

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
export async function handleInput(command, args, response) {

  // if command doesn't take arguments show noArgs message if args provided
  const noArgsCmds = ['banner', 'hostname', 'repo', 'history', 'clear', 'hello', 'hi', 'howdy'];
  if (noArgsCmds.includes(command) && args.length > 0) {
    response.innerText = `${command}: command does not support arguments`;
    return response;
  }

  switch (command) {
    case 'hello':
    case 'howdy':
    case 'hi':
      response.innerHTML = "hi there! type <button onClick=\"simulateCommand('help')\">'help'</button> to see what you can do :)";
      break;
    case 'help':
      handleHelp(args, response);
      break;
    case 'ls':
      handleLs(args, response);
      break;
    case 'open':
      await handleOpen(args, response);
      break;
    case 'banner':
      displayBanner(response);
      break;
    case 'about':
      handleAbout(args, response);
      break;
    case 'whoami':
      response.innerText = 'guest';
      break;
    case 'hostname':
      response.innerText = window.location.hostname;
      break;
    case 'contact':
      await handleContact(args, response);
      break;
    case 'repo':
      await handleRepo(response);
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
  return response;
}