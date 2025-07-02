# GitHub Agent v2.0 - Ultra-Fast Automation Engine
# Makefile for building and testing the complete system

.PHONY: help build test clean install demo benchmark security lint docs all

# Default target
help:
	@echo "🤖 GitHub Agent v2.0 - Build System"
	@echo "=================================="
	@echo ""
	@echo "🚀 Available targets:"
	@echo "  build      - Build the complete agent (Rust core + Python brain)"
	@echo "  test       - Run all tests (unit, integration, benchmark)"
	@echo "  demo       - Run interactive demo"
	@echo "  install    - Install dependencies"
	@echo "  clean      - Clean build artifacts"
	@echo "  lint       - Run linters (rustfmt, clippy, black, mypy)"
	@echo "  benchmark  - Run performance benchmarks"
	@echo "  security   - Run security checks"
	@echo "  docs       - Generate documentation"
	@echo "  all        - Build everything and run tests"
	@echo ""
	@echo "🎯 Quick start:"
	@echo "  make install && make build && make demo"

# Variables
RUST_DIR = github-agent-core
PYTHON_DIR = github-agent-brain
VENV_DIR = $(PYTHON_DIR)/venv

# Check if tools are available
check-rust:
	@command -v cargo >/dev/null 2>&1 || { echo "❌ Rust not found. Install from https://rustup.rs/"; exit 1; }
	@echo "✅ Rust $(shell rustc --version | cut -d' ' -f2) found"

check-python:
	@command -v python3 >/dev/null 2>&1 || { echo "❌ Python 3 not found"; exit 1; }
	@echo "✅ Python $(shell python3 --version | cut -d' ' -f2) found"

# Install dependencies
install: check-rust check-python
	@echo "📦 Installing dependencies..."
	
	# Python virtual environment
	@if [ ! -d "$(VENV_DIR)" ]; then \
		echo "🐍 Creating Python virtual environment..."; \
		python3 -m venv $(VENV_DIR); \
	fi
	
	# Activate venv and install Python deps
	@echo "📚 Installing Python dependencies..."
	@bash -c "source $(VENV_DIR)/bin/activate && pip install --upgrade pip"
	@bash -c "source $(VENV_DIR)/bin/activate && pip install -r $(PYTHON_DIR)/requirements.txt"
	
	@echo "✅ All dependencies installed"

# Build the Rust core
build-rust: check-rust
	@echo "🦀 Building Rust core (Release mode)..."
	@cd $(RUST_DIR) && cargo build --release --features python
	@echo "✅ Rust core built successfully"

# Build Python extensions
build-python: build-rust
	@echo "🐍 Building Python bindings..."
	@bash -c "source $(VENV_DIR)/bin/activate && cd $(RUST_DIR) && maturin develop --release"
	@echo "✅ Python bindings built successfully"

# Complete build
build: install build-rust build-python
	@echo "🎉 Build complete! Agent v2.0 ready for action."

# Run tests
test-rust:
	@echo "🧪 Running Rust tests..."
	@cd $(RUST_DIR) && cargo test --release
	@echo "✅ Rust tests passed"

test-python:
	@echo "🧪 Running Python tests..."
	@bash -c "source $(VENV_DIR)/bin/activate && cd $(PYTHON_DIR) && python -m pytest tests/ -v"
	@echo "✅ Python tests passed"

test: test-rust test-python
	@echo "🎉 All tests passed!"

# Run demo
demo:
	@echo "🎪 Starting GitHub Agent v2.0 Demo..."
	@bash -c "source $(VENV_DIR)/bin/activate && cd $(PYTHON_DIR) && python example_usage.py"

# Run benchmarks
benchmark:
	@echo "⚡ Running performance benchmarks..."
	@cd $(RUST_DIR) && cargo bench
	@echo "📊 Benchmark results saved to target/criterion/"

# Security checks
security:
	@echo "🛡️ Running security audit..."
	@cd $(RUST_DIR) && cargo audit
	@bash -c "source $(VENV_DIR)/bin/activate && cd $(PYTHON_DIR) && safety check"
	@echo "✅ Security checks passed"

# Linting
lint-rust:
	@echo "🔍 Linting Rust code..."
	@cd $(RUST_DIR) && cargo fmt --check
	@cd $(RUST_DIR) && cargo clippy -- -D warnings

lint-python:
	@echo "🔍 Linting Python code..."
	@bash -c "source $(VENV_DIR)/bin/activate && cd $(PYTHON_DIR) && black --check ."
	@bash -c "source $(VENV_DIR)/bin/activate && cd $(PYTHON_DIR) && mypy ."

lint: lint-rust lint-python
	@echo "✅ All linting checks passed"

# Generate documentation
docs:
	@echo "📚 Generating documentation..."
	@cd $(RUST_DIR) && cargo doc --no-deps --release
	@bash -c "source $(VENV_DIR)/bin/activate && cd $(PYTHON_DIR) && sphinx-build -b html docs/ docs/_build/"
	@echo "✅ Documentation generated"
	@echo "   📖 Rust docs: $(RUST_DIR)/target/doc/github_agent_core/index.html"
	@echo "   📖 Python docs: $(PYTHON_DIR)/docs/_build/index.html"

# Clean build artifacts
clean:
	@echo "🧹 Cleaning build artifacts..."
	@cd $(RUST_DIR) && cargo clean
	@rm -rf $(VENV_DIR)
	@rm -rf $(PYTHON_DIR)/__pycache__
	@rm -rf $(PYTHON_DIR)/*.so
	@rm -rf $(PYTHON_DIR)/build
	@rm -rf $(PYTHON_DIR)/dist
	@echo "✅ Clean complete"

# Quick setup for new developers
setup: install build test
	@echo ""
	@echo "🎉 GitHub Agent v2.0 setup complete!"
	@echo "🚀 Try: make demo"
	@echo ""
	@echo "📋 What was installed:"
	@echo "  ✅ Rust toolchain with optimized build"
	@echo "  ✅ Python virtual environment with AI dependencies"
	@echo "  ✅ PyO3 bindings for Rust-Python integration"
	@echo "  ✅ All tests passing"
	@echo ""
	@echo "⚡ Performance features enabled:"
	@echo "  ✅ mimalloc allocator"
	@echo "  ✅ Release optimizations"
	@echo "  ✅ Link-time optimization"

# Development mode (faster builds, debug info)
dev-build:
	@echo "🔧 Building in development mode..."
	@cd $(RUST_DIR) && cargo build --features python
	@bash -c "source $(VENV_DIR)/bin/activate && cd $(RUST_DIR) && maturin develop"

# Production release build
release: clean install build test benchmark security
	@echo "🚀 Creating production release..."
	@cd $(RUST_DIR) && cargo build --release --features python
	@bash -c "source $(VENV_DIR)/bin/activate && cd $(RUST_DIR) && maturin build --release"
	@echo "✅ Production build complete"
	@echo "📦 Wheels available in $(RUST_DIR)/target/wheels/"

# Complete build and test pipeline
all: install build test lint security benchmark
	@echo ""
	@echo "🏆 GitHub Agent v2.0 - Complete Build Success!"
	@echo "============================================="
	@echo "✅ Dependencies installed"
	@echo "✅ Rust core built (release mode)"
	@echo "✅ Python bindings generated"
	@echo "✅ All tests passing"
	@echo "✅ Code quality checks passed"
	@echo "✅ Security audit passed"
	@echo "✅ Performance benchmarks completed"
	@echo ""
	@echo "🎯 Ready for:"
	@echo "  • Demo sessions: make demo"
	@echo "  • Development: make dev-build"
	@echo "  • Production: make release"

# Show system info for debugging
info:
	@echo "🔍 System Information"
	@echo "===================="
	@echo "OS: $(shell uname -s)"
	@echo "Architecture: $(shell uname -m)"
	@rustc --version
	@python3 --version
	@echo "Cargo version: $(shell cargo --version)"
	@echo "Git version: $(shell git --version)"
	@echo ""
	@echo "📂 Project structure:"
	@find . -name "*.rs" -o -name "*.py" -o -name "*.toml" -o -name "*.txt" | head -20

