# Build & Deployment Agent

## Role
Specialist for NowSDK build system, deployment processes, configuration management, and troubleshooting build/deploy issues.

## Expertise
- NowSDK 4.0.2 build system
- Rollup bundler configuration
- ServiceNow deployment process
- TypeScript compilation
- Package management

## Primary Responsibilities

### 1. Build Configuration
**Files:** `now.config.json`, `now.prebuild.mjs`, `package.json`, `tsconfig.json`

**Tasks:**
- Configure NowSDK settings
- Manage build scripts
- Configure TypeScript compiler
- Set up Rollup bundler
- Handle static assets

### 2. Build Process

**Command:** `npm run build`

**What happens:**
1. Runs `now-sdk build`
2. Executes `now.prebuild.mjs` (if exists)
3. Compiles TypeScript files
4. Bundles React application with Rollup
5. Processes Fluent definitions
6. Generates output in build directory

**Prebuild Script (`now.prebuild.mjs`):**
```javascript
import { rollup } from '@servicenow/isomorphic-rollup'

export default async function prebuild({ staticContentDir }) {
  await rollup({
    input: 'src/client/main.tsx',
    staticContentDir,
    htmlFiles: ['src/client/index.html'],
    rollupOptions: {
      output: {
        format: 'iife',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      },
      external: ['react', 'react-dom']
    }
  })
}
```

### 3. Deployment Process

**⚠️ IMPORTANT: Deployment MUST be done from local machine with GUI**

**Command:** `npm run deploy` (local machine only)

**What happens:**
1. Runs `now-sdk install`
2. Authenticates with ServiceNow instance (requires GUI keychain)
3. Uploads application artifacts
4. Creates/updates tables
5. Creates/updates Script Includes
6. Creates/updates Business Rules
7. Creates/updates UI Pages
8. Uploads static content

**Workflow:**
```bash
# On local machine (NOT Codespaces):
cd planningpokerfluent
git pull          # Get latest changes from Codespaces
npm run build     # Build application
npm run deploy    # Deploy to ServiceNow
```

**Configuration (`now.config.json`):**
```json
{
  "scope": "x_1860782_msm_pl_0",
  "name": "Planning Poker",
  "staticContentPath": "staticContent",
  "tsconfigPath": "./src/server/tsconfig.json",
  "instanceUrl": "https://dev313212.service-now.com",
  "credentials": {
    "type": "basic",
    "username": "admin",
    "password": "stored-in-env"
  }
}
```

### 4. Quality Checks

**Pre-commit Checks:**
```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Lint errors only
npm run lint:errors-only

# Auto-fix lint issues
npm run lint:fix

# All checks
npm run check-all
```

**ESLint Configuration:**
```json
{
  "extends": [
    "@servicenow/eslint-plugin-sdk-app-plugin",
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "warn",
    "react/react-in-jsx-scope": "off",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

## Build System Architecture

### File Structure:
```
project/
├── src/
│   ├── fluent/          # Fluent artifacts (compiled)
│   ├── client/          # React app (bundled by Rollup)
│   └── server/          # Server TypeScript
├── build/               # NowSDK build output
├── staticContent/       # Bundled client assets
├── now.config.json      # NowSDK configuration
├── now.prebuild.mjs     # Prebuild script
├── package.json         # Scripts and dependencies
└── tsconfig.json        # TypeScript config
```

### Compilation Flow:
```
Source Code
    ↓
TypeScript Compiler (tsc)
    ↓
Fluent Transformer (now-sdk)
    ↓
Rollup Bundler (client code)
    ↓
Build Artifacts
    ↓
ServiceNow Deployment (now-sdk install)
```

## Common Build Tasks

### 1. Full Clean Build
```bash
# Remove build artifacts
rm -rf build/ staticContent/

# Clean install dependencies
rm -rf node_modules/
npm install

# Build from scratch
npm run build
```

### 2. Quick Build & Deploy
```bash
# Build and deploy in one step
npm run build && npm run deploy
```

### 3. Check Build Health
```bash
# Check all code quality
npm run check-all

# This runs:
# - npm run lint:errors-only
# - npm run build
```

### 4. Fix Common Issues
```bash
# Auto-fix linting issues
npm run lint:fix

# Type check without building
npm run type-check
```

## Deployment Strategies

### ⚠️ ALWAYS Deploy from Local Machine

**NowSDK Requirement:** GUI/Display for authentication
- NowSDK uses system keychain (requires D-Bus/X11)
- **Does NOT work in headless environments** (Codespaces, Docker, CI/CD)
- **MANDATORY:** All deployments must be from local machine with display

**Deployment Workflow:**
1. **Develop/Build in Codespaces** (optional)
2. **ALWAYS Deploy from Local Machine** (required)

### Standard Deployment Process (Local Machine):

**Step 1: Setup (One-time)**
```bash
# Clone repository to local machine
git clone <repo-url>
cd planningpokerfluent

# Install dependencies
npm install

# Authenticate with ServiceNow (stores credentials in keychain)
npx now-sdk auth
```

**Step 2: Deploy Development Changes**
```bash
# Pull latest changes from Codespaces
git pull

# Build locally (or use pre-built artifacts)
npm run build

# Deploy to dev instance
npm run deploy
```

**Step 3: Production Deployment**
```bash
# Ensure all tests pass
npm run check-all

# Build production bundle
NODE_ENV=production npm run build

# Deploy to production
npm run deploy -- --instance prod
```

### Quick Deploy (After Initial Setup):
```bash
# Standard workflow
git pull          # Get latest code
npm run build     # Build application
npm run deploy    # Deploy to ServiceNow
```

### Alternative: Deploy with Auth Alias
```bash
# Use saved credentials
npx now-sdk install --auth admin
```

### Rollback:
```bash
# 1. Checkout previous version
git checkout <previous-commit>

# 2. Rebuild
npm run build

# 3. Deploy
npm run deploy
```

## Configuration Management

### Instance Configuration:
```json
// now.config.json
{
  "scope": "x_1860782_msm_pl_0",
  "name": "Planning Poker",
  "instanceUrl": "${INSTANCE_URL}",  // From environment
  "credentials": {
    "type": "oauth",
    "clientId": "${CLIENT_ID}",
    "clientSecret": "${CLIENT_SECRET}"
  }
}
```

### Environment Variables:
```bash
# .env file (not committed)
INSTANCE_URL=https://dev313212.service-now.com
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
```

### TypeScript Configuration:
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "moduleResolution": "node",
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "build"]
}
```

## Troubleshooting Guide

### Deployment Errors

**"Cannot autolaunch D-Bus without X11 $DISPLAY":**
```bash
# This error means you're trying to deploy from Codespaces/headless environment
# SOLUTION: Always deploy from local machine

# On your local machine:
cd planningpokerfluent
git pull          # Get latest changes
npm run build     # Build application
npm run deploy    # Deploy to ServiceNow
```

**"No credentials found" or "Authentication required":**
```bash
# Run initial authentication on local machine
npx now-sdk auth

# Follow OAuth flow in browser
# Credentials will be stored in system keychain
```

**Verify Authentication Status:**
```bash
# List stored credentials (only works on local machine)
npx now-sdk auth --list

# Should show your authenticated instances
```

# Expected output in Codespaces:
# "Successfully authenticated to instance..."
# "ERROR: Cannot autolaunch D-Bus..." <- Normal in headless
```

### Build Errors

**TypeScript Errors:**
```bash
# Check specific error
npm run type-check

# Common fixes:
# - Fix import paths
# - Add type definitions
# - Fix type annotations
```

**Rollup Errors:**
```bash
# Check prebuild script
# Verify entry points exist
# Check external dependencies

# Debug:
console.log('staticContentDir:', staticContentDir)
```

**Fluent Transformation Errors:**
```bash
# Check Fluent syntax
# Verify imports from @servicenow/sdk-core/db
# Ensure proper exports from index.now.ts
```

### Deployment Errors

**Authentication Failed:**
```bash
# Check credentials
# Verify instance URL
# Test manual login

# Re-authenticate:
now-sdk configure
```

**Upload Failed:**
```bash
# Check network connectivity
# Verify instance is accessible
# Check file sizes (ServiceNow limits)

# Retry deployment:
npm run deploy -- --force
```

**Table Creation Failed:**
```bash
# Check table names (no conflicts)
# Verify field types are valid
# Check for circular dependencies
# Review ServiceNow logs
```

### Runtime Errors

**Module Not Found:**
```bash
# Rebuild with clean install
npm install
npm run build
```

**Assets Not Loading:**
```bash
# Check staticContentPath in now.config.json
# Verify Rollup output
# Check browser network tab
```

## Performance Optimization

### Build Speed:
```bash
# Use incremental builds
npm run build -- --incremental

# Skip type checking during rapid development
# (but run before commit!)
```

### Bundle Size:
```javascript
// Use code splitting in Rollup
export default {
  input: 'src/client/main.tsx',
  output: {
    format: 'es',
    chunkFileNames: '[name]-[hash].js'
  },
  manualChunks: {
    vendor: ['react', 'react-dom']
  }
}
```

### Deployment Speed:
```bash
# Deploy only changed files (if supported)
npm run deploy -- --incremental

# Use faster network connection
# Compress assets before upload
```

## Key Rules

### ✅ DO:
1. Run `npm run check-all` before commits
2. Use `npm run build` before `npm run deploy`
3. Keep `now.config.json` in sync with instance
4. Version control all configuration files
5. Use environment variables for credentials
6. Test builds locally before deploying
7. Keep dependencies up to date
8. Document custom build steps
9. Use semantic versioning
10. Maintain build logs

### ❌ DON'T:
1. Deploy without building first
2. Commit credentials to git
3. Skip type checking
4. Ignore build warnings
5. Deploy directly to production
6. Modify build artifacts manually
7. Use outdated dependencies
8. Skip testing after deployment
9. Deploy with linting errors
10. Ignore deployment errors

## Checklists

### Pre-Commit:
- [ ] `npm run type-check` passes
- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds
- [ ] Code is formatted consistently
- [ ] No console.log in production code
- [ ] Documentation updated

### Pre-Deployment:
- [ ] All tests pass
- [ ] Build succeeds
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] Version number updated
- [ ] Changelog updated
- [ ] Backup current version

### Post-Deployment:
- [ ] Application loads in ServiceNow
- [ ] No console errors
- [ ] All features work
- [ ] Database tables updated
- [ ] No system log errors
- [ ] Performance acceptable

## Commands Reference

```bash
# Build
npm run build              # Full build
npm run type-check         # Type check only
npm run transform          # Transform Fluent code

# Deploy
npm run deploy             # Deploy to instance
npm run types              # Sync dependencies

# Quality
npm run lint               # Check code quality
npm run lint:fix           # Auto-fix issues
npm run lint:errors-only   # Show errors only
npm run check-all          # Full check

# Utilities
npm install                # Install dependencies
npm update                 # Update dependencies
npm audit                  # Security audit
npm audit fix              # Fix vulnerabilities
```

## Support Resources

- NowSDK Documentation: [ServiceNow Docs]
- Rollup Documentation: https://rollupjs.org/
- TypeScript Handbook: https://www.typescriptlang.org/
- Build Troubleshooting: See `BUILD_PROMPT.md`
