import { createInterface } from "readline";
import { pathDetermine, pathExists } from "./utils/pathCheck.js";
import { calcHash } from "./utils/hash.js";
import {
  getEOL,
  getHomeDir,
  getUsername,
  getArchitecture,
  getCpuInfo,
} from "./utils/os.js";
import { up, add, ls, cd } from "./utils/filesystem.js";
import { getCommandLineArg } from "./utils/parseArg.js";
import {
  cat,
  renameFile,
  copyFile,
  deleteFile,
  moveFile,
} from "./utils/file.js";
import { compressFile, decompressFile } from "./utils/zip.js";

const username = getCommandLineArg("username");
console.log(`Welcome to the File Manager, ${username}!`);

global.currentDirectoryPath = join(
  process.env.SystemDrive,
  process.env.HOMEPATH
);

console.log(`You are currently in ${currentDirectoryPath}`);

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> ",
});

rl.prompt();

rl.on("line", (line) => {
  if (line === ".exit") {
    rl.close();
  } else if (line === "up") {
    up();
  } else if (line.startsWith("cd ")) {
    const targetPath = line.split(" ")[1];
    cd(targetPath);
  } else if (line === "ls") {
    ls();
  } else if (line.startsWith("cat ")) {
    cat(pathDetermine(line.split(" ")[1]));
  } else if (line.startsWith("add ")) {
    const fileName = line.split(" ")[1];
    add(fileName);
  } else if (line.startsWith("rn ")) {
    const args = line.split(" ");
    const filePath = args[1];
    const newFilename = args[2];
    renameFile(filePath, newFilename);
  } else if (line.startsWith("cp ")) {
    const args = line.split(" ");
    const sourceFilePath = args[1];
    const destinationDirectoryPath = args[2];
    if (copyFile(sourceFilePath, destinationDirectoryPath)) {
      console.log(
        `File ${sourceFilePath} copied to ${destinationDirectoryPath}`
      );
    }
  } else if (line.startsWith("mv ")) {
    const args = line.split(" ");
    const sourceFilePath = args[1];
    const destinationDirectoryPath = args[2];
    if (moveFile(sourceFilePath, destinationDirectoryPath)) {
      console.log(
        `File ${sourceFilePath} moved to ${destinationDirectoryPath}`
      );
    }
  } else if (line.startsWith("rm ")) {
    rl.prompt();
    const filePath = pathDetermine(line.split(" ")[1]);
    if (!pathExists(filePath)) {
      return;
    }
    let isDeleted = deleteFile(filePath);
    if (isDeleted) {
      console.log(`File ${filePath} deleted successfully`);
    }
  } else if (line.startsWith("os ")) {
    if (line === "os --EOL") {
      getEOL();
    } else if (line === "os --cpus") {
      getCpuInfo();
    } else if (line === "os --homedir") {
      getHomeDir();
    } else if (line === "os --username") {
      getUsername();
    } else if (line === "os --architecture") {
      getArchitecture();
    }
  } else if (line.startsWith("hash ")) {
    const filePath = pathDetermine(line.split(" ")[1]);
    calcHash(filePath);
  } else if (line.startsWith("compress ")) {
    const args = line.split(" ");
    const sourceFilePath = args[1];
    const destinationFilePath = args[2];
    compressFile(sourceFilePath, destinationFilePath);
  } else if (line.startsWith("decompress ")) {
    const args = line.split(" ");
    const sourceFilePath = args[1];
    const destinationFilePath = args[2];
    decompressFile(sourceFilePath, destinationFilePath);
  } else {
    console.log("Invalid input");
  }

  rl.prompt();

  console.log(`You are currently in ${currentDirectoryPath}`);
});

rl.on("close", () => {
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);
  process.exit(0);
});
