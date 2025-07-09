const path = require('path');
const { fork } = require('child_process');
const http = require('http');

const PORT = 3999; // fixed port for tests
let serverProcess;

// helper to wait for server to start
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

beforeAll(async () => {
  serverProcess = fork(path.join(__dirname, '../../webhooks/webhook-server.js'), [], {
    env: { ...process.env, WEBHOOK_PORT: PORT },
    stdio: 'ignore'
  });
  await wait(500); // wait for server to listen
});

afterAll(() => {
  if (serverProcess) {
    serverProcess.kill();
  }
});

function postWebhook(event, payload) {
  const data = JSON.stringify(payload);
  const options = {
    hostname: 'localhost',
    port: PORT,
    path: '/webhook',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data),
      'X-GitHub-Event': event,
      'X-GitHub-Delivery': 'test-delivery'
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, res => {
      let body = '';
      res.on('data', chunk => {
        body += chunk;
      });
      res.on('end', () => {
        resolve({ status: res.statusCode, body });
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

describe('Webhook server', () => {
  test('handles push event', async () => {
    const payload = {
      repository: { full_name: 'test/repo' },
      pusher: { name: 'Alice', email: 'alice@example.com' },
      commits: [{ message: 'test', author: { name: 'Alice' } }],
      ref: 'refs/heads/main'
    };

    const res = await postWebhook('push', payload);
    expect(res.status).toBe(200);
    expect(res.body).toBe('OK');
  });

  test('handles issues event', async () => {
    const payload = {
      action: 'opened',
      issue: { number: 1, title: 'Bug', user: { login: 'Alice' } },
      repository: { full_name: 'test/repo' }
    };

    const res = await postWebhook('issues', payload);
    expect(res.status).toBe(200);
    expect(res.body).toBe('OK');
  });
});
