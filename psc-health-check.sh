#!/bin/bash

# PSC Website - Pre-Session Health Check
# Run this at the START of every session to catch issues early
# Usage: bash psc-health-check.sh

echo "=========================================="
echo "PSC Website Health Check"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0

# 1. Check git status
echo "📋 Checking Git Status..."
if [ -z "$(git status --porcelain)" ]; then
    echo -e "${GREEN}✓ Working directory clean${NC}"
else
    echo -e "${YELLOW}⚠ Uncommitted changes detected:${NC}"
    git status --short
    echo ""
fi

# 2. Check for merge conflicts in files
echo "⚔️  Checking for Merge Conflicts..."
CONFLICTS=$(find . \( -path ./node_modules -o -path ./.next \) -prune -o \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) -print | xargs grep -l "^<<<<<<< HEAD" 2>/dev/null | wc -l)
if [ "$CONFLICTS" -eq 0 ]; then
    echo -e "${GREEN}✓ No merge conflicts found${NC}"
else
    echo -e "${RED}✗ Found $CONFLICTS files with merge conflicts${NC}"
    find . \( -path ./node_modules -o -path ./.next \) -prune -o \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) -print | xargs grep -l "^<<<<<<< HEAD" 2>/dev/null
    ERRORS=$((ERRORS + 1))
fi

# 3. Check Node.js and npm
echo ""
echo "🔧 Checking Node.js & npm..."
if command -v node &> /dev/null; then
    echo -e "${GREEN}✓ Node.js $(node -v)${NC}"
else
    echo -e "${RED}✗ Node.js not found${NC}"
    ERRORS=$((ERRORS + 1))
fi

if command -v npm &> /dev/null; then
    echo -e "${GREEN}✓ npm $(npm -v)${NC}"
else
    echo -e "${RED}✗ npm not found${NC}"
    ERRORS=$((ERRORS + 1))
fi

# 4. Check node_modules
echo ""
echo "📦 Checking Dependencies..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓ node_modules exists${NC}"
else
    echo -e "${YELLOW}⚠ node_modules missing, running npm install...${NC}"
    npm install
fi

# 5. Verify package.json integrity
if [ -f "package.json" ]; then
    echo -e "${GREEN}✓ package.json found${NC}"
else
    echo -e "${RED}✗ package.json not found${NC}"
    ERRORS=$((ERRORS + 1))
fi

# 6. Run build
echo ""
echo "🏗️  Running Build Test..."
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Build successful${NC}"
else
    echo -e "${RED}✗ Build failed - review errors above${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Final report
echo ""
echo "=========================================="
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ Health Check Passed - Ready to code!${NC}"
    echo "=========================================="
    exit 0
else
    echo -e "${RED}✗ Health Check Failed - $ERRORS issue(s) found${NC}"
    echo "Fix errors above before proceeding."
    echo "=========================================="
    exit 1
fi
