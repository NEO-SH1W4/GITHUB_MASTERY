import request from 'supertest';

jest.mock('chalk', () => ({
  blue: jest.fn(t => t),
  cyan: jest.fn(t => t),
  green: jest.fn(t => t),
  yellow: jest.fn(t => t),
  magenta: jest.fn(t => t),
  red: jest.fn(t => t),
  gray: jest.fn(t => t),
}));

describe('Webhook server handlers', () => {
  let app;

  beforeAll(async () => {
    ({ app } = await import('../../webhooks/webhook-server.js'));
  });

  test('responds to push event', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    const payload = {
      repository: { full_name: 'user/repo' },
      pusher: { name: 'Alice', email: 'alice@example.com' },
      commits: [{ message: 'init', author: { name: 'Alice' } }],
      ref: 'refs/heads/main',
    };

    const res = await request(app)
      .post('/webhook')
      .set('X-GitHub-Event', 'push')
      .set('X-GitHub-Delivery', '1')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(payload));

    expect(res.status).toBe(200);
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('📤 Push Event Recebido')
    );

    logSpy.mockRestore();
  });

  test('responds to issues event', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    const payload = {
      action: 'opened',
      issue: { number: 1, title: 'Issue', user: { login: 'bob' } },
      repository: { full_name: 'user/repo' },
    };

    const res = await request(app)
      .post('/webhook')
      .set('X-GitHub-Event', 'issues')
      .set('X-GitHub-Delivery', '2')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(payload));

    expect(res.status).toBe(200);
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('🐛 Issues Event Recebido')
    );

    logSpy.mockRestore();
  });
});
