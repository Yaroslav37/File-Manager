import fs from "fs";
import { join, parse, dirname } from "path";
import { homedir } from "os";

export function up() {
  const rootDirectoryPath = parse(homedir()).root;
  if (global.currentDirectoryPath !== rootDirectoryPath) {
    const parentDirectoryPath = dirname(global.currentDirectoryPath);
    global.currentDirectoryPath = parentDirectoryPath;
  } else {
    console.log("Already at the root folder");
  }
}

export function cd(targetPath) {
  let newDirectoryPath = pathDetermine(targetPath);

  if (pathExists(newDirectoryPath)) {
    global.currentDirectoryPath = newDirectoryPath;
  }
}

export function add(fileName) {
  const filePath = pathDetermine(fileName);

  if (!pathExists(filePath)) {
    fs.writeFileSync(filePath, "");
    console.log(`File ${fileName} created successfully.`);
  } else {
    console.log(`File ${fileName} already exists.`);
  }
}

export function ls() {
  const directoryContent = fs.readdirSync(global.currentDirectoryPath);

  const folders = [];
  const files = [];

  directoryContent.forEach((item) => {
    const itemPath = join(global.currentDirectoryPath, item);
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
