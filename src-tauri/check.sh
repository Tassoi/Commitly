#!/bin/bash
# Run Rust formatting and linting checks

echo "Running rustfmt..."
cargo fmt --all --check

echo "Running clippy..."
cargo clippy --all-targets --all-features -- -D warnings

echo "All Rust checks passed!"
