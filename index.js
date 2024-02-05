import { createInterface } from "readline";
import { parse, dirname, isAbsolute, join } from "path";
import { homedir } from "os";
import fs from "fs";

function getCommandLineArg(argName) {
  const args = process.argv.slice(2);
  let argValue;

  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith(`--${argName}=`)) {
      argValue = args[i].split("=")[1];
      break;
    }
  }

  return argValue;
}

function up() {
  const rootDirectoryPath = parse(homedir()).root;
  if (currentDirectoryPath !== rootDirectoryPath) {
    const parentDirectoryPath = dirname(currentDirectoryPath);
    currentDirectoryPath = parentDirectoryPath;
  } else {
    console.log("Already at the root folder");
  }
}

function cd(targetPath) {
  let newDirectoryPath;

  if (isAbsolute(targetPath)) {
    newDirectoryPath = targetPath;
  } else {
    newDirectoryPath = join(currentDirectoryPath, targetPath);
  }

  if (existsSync(newDirectoryPath)) {
    currentDirectoryPath = newDirectoryPath;
  } else {
    console.log(`Operation failed: The system cannot find the path specified.`);
  }
}

const username = getCommandLineArg("username");
console.log(`Welcome to the File Manager, ${username}!`);
let currentDirectoryPath = join(process.env.SystemDrive, process.env.HOMEPATH);
console.log(`You are currently in ${currentDirectoryPath}`);

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> ",
});

rl.prompt();

rl.on("line", (line) => {
  if (line === "up") {
    up();
  }

  if (line.startsWith("cd ")) {
    const targetPath = line.split(" ")[1];
    cd(targetPath);
  }

  if (line === "ls") {
    const directoryContent = fs.readdirSync(currentDirectoryPath);

    directoryContent.forEach((item) => {
      const itemPath = join(currentDirectoryPath, item);
      const itemStats = fs.statSync(itemPath);
      const itemType = itemStats.isDirectory() ? "Folder" : "File";
      const itemName = itemType === "Folder" ? item : item.split(".")[0];
      const itemExtension = itemType === "File" ? item.split(".")[1] : "";
      console.log(`${itemType}: ${itemName}.${itemExtension}`);
    });
  }

  rl.prompt();

  if (line === ".exit") {
    rl.close();
  }
  // } else if (line === ".help") {
  //     console.log(`Received command: ${line}`);
  // } else {
  //     console.log("Invalid input");
  // }

  console.log(`You are currently in ${currentDirectoryPath}`);
});

rl.on("close", () => {
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);
  process.exit(0);
});
