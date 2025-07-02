use criterion::{black_box, criterion_group, criterion_main, Criterion};
use github_agent_core::{AgentConfig, GitHubClient, RepoInfo};
use std::time::Duration;

fn benchmark_github_client_creation(c: &mut Criterion) {
    let rt = tokio::runtime::Runtime::new().unwrap();
    
    c.bench_function("github_client_creation", |b| {
        b.iter(|| {
            rt.block_on(async {
                let config = black_box(AgentConfig::default());
                match GitHubClient::new(&config).await {
                    Ok(client) => black_box(client),
                    Err(_) => panic!("Failed to create GitHub client"),
                }
            })
        })
    });
}

fn benchmark_repo_info_simulation(c: &mut Criterion) {
    let rt = tokio::runtime::Runtime::new().unwrap();
    
    c.bench_function("repo_info_processing", |b| {
        b.iter(|| {
            rt.block_on(async {
                // Simulate repo info processing without actual API calls
                let repo_info = RepoInfo {
                    name: black_box("test-repo".to_string()),
                    full_name: black_box("owner/test-repo".to_string()),
                    language: Some(black_box("Rust".to_string())),
                    stars: black_box(1337),
                    forks: black_box(42),
                };
                
                // Simulate processing time
                tokio::time::sleep(Duration::from_micros(10)).await;
                
                black_box(repo_info)
            })
        })
    });
}

fn benchmark_concurrent_api_calls(c: &mut Criterion) {
    let rt = tokio::runtime::Runtime::new().unwrap();
    
    c.bench_function("concurrent_api_simulation", |b| {
        b.iter(|| {
            rt.block_on(async {
                let tasks: Vec<_> = (0..5)
                    .map(|i| {
                        tokio::spawn(async move {
                            // Simulate API call processing
                            tokio::time::sleep(Duration::from_micros(100)).await;
                            
                            RepoInfo {
                                name: format!("repo-{}", i),
                                full_name: format!("owner/repo-{}", i),
                                language: Some("Rust".to_string()),
                                stars: i * 100,
                                forks: i * 10,
                            }
                        })
                    })
                    .collect();
                
                let results: Vec<_> = futures::future::join_all(tasks)
                    .await
                    .into_iter()
                    .map(|r| r.unwrap())
                    .collect();
                
                black_box(results)
            })
        })
    });
}

fn benchmark_json_serialization(c: &mut Criterion) {
    let repo_info = RepoInfo {
        name: "benchmark-repo".to_string(),
        full_name: "github/benchmark-repo".to_string(),
        language: Some("Rust".to_string()),
        stars: 9999,
        forks: 888,
    };
    
    c.bench_function("json_serialization", |b| {
        b.iter(|| {
            let json = serde_json::to_string(&black_box(&repo_info))
                .expect("Failed to serialize");
            black_box(json)
        })
    });
    
    c.bench_function("json_deserialization", |b| {
        let json = serde_json::to_string(&repo_info).unwrap();
        b.iter(|| {
            let repo: RepoInfo = serde_json::from_str(&black_box(&json))
                .expect("Failed to deserialize");
            black_box(repo)
        })
    });
}

fn benchmark_rate_limiting_simulation(c: &mut Criterion) {
    let rt = tokio::runtime::Runtime::new().unwrap();
    
    c.bench_function("rate_limiting_check", |b| {
        b.iter(|| {
            rt.block_on(async {
                // Simulate rate limiting logic
                let current_requests = black_box(45);
                let rate_limit = black_box(60);
                let time_window = Duration::from_secs(60);
                
                if current_requests < rate_limit {
                    // Simulate successful request
                    tokio::time::sleep(Duration::from_micros(50)).await;
                    black_box(true)
                } else {
                    // Simulate rate limit hit
                    black_box(false)
                }
            })
        })
    });
}

criterion_group!(
    benches,
    benchmark_github_client_creation,
    benchmark_repo_info_simulation,
    benchmark_concurrent_api_calls,
    benchmark_json_serialization,
    benchmark_rate_limiting_simulation
);
criterion_main!(benches);

