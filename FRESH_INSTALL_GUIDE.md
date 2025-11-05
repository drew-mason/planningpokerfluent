# Fresh ServiceNow Instance Installation Guide

## Problem
When deploying to a fresh ServiceNow instance, you may encounter:
- "Scope is invalid or already exists"
- Git clone failures during initialization

## Solution: Manual Installation Steps

### Option 1: Create New Application on ServiceNow (RECOMMENDED)

1. **Login to your fresh ServiceNow instance**
   - Navigate to: https://YOUR_INSTANCE.service-now.com

2. **Create a New Scoped Application**
   - Go to: **System Applications > Studio**
   - Click **"Create Application"**
   - Fill in:
     - **Name:** MSM Planning Poker
     - **Scope:** Leave blank (auto-generate) or use: `x_[company_id]_msm_poker`
   - Click **"Create"**

3. **Note the Generated Scope**
   - After creation, ServiceNow will show the scope (e.g., `x_123456_msm_poker`)
   - **Copy this scope value**

4. **Update Your Local Configuration**
   ```bash
   # In your local project
   cd /Users/andrewmason/ai_folder/planningpokerfluent/planningpokerfluent
   ```
   
   Edit `now.config.json`:
   ```json
   {
     "scope": "x_YOUR_GENERATED_SCOPE_HERE",
     "scopeId": "auto_generated_by_servicenow",
     "name": "MSM Planning Poker",
     "tsconfigPath": "./src/server/tsconfig.json"
   }
   ```

5. **Update All Table References**
   ```bash
   # Replace scope in all source files
   find src/ -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.now.ts" \) \
     -exec sed -i '' 's/x_snc_msm_ppoker/x_YOUR_GENERATED_SCOPE/g' {} +
   ```

6. **Build and Deploy**
   ```bash
   npm run build
   npm run deploy
   ```

---

### Option 2: Let ServiceNow Auto-Generate Scope

If you want ServiceNow to automatically handle everything:

1. **Delete the `scope` and `scopeId` from now.config.json**
   
   Unfortunately, NowSDK 4.0.2 **requires** these fields, so this won't work with the current SDK version.

2. **Alternative: Use ServiceNow Studio Import**
   - Build locally: `npm run build`
   - Export the build artifacts
   - Import manually through Studio

---

### Option 3: Use a Guaranteed Unique Scope

Use a scope with timestamp or random identifier:

1. **Generate a Unique Scope**
   ```bash
   # Example with timestamp
   UNIQUE_SCOPE="x_msm_poker_$(date +%Y%m%d)"
   echo $UNIQUE_SCOPE
   # Output: x_msm_poker_20251105
   ```

2. **Update now.config.json**
   ```json
   {
     "scope": "x_msm_poker_20251105",
     "scopeId": "msm_planning_poker_20251105_0000",
     "name": "MSM Planning Poker"
   }
   ```

3. **Update All References**
   ```bash
   find src/ -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.now.ts" \) \
     -exec sed -i '' 's/x_snc_msm_ppoker/x_msm_poker_20251105/g' {} +
   ```

4. **Build and Deploy**
   ```bash
   npm run build
   npm run deploy
   ```

---

## Current Scope in Project

The project is currently configured with:
- **Scope:** `x_snc_msm_ppoker`
- **Table Prefix:** `x_snc_msm_ppoker_*`

### All Tables Using This Scope:
- `x_snc_msm_ppoker_session`
- `x_snc_msm_ppoker_session_stories`
- `x_snc_msm_ppoker_vote`
- `x_snc_msm_ppoker_session_participant`

---

## Automated Scope Change Script

Create a bash script to change scopes easily:

```bash
#!/bin/bash
# change_scope.sh

OLD_SCOPE="x_snc_msm_ppoker"
NEW_SCOPE="$1"

if [ -z "$NEW_SCOPE" ]; then
    echo "Usage: ./change_scope.sh <new_scope>"
    echo "Example: ./change_scope.sh x_123456_msm_poker"
    exit 1
fi

echo "Changing scope from $OLD_SCOPE to $NEW_SCOPE..."

# Update now.config.json
sed -i '' "s/$OLD_SCOPE/$NEW_SCOPE/g" now.config.json

# Update all source files
find src/ -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.now.ts" \) \
    -exec sed -i '' "s/$OLD_SCOPE/$NEW_SCOPE/g" {} +

echo "✅ Scope updated successfully!"
echo "Run: npm run build && npm run deploy"
```

Save as `change_scope.sh`, make executable:
```bash
chmod +x change_scope.sh
./change_scope.sh x_123456_msm_poker
```

---

## Troubleshooting

### Error: "Scope already exists"
**Cause:** The scope name conflicts with an existing application on the instance.

**Solutions:**
1. Choose a different scope name
2. Delete the existing application (if it's yours)
3. Use the Studio-created scope from Option 1

### Error: "Git clone failed"
**Cause:** ServiceNow is trying to initialize git repository with mismatched credentials.

**Solutions:**
1. Use Option 1 (create app in Studio first)
2. Ensure git credentials are configured in ServiceNow
3. Use manual import instead of git-based deployment

### Error: "Invalid scopeId"
**Cause:** ScopeId must be exactly 32 hexadecimal characters.

**Solution:**
```bash
# Generate valid scopeId
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
# Use output in now.config.json
```

---

## Recommended Workflow for Fresh Installation

1. ✅ **Create app in ServiceNow Studio** (gets auto-generated scope)
2. ✅ **Copy the generated scope**
3. ✅ **Update `now.config.json` locally**
4. ✅ **Run scope change script**
5. ✅ **Build and deploy**: `npm run build && npm run deploy`

This ensures the scope matches between ServiceNow and your local project!

---

## Support

If you continue to have issues:
1. Check ServiceNow system logs: System Logs > Application Logs
2. Verify scope doesn't exist: System Definition > Application/Scope
3. Try creating through Studio first before deploying code
4. Ensure you have admin rights on the instance

---

**Last Updated:** November 5, 2025  
**Current Scope:** x_snc_msm_ppoker  
**Application:** MSM Planning Poker v1.0.0
