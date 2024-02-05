import os from "os";

export function getEOL() {
  console.log(`Default End-Of-Line: ${os.EOL}`);
}

export function getHomeDir() {
  console.log(`Home directory: ${os.homedir()}`);
}

export function getUsername() {
  console.log(`Username: ${os.userInfo().username}`);
}

export function getArchitecture() {
  console.log(`Architecture: ${os.arch()}`);
}

export function getCpuInfo() {
  const cpus = os.cpus();
  console.log(`Overall amount of CPUs: ${cpus.length}`);

  cpus.forEach((cpu, index) => {
    console.log(`CPU ${index + 1}:`);
    console.log(`  Model: ${cpu.model}`);
    console.log(`  Clock rate: ${cpu.speed / 1000} GHz`);
  });
}
