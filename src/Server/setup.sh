#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Update the package list and install required dependencies
echo "Installing dependencies..."
apt-get update
apt-get install -y wget unzip xvfb libxi6 libgconf-2-4 default-jdk libnss3 libxss1 libappindicator1 libindicator7 fonts-liberation

# Install Google Chrome
echo "Installing Google Chrome..."
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add -
echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list
apt-get update
apt-get install -y google-chrome-stable

# Verify Chrome installation
echo "Chrome version:"
google-chrome --version

# Install ChromeDriver
echo "Installing ChromeDriver..."
CHROME_DRIVER_VERSION=$(curl -sS https://chromedriver.storage.googleapis.com/LATEST_RELEASE)
wget -q https://chromedriver.storage.googleapis.com/${CHROME_DRIVER_VERSION}/chromedriver_linux64.zip
unzip chromedriver_linux64.zip
rm chromedriver_linux64.zip
mv chromedriver /usr/local/bin/
chmod +x /usr/local/bin/chromedriver

# Verify ChromeDriver installation
echo "ChromeDriver version:"
chromedriver --version

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


