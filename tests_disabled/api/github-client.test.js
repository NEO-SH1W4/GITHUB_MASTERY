/**
 * Tests for GitHub Client API
 *
 * @fileoverview Unit tests for GitHub API client functionality
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { GitHubClient } from '../../api/github-client.js';

// Mock Octokit
jest.mock('@octokit/rest');
jest.mock('@octokit/auth-token');

describe('GitHubClient', () => {
  let client;
  let mockOctokit;

  beforeEach(() => {
    mockOctokit = {
      rest: {
        repos: {
          listForAuthenticatedUser: jest.fn(),
          get: jest.fn(),
          create: jest.fn(),
        },
        issues: {
          listForRepo: jest.fn(),
        },
      },
    };

    // Mock the constructor
    jest.doMock('@octokit/rest', () => ({
      Octokit: jest.fn(() => mockOctokit),
    }));

    client = new GitHubClient('fake-token');
  });

  describe('constructor', () => {
    it('should create instance with valid token', () => {
      expect(client).toBeInstanceOf(GitHubClient);
    });

    it('should throw error with invalid token', () => {
      expect(() => new GitHubClient('')).toThrow('GitHub token is required');
    });
  });

  describe('listRepositories', () => {
    it('should return repositories list', async () => {
      const mockRepos = [
        { name: 'repo1', full_name: 'user/repo1' },
        { name: 'repo2', full_name: 'user/repo2' },
      ];

      mockOctokit.rest.repos.listForAuthenticatedUser.mockResolvedValue({
        data: mockRepos,
      });

      const result = await client.listRepositories();

      expect(result).toEqual(mockRepos);
      expect(mockOctokit.rest.repos.listForAuthenticatedUser).toHaveBeenCalledWith({
        sort: 'updated',
        per_page: 100,
      });
    });

    it('should handle API errors gracefully', async () => {
      mockOctokit.rest.repos.listForAuthenticatedUser.mockRejectedValue(
        new Error('API Error')
      );

      await expect(client.listRepositories()).rejects.toThrow('API Error');
    });
  });

  describe('getRepository', () => {
    it('should return repository details', async () => {
      const mockRepo = { name: 'test-repo', description: 'Test repository' };

      mockOctokit.rest.repos.get.mockResolvedValue({
        data: mockRepo,
      });

      const result = await client.getRepository('user', 'test-repo');

      expect(result).toEqual(mockRepo);
      expect(mockOctokit.rest.repos.get).toHaveBeenCalledWith({
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

      mockOctokit.rest.repos.create.mockResolvedValue({
        data: mockRepo,
      });

      const result = await client.createRepository({
        name: 'new-repo',
        description: 'New repository',
      });

      expect(result).toEqual(mockRepo);
      expect(mockOctokit.rest.repos.create).toHaveBeenCalledWith({
        name: 'new-repo',
        description: 'New repository',
      });
    });
  });

  describe('listIssues', () => {
    it('should return issues list', async () => {
      const mockIssues = [
        { number: 1, title: 'Issue 1' },
        { number: 2, title: 'Issue 2' },
      ];

      mockOctokit.rest.issues.listForRepo.mockResolvedValue({
        data: mockIssues,
      });

      const result = await client.listIssues('user', 'repo');

      expect(result).toEqual(mockIssues);
      expect(mockOctokit.rest.issues.listForRepo).toHaveBeenCalledWith({
        owner: 'user',
        repo: 'repo',
        state: 'all',
        per_page: 100,
      });
    });
  });
});
