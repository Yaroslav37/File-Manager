import fs from 'fs'; 
import { join, isAbsolute } from 'path';

export function pathExists(targetPath) {
  if (!fs.existsSync(targetPath)) {
    return false;
  }
  return true;
}

export function pathDetermine(targetPath) {
  let newPath;

  if (isAbsolute(targetPath)) {
    newPath = targetPath;
  } else {
    newPath = join(global.currentDirectoryPath, targetPath);
  }

  return newPath;
}
