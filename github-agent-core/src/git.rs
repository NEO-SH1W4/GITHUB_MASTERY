//! Ultra-fast Git operations engine

use crate::{AgentConfig, AgentError};
use git2::{Repository, Signature};
use std::path::Path;
use tokio::fs;

/// High-performance Git operations engine
pub struct GitEngine {
    config: AgentConfig,
}

impl GitEngine {
    pub fn new(config: &AgentConfig) -> Result<Self, AgentError> {
        Ok(Self {
            config: config.clone(),
        })
    }
    
    /// Clone repository with optimizations
    pub async fn clone_repo(&self, url: &str, path: &Path) -> Result<Repository, AgentError> {
        let repo = Repository::clone(url, path)
            .map_err(|e| AgentError::GitError(e.to_string()))?;
        Ok(repo)
    }
    
    /// Create optimized commit
    pub async fn create_commit(
        &self,
        repo: &Repository,
        message: &str,
        files: &[&str],
    ) -> Result<String, AgentError> {
        // Staging files
        let mut index = repo.index()
            .map_err(|e| AgentError::GitError(e.to_string()))?;
        
        for file in files {
            index.add_path(Path::new(file))
                .map_err(|e| AgentError::GitError(e.to_string()))?;
        }
        
        index.write()
            .map_err(|e| AgentError::GitError(e.to_string()))?;
        
        // Create commit
        let tree_id = index.write_tree()
            .map_err(|e| AgentError::GitError(e.to_string()))?;
        
        let tree = repo.find_tree(tree_id)
            .map_err(|e| AgentError::GitError(e.to_string()))?;
        
        let signature = Signature::now("GitHub Agent", "agent@github-mastery.com")
            .map_err(|e| AgentError::GitError(e.to_string()))?;
        
        let parent_commit = repo.head()
            .and_then(|h| h.target().ok_or(git2::Error::from_str("Invalid head")))
            .and_then(|oid| repo.find_commit(oid))
            .ok();
        
        let parents = parent_commit.as_ref().map(|c| vec![c]).unwrap_or_default();
        
        let commit_id = repo.commit(
            Some("HEAD"),
            &signature,
            &signature,
            message,
            &tree,
            &parents.iter().collect::<Vec<_>>(),
        ).map_err(|e| AgentError::GitError(e.to_string()))?;
        
        Ok(commit_id.to_string())
    }
}

