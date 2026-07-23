const test = require('node:test');
const assert = require('node:assert/strict');
const net = require('node:net');

const { getAvailablePort } = require('./start-dev');

test('getAvailablePort skips occupied ports', async () => {
  const occupiedServer = net.createServer();

  await new Promise((resolve) => occupiedServer.listen(3100, '0.0.0.0', resolve));

  try {
    const nextPort = await getAvailablePort(3100);
    assert.equal(nextPort, 3101);
  } finally {
    await new Promise((resolve, reject) => occupiedServer.close((err) => (err ? reject(err) : resolve())));
  }
});
