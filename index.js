const readline = require('readline');

function getCommandLineArg(argName) {
    const args = process.argv.slice(2);
    let argValue;

    for(let i = 0; i < args.length; i++) {
        if(args[i].startsWith(`--${argName}=`)) {
            argValue = args[i].split('=')[1];
            break;
        }
    }

    return argValue;
}

const username = getCommandLineArg('username');
console.log(`Welcome to the File Manager, ${username}!`);