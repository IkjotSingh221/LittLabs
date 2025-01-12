#!/bin/bash

# Install uv
pip install uv

# Create virtual environment
uv venv

# Install dependencies from requirements.txt
uv pip install -r requirements.txt
