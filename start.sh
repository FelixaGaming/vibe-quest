#!/bin/bash
echo ""
echo "🌟 =================================="
echo "   VIBE QUEST - Setup"
echo "🌟 =================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo ""
    echo "👉 Download it from: https://nodejs.org"
    echo "   (Pick the LTS version)"
    echo ""
    echo "After installing, run this script again."
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✅ Node.js found: $NODE_VERSION"
echo ""

# Install dependencies
echo "📦 Installing packages..."
npm install

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Install failed. Try deleting node_modules and running again:"
    echo "   rm -rf node_modules && npm install"
    exit 1
fi

echo ""
echo "✅ All packages installed!"
echo ""
echo "🚀 Starting Vibe Quest..."
echo "   Open your browser to: http://localhost:3000"
echo ""

npm run dev
