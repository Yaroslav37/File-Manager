import { createInterface } from "readline";
import { parse, dirname, isAbsolute, join } from "path";
import { homedir } from "os";
import fs from "fs";
import os from "os";

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
  let newDirectoryPath = pathDetermine(targetPath);

  if (pathExists(newDirectoryPath)) {
    currentDirectoryPath = newDirectoryPath;
  }
}

function add(fileName) {
  const filePath = pathDetermine(fileName);

  if (!pathExists(filePath)) {
    fs.writeFileSync(filePath, "");
    console.log(`File ${fileName} created successfully.`);
  } else {
    console.log(`File ${fileName} already exists.`);
  }
}

function ls() {
  const directoryContent = fs.readdirSync(currentDirectoryPath);

  const folders = [];
  const files = [];

  directoryContent.forEach((item) => {
    const itemPath = join(currentDirectoryPath, item);
    const itemStats = fs.statSync(itemPath);
    const itemType = itemStats.isDirectory() ? "Folder" : "File";
    const itemName = itemType === "Folder" ? item : item.split(".")[0];
    const itemExtension = itemType === "File" ? item.split(".")[1] : "";

    if (itemType === "Folder") {
      folders.push({ Name: `${itemName}.${itemExtension}`, Type: "directory" });
    } else {
      files.push({ Name: `${itemName}.${itemExtension}`, Type: "file" });
    }
  });

  const sortedFolders = folders.sort((a, b) => a.Name.localeCompare(b.Name));
  const sortedFiles = files.sort((a, b) => a.Name.localeCompare(b.Name));

  const sortedDirectoryContent = sortedFolders.concat(sortedFiles);

  console.table(sortedDirectoryContent);
}

function pathDetermine(targetPath) {
  let newPath;

  if (isAbsolute(targetPath)) {
    newPath = targetPath;
  } else {
    newPath = join(currentDirectoryPath, targetPath);
  }

  return newPath;
}

function cat(filePath) {
  if (!pathExists(filePath)) {
    return;
  }

  const readableStream = fs.createReadStream(filePath);

  readableStream.on("data", (chunk) => {
    console.log(chunk.toString());
  });

  readableStream.on("end", () => {
    console.log("File reading completed");
  });

  readableStream.on("error", (error) => {
    console.log(`Error reading file: ${error.message}`);
  });
}

function renameFile(targetPath, newFilename) {
  const filePath = pathDetermine(targetPath);
  if (!pathExists(filePath)) {
    return;
  }
  const newFilenamePath = pathDetermine(newFilename);
  fs.rename(filePath, newFilenamePath, (err) => {
    if (err) {
      console.log(`Error renaming file: ${err}`);
    } else {
      console.log(`File renamed successfully to ${newFilename}`);
    }
  });
}

function pathExists(targetPath) {
  if (!fs.existsSync(targetPath)) {
    console.log(`Operation failed: The system cannot find the path specified.`);
    return false;
  }
  return true;
}

function copyFile(sourceFilePath, destinationDirectoryPath) {
  const sourceFile = pathDetermine(sourceFilePath);
  const destinationDirectory = pathDetermine(destinationDirectoryPath);

  if (!pathExists(sourceFile)) {
    console.log(`Source file ${sourceFilePath} does not exist.`);
    return;
  }

  if (!pathExists(destinationDirectory)) {
    console.log(
      `Destination directory ${destinationDirectoryPath} does not exist.`
    );
    return;
  }

  const destinationFilePath = join(
    destinationDirectory,
    parse(sourceFile).base
  );

  fs.copyFile(sourceFile, destinationFilePath, (err) => {
    if (err) {
      console.log(`Operation failed: ${err}`);
      return false;
    } else {
      return true;
    }
  });
}

function deleteFile(filePath) {
  let isDeleted = false;
  fs.unlink(filePath, (err) => {
    if (err) {
      console.log(`Error deleting file: ${err}`);
    } else {
      isDeleted = true;
    }
  });
  return isDeleted;
}

function moveFile(sourceFilePath, destinationDirectoryPath) {
  if (!copyFile(sourceFilePath, destinationDirectoryPath)) {
    return false;
  }

  if (deleteFile(sourceFilePath)) {
    return true;
  } else {
    return false;
  }
}

function getCpuInfo() {
    const cpus = os.cpus();
    console.log(`Overall amount of CPUs: ${cpus.length}`);

    cpus.forEach((cpu, index) => {
        console.log(`CPU ${index + 1}:`);
        console.log(`  Model: ${cpu.model}`);
        console.log(`  Clock rate: ${cpu.speed / 1000} GHz`);
    });
}

function getEOL() {
    console.log(`Default End-Of-Line: ${os.EOL}`);
}

function getHomeDir() {
    console.log(`Home directory: ${homedir()}`);
}

function getUsername() {
    console.log(`Username: ${os.userInfo().username}`);
}

function getArchitecture() {
    console.log(`Architecture: ${os.arch()}`);
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
    ls();
  }

  if (line.startsWith("cat ")) {
    cat(pathDetermine(line.split(" ")[1]));
  }

  if (line.startsWith("add ")) {
    const fileName = line.split(" ")[1];
    add(fileName);
  }

  if (line.startsWith("rn ")) {
    const args = line.split(" ");
    const filePath = args[1];
    const newFilename = args[2];
    renameFile(filePath, newFilename);
  }

  if (line.startsWith("cp ")) {
    const args = line.split(" ");
    const sourceFilePath = args[1];
    const destinationDirectoryPath = args[2];
    if (copyFile(sourceFilePath, destinationDirectoryPath)) {
      console.log(
        `File ${sourceFilePath} copied to ${destinationDirectoryPath}`
      );
    }
  }

  if (line.startsWith("mv ")) {
    const args = line.split(" ");
    const sourceFilePath = args[1];
    const destinationDirectoryPath = args[2];
    if (moveFile(sourceFilePath, destinationDirectoryPath)) {
      console.log(
        `File ${sourceFilePath} moved to ${destinationDirectoryPath}`
      );
    }
  }

  if (line.startsWith("rm ")) {
    rl.prompt();
    const filePath = pathDetermine(line.split(" ")[1]);
    if (!pathExists(filePath)) {
      return;
    }
    let isDeleted = deleteFile(filePath);
    if (isDeleted) {
      console.log(`File ${filePath} deleted successfully`);
    }
  }

  if (line.startsWith("os ")){
    if (line === "os --EOL") {
        getEOL();
    }
    else if (line === "os --cpus") {
        getCpuInfo();
    }
    else if (line === "os --homedir"){
        getHomeDir();
    }
    else if (line === "os --username"){
        getUsername();
    }
    else if (line === "os --architecture"){
        getArchitecture();
    }
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
