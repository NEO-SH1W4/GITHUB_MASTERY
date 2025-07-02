//! GitHub API client optimizado

use crate::{AgentConfig, AgentError};
use octocrab::Octocrab;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RepoInfo {
    pub name: String,
    pub full_name: String,
    pub language: Option<String>,
    pub stars: u32,
    pub forks: u32,
}

pub struct GitHubClient {
    client: Octocrab,
    config: AgentConfig,
}

impl GitHubClient {
    pub async fn new(config: &AgentConfig) -> Result<Self, AgentError> {
        let client = Octocrab::builder()
            .base_uri("https://api.github.com")?
            .build()?;
            
        Ok(Self {
            client,
            config: config.clone(),
        })
    }
    
    pub async fn get_repo_info(&self, owner: &str, repo: &str) -> Result<RepoInfo, AgentError> {
        let repo = self.client
            .repos(owner, repo)
            .get()
            .await
            .map_err(|e| AgentError::GitHubError(e.to_string()))?;
            
        Ok(RepoInfo {
            name: repo.name,
            full_name: repo.full_name.unwrap_or_default(),
            language: repo.language,
            stars: repo.stargazers_count.unwrap_or(0),
            forks: repo.forks_count.unwrap_or(0),
        })
    }
}

