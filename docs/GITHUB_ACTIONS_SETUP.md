# GitHub Actions Setup Guide

This guide explains how to set up GitHub Actions for automatic deployment to Vercel.

## 📋 Prerequisites

- GitHub repository with admin access
- Vercel account
- Vercel project created

---

## 🔐 Step 1: Get Vercel Tokens

### 1.1 Get Vercel Access Token

1. Go to [Vercel Account Settings](https://vercel.com/account/tokens)
2. Click **"Create Token"**
3. Give it a name: `GitHub Actions - IVYAR`
4. Set scope: **Full Account**
5. Click **"Create"**
6. **Copy the token** (you won't see it again!)

### 1.2 Get Vercel Project ID

**Option A: From Vercel Dashboard**
1. Go to your project in Vercel
2. Go to **Settings** → **General**
3. Scroll down to **"Project ID"**
4. Copy the ID

**Option B: From CLI**
```bash
cd ~/ivyar-governance-portal
vercel link
# Follow prompts to link project
# Then check .vercel/project.json for projectId
cat .vercel/project.json
```

### 1.3 Get Vercel Organization ID

**From `.vercel/project.json`:**
```bash
cat .vercel/project.json
# Look for "orgId"
```

**Or from Vercel Dashboard:**
1. Go to [Team Settings](https://vercel.com/teams)
2. Copy your team/org ID from the URL

---

## 🔧 Step 2: Add GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Add these three secrets:

### Secret 1: VERCEL_TOKEN
- **Name:** `VERCEL_TOKEN`
- **Value:** Your Vercel access token from Step 1.1

### Secret 2: VERCEL_ORG_ID
- **Name:** `VERCEL_ORG_ID`
- **Value:** Your organization ID from Step 1.3

### Secret 3: VERCEL_PROJECT_ID
- **Name:** `VERCEL_PROJECT_ID`
- **Value:** Your project ID from Step 1.2

---

## 📁 Step 3: Add Workflow Files

Create the GitHub Actions workflow directory and files:

```bash
cd ~/ivyar-governance-portal

# Create .github/workflows directory
mkdir -p .github/workflows

# Copy workflow files
cp ~/Downloads/deploy.yml .github/workflows/
cp ~/Downloads/quality.yml .github/workflows/

# Verify files exist
ls -la .github/workflows/
```

---

## 🚀 Step 4: Commit and Push

```bash
cd ~/ivyar-governance-portal

# Add files
git add .github/

# Commit
git commit -m "ci: Add GitHub Actions workflows for auto-deploy and quality checks"

# Push
git push origin new-homepage-design
```

---

## ✅ Step 5: Verify

1. Go to your GitHub repository
2. Click **Actions** tab
3. You should see workflows running!

**Two workflows will appear:**
- 🚀 **Deploy to Vercel** - Automatic deployment
- 📊 **Code Quality** - Linting and type checking

---

## 🎯 How It Works

### On Every Push to `main` or `new-homepage-design`:
1. ✅ Build verification
2. ✅ Type checking
3. 🚀 **Deploy to Vercel Production**
4. 📝 Deployment summary posted

### On Every Pull Request:
1. ✅ Build verification
2. ✅ Code quality checks
3. 🔍 **Deploy preview**
4. 💬 Comment with preview URL

---

## 📊 Workflow Status Badges

Add these to your README.md:

```markdown
[![Deploy](https://github.com/yarmis/ivyar-governance-portal/actions/workflows/deploy.yml/badge.svg)](https://github.com/yarmis/ivyar-governance-portal/actions/workflows/deploy.yml)
[![Code Quality](https://github.com/yarmis/ivyar-governance-portal/actions/workflows/quality.yml/badge.svg)](https://github.com/yarmis/ivyar-governance-portal/actions/workflows/quality.yml)
```

---

## 🔍 Troubleshooting

### Workflow fails with "VERCEL_TOKEN not found"
- ✅ Double-check secret names (case-sensitive!)
- ✅ Verify secrets are set in repository settings

### Build fails
- ✅ Run `npm run build` locally first
- ✅ Check for TypeScript errors
- ✅ Verify all dependencies are in package.json

### Deployment succeeds but site is broken
- ✅ Check Vercel logs
- ✅ Verify environment variables in Vercel dashboard
- ✅ Test production build locally: `npm run build && npm start`

---

## 📞 Need Help?

If you encounter issues:
1. Check [GitHub Actions logs](https://github.com/yarmis/ivyar-governance-portal/actions)
2. Check [Vercel deployment logs](https://vercel.com/dashboard)
3. Review [Vercel GitHub Integration docs](https://vercel.com/docs/deployments/git/vercel-for-github)

---

## 🎉 Success!

Once set up, every push will automatically:
- ✅ Run quality checks
- ✅ Build the project
- 🚀 Deploy to Vercel
- 📝 Post deployment status

**No manual deployment needed!** 🎊
