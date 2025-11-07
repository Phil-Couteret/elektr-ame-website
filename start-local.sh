#!/bin/bash

# Elektr-Âme Local Development Startup Script
# This script starts both the PHP backend and React frontend

echo "🎵 Starting Elektr-Âme Local Development Environment..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18+ first."
    exit 1
fi

# Check if PHP is installed
if ! command -v php &> /dev/null; then
    echo "❌ PHP is not installed. Please install PHP 8.4+ first."
    exit 1
fi

# Check if MySQL is running (optional check)
if ! command -v mysql &> /dev/null; then
    echo "⚠️  MySQL not found in PATH. Make sure MySQL is installed and running."
fi

# Check if config.php exists
if [ ! -f "api/config.php" ]; then
    echo "⚠️  api/config.php not found!"
    echo "📝 Creating from template..."
    if [ -f "api/config-template.php" ]; then
        cp api/config-template.php api/config.php
        echo "✅ Created api/config.php"
        echo "⚠️  Please edit api/config.php with your database credentials before continuing!"
        read -p "Press Enter after updating config.php..."
    else
        echo "❌ api/config-template.php not found. Cannot create config.php"
        exit 1
    fi
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing npm dependencies..."
    npm install
fi

echo ""
echo "🚀 Starting servers..."
echo ""
echo "📋 Instructions:"
echo "   - Frontend will run on: http://localhost:8080"
echo "   - Backend API will run on: http://localhost:8000"
echo "   - Press Ctrl+C to stop both servers"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $PHP_PID $NPM_PID 2>/dev/null
    exit
}

trap cleanup SIGINT SIGTERM

# Start PHP server in background (ensure we're in the project root)
echo "🔧 Starting PHP backend on port 8000..."
cd "$(dirname "$0")" || exit 1
php -S localhost:8000 > /dev/null 2>&1 &
PHP_PID=$!

# Wait a moment for PHP to start
sleep 2

# Start React dev server
echo "⚛️  Starting React frontend on port 8080..."
npm run dev &
NPM_PID=$!

echo ""
echo "✅ Both servers are starting!"
echo "   - PHP Backend PID: $PHP_PID"
echo "   - React Frontend PID: $NPM_PID"
echo ""
echo "🌐 Open http://localhost:8080 in your browser"
echo ""
echo "Press Ctrl+C to stop both servers..."

# Wait for both processes
wait

