#!/bin/bash
# Install Python dependencies
echo "Installing Python dependencies..."

# Install uv
pip install uv

# Create virtual environment
uv venv

# Install dependencies from requirements.txt
uv pip install -r requirements.txt
uv pip install --upgrade openai

echo "Setup complete!"


