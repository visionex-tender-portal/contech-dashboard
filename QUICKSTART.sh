#!/bin/bash

echo "🏗️  Construction Tech Intelligence Dashboard - Quick Start"
echo "=========================================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm version: $(npm -v)"
echo ""

# Check if data.db exists
if [ ! -f "data.db" ]; then
    echo "⚠️  Warning: data.db not found. Please copy your database file as data.db"
    echo "   Example: cp /path/to/contech-intel.db data.db"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "✅ Dependencies installed successfully"
echo ""

# Build the project
echo "🔨 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo ""
echo "✅ Build successful"
echo ""

# Start the server
echo "🚀 Starting development server..."
echo ""
echo "   Dashboard will be available at:"
echo "   📍 http://localhost:3000"
echo ""
echo "   Press Ctrl+C to stop the server"
echo ""

npm run dev
