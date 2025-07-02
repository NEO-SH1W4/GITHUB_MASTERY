//! Performance monitoring and optimization

use crate::{AgentConfig, AgentError};
use std::time::{Duration, Instant};
use std::collections::HashMap;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PerformanceMetrics {
    pub operation: String,
    pub duration: Duration,
    pub memory_used: u64,
    pub cpu_usage: f32,
}

pub struct PerformanceMonitor {
    config: AgentConfig,
    metrics: HashMap<String, Vec<PerformanceMetrics>>,
}

impl PerformanceMonitor {
    pub fn new(config: &AgentConfig) -> Result<Self, AgentError> {
        Ok(Self {
            config: config.clone(),
            metrics: HashMap::new(),
        })
    }
    
    pub fn start_timing(&self, operation: &str) -> PerformanceTimer {
        PerformanceTimer {
            operation: operation.to_string(),
            start_time: Instant::now(),
        }
    }
    
    pub fn record_metric(&mut self, metric: PerformanceMetrics) {
        self.metrics
            .entry(metric.operation.clone())
            .or_insert_with(Vec::new)
            .push(metric);
    }
    
    pub fn get_average_duration(&self, operation: &str) -> Option<Duration> {
        self.metrics.get(operation).map(|metrics| {
            let total: Duration = metrics.iter().map(|m| m.duration).sum();
            total / metrics.len() as u32
        })
    }
}

pub struct PerformanceTimer {
    operation: String,
    start_time: Instant,
}

impl PerformanceTimer {
    pub fn finish(self) -> PerformanceMetrics {
        PerformanceMetrics {
            operation: self.operation,
            duration: self.start_time.elapsed(),
            memory_used: 0, // Would use actual memory measurement
            cpu_usage: 0.0, // Would use actual CPU measurement
        }
    }
}

