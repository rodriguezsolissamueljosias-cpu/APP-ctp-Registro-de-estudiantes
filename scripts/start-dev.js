const { spawn } = require('child_process');
const net = require('net');
const path = require('path');

function getNpmCommand() {
  return process.platform === 'win32' ? 'npm.cmd' : 'npm';
}

function isPortFree(port) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(500);

    socket.once('connect', () => {
      socket.destroy();
      resolve(false);
    });

    socket.once('timeout', () => {
      socket.destroy();
      resolve(true);
    });

    socket.once('error', (error) => {
      if (error.code === 'ECONNREFUSED' || error.code === 'EHOSTUNREACH') {
        resolve(true);
      } else {
        resolve(false);
      }
    });

    socket.connect(port, '127.0.0.1');
  });
}

async function getAvailablePort(startPort, checkPort = isPortFree) {
  let port = startPort;
  while (!(await checkPort(port))) {
    port += 1;
  }
  return port;
}

function runCommand(command, args, options) {
  return spawn(command, args, {
    ...options,
    stdio: 'inherit',
    shell: process.platform === 'win32',
    windowsHide: true,
    env: {
      ...process.env,
      ...options.env
    }
  });
}

async function main() {
  const repoRoot = path.resolve(__dirname, '..');
  const backendDir = path.join(repoRoot, 'ctp-platanar-backend');
  const frontendDir = path.join(repoRoot, 'ctp-platanar-frontend');
  const npmCmd = getNpmCommand();
  const backendPort = await getAvailablePort(5001);
  const frontendPort = await getAvailablePort(3000);

  console.log(`Iniciando backend en puerto ${backendPort} y frontend en puerto ${frontendPort}`);

  let shutdown = () => {};

  const backend = runCommand(npmCmd, ['start'], {
    cwd: backendDir,
    env: { PORT: String(backendPort), HOST: '127.0.0.1' }
  });

  const frontend = runCommand(npmCmd, ['start'], {
    cwd: frontendDir,
    env: {
      PORT: String(frontendPort),
      BROWSER: 'none',
      REACT_APP_API_URL: `http://127.0.0.1:${backendPort}/api`
    }
  });

  shutdown = () => {
    backend.kill();
    frontend.kill();
  };

  backend.once('error', () => {
    shutdown();
    process.exit(1);
  });

  frontend.once('error', () => {
    shutdown();
    process.exit(1);
  });

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  backend.on('exit', (code) => {
    if (code !== 0) {
      shutdown();
      process.exit(code || 1);
    }
  });

  frontend.on('exit', (code) => {
    if (code !== 0) {
      shutdown();
      process.exit(code || 1);
    }
  });
}

if (require.main === module) {
  main();
}

module.exports = {
  getAvailablePort
};
