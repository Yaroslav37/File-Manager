const readline = require("readline");
const path = require("path");
const os = require("os");

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

function up(){
    const rootDirectoryPath = path.parse(os.homedir()).root;
    if (currentDirectoryPath !== rootDirectoryPath) {
        const parentDirectoryPath = path.dirname(currentDirectoryPath);
        currentDirectoryPath = parentDirectoryPath;
    } else {
        console.log("Already at the root folder");
    }
}

const username = getCommandLineArg("username");
console.log(`Welcome to the File Manager, ${username}!`);
let currentDirectoryPath = path.join(process.env.SystemDrive, process.env.HOMEPATH);
console.log(`You are currently in ${currentDirectoryPath}`);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "> "
});

rl.prompt();

rl.on("line", (line) => {
    if (line === "up") {
        up();
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
