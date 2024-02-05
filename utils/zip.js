import zlib from "zlib";
import fs from "fs";
import { pathDetermine, pathExists } from "./pathCheck.js";

export function compressFile(sourceFilePath, destinationFilePath) {
    const sourceFile = pathDetermine(sourceFilePath);
    const destinationFile = pathDetermine(destinationFilePath);

    if (!pathExists(sourceFile)) {
        console.log(`Source file ${sourceFilePath} does not exist.`);
        return;
    }

    const readStream = fs.createReadStream(sourceFile);
    const writeStream = fs.createWriteStream(destinationFile);
    const compressStream = zlib.createBrotliCompress();

    readStream.pipe(compressStream).pipe(writeStream);

    writeStream.on("finish", () => {
        console.log(`File compressed successfully to ${destinationFilePath}`);
    });

    writeStream.on("error", (err) => {
        console.log(`Error compressing file: ${err}`);
    });
}

export function decompressFile(sourceFilePath, destinationFilePath) {
    const sourceFile = pathDetermine(sourceFilePath);
    const destinationFile = pathDetermine(destinationFilePath);

    if (!pathExists(sourceFile)) {
        console.log(`Source file ${sourceFilePath} does not exist.`);
        return;
    }

    const readStream = fs.createReadStream(sourceFile);
    const writeStream = fs.createWriteStream(destinationFile);
    const decompressStream = zlib.createBrotliDecompress();

    readStream.pipe(decompressStream).pipe(writeStream);

    writeStream.on("finish", () => {
        console.log(`File decompressed successfully to ${destinationFilePath}`);
    });

    writeStream.on("error", (err) => {
        console.log(`Error decompressing file: ${err}`);
    });
}