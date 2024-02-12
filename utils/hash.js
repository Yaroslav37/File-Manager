import crypto from "crypto";
import fs from "fs";
import { pathExists } from "./pathCheck.js";

export function calcHash(filePath) {
    if (!pathExists(filePath)) {
        console.log(`File ${filePath} does not exist.`);
        return;
    }

    const hash = crypto.createHash("sha256");
    const readableStream = fs.createReadStream(filePath);

    readableStream.on("data", (chunk) => {
        hash.update(chunk);
    });

    readableStream.on("end", () => {
        const fileHash = hash.digest("hex");
        console.log(`Hash for file ${filePath}: ${fileHash}`);
    });

    readableStream.on("error", (error) => {
        console.log(`Error reading file: ${error.message}`);
    });
}