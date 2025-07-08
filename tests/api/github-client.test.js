/**
 * Tests for GitHub Client API
 *
 * @fileoverview Unit tests for GitHub API client functionality
 */

const { GitHubClient } = require('../../api/github-client.js');

// Mock Octokit
jest.mock('@octokit/rest', () => ({
  Octokit: jest.fn().mockImplementation(() => ({
    rest: {
      repos: {
        listForAuthenticatedUser: jest.fn(),
        get: jest.fn(),
        create: jest.fn(),
        createForAuthenticatedUser: jest.fn(),
      },
      issues: {
        listForRepo: jest.fn(),
      },
      users: {
        getAuthenticated: jest.fn(),
      },
      rateLimit: {
        get: jest.fn(),
      },
    },
  })),
}));

jest.mock('@octokit/auth-token', () => ({
  createTokenAuth: jest.fn(),
}));

jest.mock('dotenv', () => ({
  config: jest.fn(),
}));

jest.mock('chalk', () => ({
  blue: jest.fn(text => text),
  green: jest.fn(text => text),
  cyan: jest.fn(text => text),
  red: jest.fn(text => text),
  yellow: jest.fn(text => text),
  gray: jest.fn(text => text),
}));

describe('GitHubClient', () => {
  let client;
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create client with fake token
    process.env.GITHUB_TOKEN = 'fake-token';
    client = new GitHubClient();
  });

  describe('constructor', () => {
    it('should create instance with valid token', () => {
      expect(client).toBeInstanceOf(GitHubClient);
    });

    it('should throw error with invalid token', () => {
      // Temporarily unset the env token
      const originalToken = process.env.GITHUB_TOKEN;
      process.env.GITHUB_TOKEN = '';

      // Test with empty token
      expect(() => new GitHubClient('')).toThrow('GitHub token is required');

      // Restore the env token
      process.env.GITHUB_TOKEN = originalToken;
    });
  });

  describe('listRepositories', () => {
    it('should return repositories list', async () => {
      const mockRepos = [
        {
          name: 'repo1',
          full_name: 'user/repo1',
          description: 'Test repository 1',
          language: 'JavaScript',
          stargazers_count: 10,
          forks_count: 5,
          open_issues_count: 2,
        },
        {
          name: 'repo2',
          full_name: 'user/repo2',
          description: 'Test repository 2',
          language: 'Python',
          stargazers_count: 20,
          forks_count: 8,
          open_issues_count: 1,
        },
      ];

      client.octokit.rest.repos.listForAuthenticatedUser.mockResolvedValue({
        data: mockRepos,
      });

      const result = await client.listRepositories();

      expect(result).toEqual(mockRepos);
      expect(client.octokit.rest.repos.listForAuthenticatedUser).toHaveBeenCalledWith({
        sort: 'updated',
        per_page: 30,
        direction: 'desc',
      });
    });

    it('should handle API errors gracefully', async () => {
      client.octokit.rest.repos.listForAuthenticatedUser.mockRejectedValue(
        new Error('API Error')
      );

      await expect(client.listRepositories()).rejects.toThrow('API Error');
    });
  });

  describe('getRepository', () => {
    it('should return repository details', async () => {
      const mockRepo = { name: 'test-repo', description: 'Test repository' };

      client.octokit.rest.repos.get.mockResolvedValue({
        data: mockRepo,
      });

      const result = await client.getRepository('user', 'test-repo');

      expect(result).toEqual(mockRepo);
      expect(client.octokit.rest.repos.get).toHaveBeenCalledWith({
        owner: 'user',
        repo: 'test-repo',
      });
    });

    it('should throw error for missing parameters', async () => {
      await expect(client.getRepository('', 'repo')).rejects.toThrow();
      await expect(client.getRepository('user', '')).rejects.toThrow();
    });
  });

  describe('createRepository', () => {
    it('should create repository successfully', async () => {
      const mockRepo = { name: 'new-repo', private: false };

      client.octokit.rest.repos.createForAuthenticatedUser.mockResolvedValue({
        data: mockRepo,
      });

      const result = await client.createRepository({
        name: 'new-repo',
        description: 'New repository',
      });

      expect(result).toEqual(mockRepo);
      expect(client.octokit.rest.repos.createForAuthenticatedUser).toHaveBeenCalledWith(
        {
          name: 'new-repo',
          description: 'New repository',
        }
      );
    });
  });

  describe('getRateLimit', () => {
    it('should return rate limit info', async () => {
      const mockRateLimit = {
        resources: {
          core: {
            limit: 5000,
            used: 10,
            remaining: 4990,
            reset: 1625443200,
          },
        },
      };

      client.octokit.rest.rateLimit.get.mockResolvedValue({
        data: mockRateLimit,
      });

      const result = await client.getRateLimit();
      expect(result).toEqual(mockRateLimit);
      expect(client.octokit.rest.rateLimit.get).toHaveBeenCalled();
    });

    it('should handle rate limit errors', async () => {
      client.octokit.rest.rateLimit.get.mockRejectedValue(
        new Error('Rate limit error')
      );

      await expect(client.getRateLimit()).rejects.toThrow('Rate limit error');
    });
  });

  describe('validateToken', () => {
    it('should validate token successfully', async () => {
      const mockUser = { login: 'testuser' };
      client.octokit.rest.users.getAuthenticated.mockResolvedValue({
        data: mockUser,
      });

      const result = await client.validateToken();
      expect(result).toBe(true);
      expect(client.octokit.rest.users.getAuthenticated).toHaveBeenCalled();
    });

    it('should return false for invalid token', async () => {
      client.octokit.rest.users.getAuthenticated.mockRejectedValue(
        new Error('Invalid token')
      );

      const result = await client.validateToken();
      expect(result).toBe(false);
    });
  });

  describe('createRepository', () => {
    it('should handle repository creation errors', async () => {
      client.octokit.rest.repos.createForAuthenticatedUser.mockRejectedValue(
        new Error('Repository creation failed')
      );

      await expect(
        client.createRepository({ name: 'test-repo' })
      ).rejects.toThrow('Repository creation failed');
    });

    it('should validate repository name', async () => {
      await expect(
        client.createRepository({ name: '' })
      ).rejects.toThrow('Repository name is required');
    });
  });

  describe('listIssues', () => {
    it('should return issues list', async () => {
      const mockIssues = [
        {
          number: 1,
          title: 'Issue 1',
          labels: [],
          user: { login: 'user1' },
          created_at: '2025-07-01',
        },
        {
          number: 2,
          title: 'Issue 2',
          labels: [],
          user: { login: 'user2' },
          created_at: '2025-07-02',
        },
      ];

      client.octokit.rest.issues.listForRepo.mockResolvedValue({
        data: mockIssues,
      });

      const result = await client.listIssues('user', 'repo');

      expect(result).toEqual(mockIssues);
      expect(client.octokit.rest.issues.listForRepo).toHaveBeenCalledWith({
        owner: 'user',
        repo: 'repo',
        state: 'open',
        sort: 'updated',
        direction: 'desc',
        per_page: 30,
      });
    });
  });
});
