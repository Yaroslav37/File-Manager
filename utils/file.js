import fs from 'fs'; 
import { join, parse } from 'path';
import { pathExists, pathDetermine } from './pathCheck.js';

export function cat(filePath) {
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

export function renameFile(targetPath, newFilename) {
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

export function copyFile(sourceFilePath, destinationDirectoryPath) {
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

export function deleteFile(filePath) {
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

export function moveFile(sourceFilePath, destinationDirectoryPath) {
  if (!copyFile(sourceFilePath, destinationDirectoryPath)) {
    return false;
  }

  if (deleteFile(sourceFilePath)) {
    return true;
  } else {
    return false;
  }
}
