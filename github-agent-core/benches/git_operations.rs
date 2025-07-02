use criterion::{black_box, criterion_group, criterion_main, Criterion};
use github_agent_core::{AgentConfig, GitEngine};
use std::time::Duration;
use tempfile::TempDir;

fn benchmark_git_operations(c: &mut Criterion) {
    let config = AgentConfig::default();
    let git_engine = GitEngine::new(&config).expect("Failed to create git engine");
    
    c.bench_function("git_engine_creation", |b| {
        b.iter(|| {
            let config = black_box(AgentConfig::default());
            GitEngine::new(&config).expect("Failed to create git engine")
        })
    });
}

fn benchmark_git_clone(c: &mut Criterion) {
    let rt = tokio::runtime::Runtime::new().unwrap();
    
    c.bench_function("git_clone_simulation", |b| {
        b.iter(|| {
            rt.block_on(async {
                // Simulate clone operation metrics
                let start = std::time::Instant::now();
                
                // Simulate the work that would be done in a real git clone
                tokio::time::sleep(Duration::from_micros(100)).await;
                
                let duration = start.elapsed();
                black_box(duration)
            })
        })
    });
}

fn benchmark_commit_creation(c: &mut Criterion) {
    let rt = tokio::runtime::Runtime::new().unwrap();
    
    c.bench_function("commit_creation_simulation", |b| {
        b.iter(|| {
            rt.block_on(async {
                // Simulate commit creation
                let start = std::time::Instant::now();
                
                // Simulate file staging and commit operations
                for _ in 0..10 {
                    tokio::task::yield_now().await;
                }
                
                let duration = start.elapsed();
                black_box(duration)
            })
        })
    });
}

fn benchmark_memory_allocation(c: &mut Criterion) {
    c.bench_function("memory_allocation_pattern", |b| {
        b.iter(|| {
            let mut data = Vec::with_capacity(1000);
            for i in 0..1000 {
                data.push(black_box(i));
            }
            black_box(data)
        })
    });
}

fn benchmark_concurrent_operations(c: &mut Criterion) {
    let rt = tokio::runtime::Runtime::new().unwrap();
    
    c.bench_function("concurrent_git_operations", |b| {
        b.iter(|| {
            rt.block_on(async {
                let tasks: Vec<_> = (0..10)
                    .map(|i| {
                        tokio::spawn(async move {
                            // Simulate concurrent git operations
                            tokio::time::sleep(Duration::from_micros(50)).await;
                            black_box(i * 2)
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

criterion_group!(
    benches,
    benchmark_git_operations,
    benchmark_git_clone,
    benchmark_commit_creation,
    benchmark_memory_allocation,
    benchmark_concurrent_operations
);
criterion_main!(benches);

