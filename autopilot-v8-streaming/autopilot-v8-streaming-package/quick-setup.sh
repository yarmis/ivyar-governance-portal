#!/bin/bash

# AUTOPILOT V8 - STREAMING API QUICK SETUP
# This script automates the deployment process

set -e  # Exit on error

echo "🚀 AUTOPILOT V8 - STREAMING API SETUP"
echo "===================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Check prerequisites
echo -e "${BLUE}Step 1: Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js $(node --version) installed${NC}"
echo -e "${GREEN}✓ npm $(npm --version) installed${NC}"
echo ""

# Step 2: Install dependencies
echo -e "${BLUE}Step 2: Installing dependencies...${NC}"
npm install
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Step 3: Install Wrangler
echo -e "${BLUE}Step 3: Installing Wrangler CLI...${NC}"
npm install -g wrangler
echo -e "${GREEN}✓ Wrangler installed${NC}"
echo ""

# Step 4: Login to Cloudflare
echo -e "${BLUE}Step 4: Cloudflare authentication...${NC}"
echo "This will open a browser window to authenticate with Cloudflare."
read -p "Press Enter to continue..."
wrangler login
echo -e "${GREEN}✓ Authenticated with Cloudflare${NC}"
echo ""

# Step 5: Create KV namespaces
echo -e "${BLUE}Step 5: Creating KV namespaces...${NC}"

echo "Creating production namespace..."
PROD_NS=$(wrangler kv:namespace create "AUTOPILOT_CACHE" | grep "id =" | awk '{print $3}' | tr -d '"')
echo -e "${GREEN}✓ Production namespace ID: ${PROD_NS}${NC}"

echo "Creating preview namespace..."
PREVIEW_NS=$(wrangler kv:namespace create "AUTOPILOT_CACHE" --preview | grep "id =" | awk '{print $3}' | tr -d '"')
echo -e "${GREEN}✓ Preview namespace ID: ${PREVIEW_NS}${NC}"
echo ""

# Step 6: Update wrangler.toml
echo -e "${BLUE}Step 6: Updating wrangler.toml...${NC}"

# Backup original
cp wrangler.toml wrangler.toml.backup

# Update with actual IDs
sed -i.tmp "s/YOUR_KV_NAMESPACE_ID/${PROD_NS}/g" wrangler.toml
sed -i.tmp "s/YOUR_PREVIEW_KV_NAMESPACE_ID/${PREVIEW_NS}/g" wrangler.toml
rm -f wrangler.toml.tmp

echo -e "${GREEN}✓ wrangler.toml updated${NC}"
echo ""

# Step 7: Set Anthropic API key
echo -e "${BLUE}Step 7: Setting Anthropic API key...${NC}"
echo -e "${YELLOW}Please enter your Anthropic API key (starts with sk-ant-):${NC}"
wrangler secret put ANTHROPIC_API_KEY
echo -e "${GREEN}✓ API key set${NC}"
echo ""

# Step 8: Deploy
echo -e "${BLUE}Step 8: Deploying to Cloudflare...${NC}"
wrangler deploy
echo -e "${GREEN}✓ Deployed successfully!${NC}"
echo ""

# Step 9: Test deployment
echo -e "${BLUE}Step 9: Testing deployment...${NC}"
WORKER_URL=$(wrangler deployments list | grep "https://" | head -1 | awk '{print $1}')

if [ -z "$WORKER_URL" ]; then
    echo -e "${YELLOW}⚠ Could not auto-detect worker URL${NC}"
    echo "Please test manually at: https://ivyar-autopilot-v8.workers.dev/autopilot/health"
else
    echo "Testing health endpoint..."
    HEALTH_RESPONSE=$(curl -s "${WORKER_URL}/autopilot/health")
    
    if echo "$HEALTH_RESPONSE" | grep -q "healthy"; then
        echo -e "${GREEN}✓ Health check passed!${NC}"
        echo "$HEALTH_RESPONSE" | jq '.'
    else
        echo -e "${YELLOW}⚠ Health check failed${NC}"
        echo "$HEALTH_RESPONSE"
    fi
fi
echo ""

# Summary
echo "=================================================="
echo -e "${GREEN}🎉 SETUP COMPLETE!${NC}"
echo "=================================================="
echo ""
echo "Worker URL: ${WORKER_URL}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Test the API:"
echo "   curl ${WORKER_URL}/autopilot/health"
echo ""
echo "2. Integrate with frontend:"
echo "   Update NEXT_PUBLIC_API_URL in your .env.local"
echo ""
echo "3. Monitor deployment:"
echo "   wrangler tail"
echo ""
echo -e "${BLUE}Useful commands:${NC}"
echo "  npm run dev          - Local development"
echo "  npm run deploy       - Deploy to production"
echo "  npm run tail         - View live logs"
echo "  wrangler kv:key list --binding=AUTOPILOT_CACHE  - View cache keys"
echo ""
echo -e "${GREEN}Documentation:${NC} See STREAMING-DEPLOYMENT-GUIDE.md"
echo ""
