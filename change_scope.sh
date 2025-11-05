#!/bin/bash
# change_scope.sh - Automated scope changer for MSM Planning Poker

OLD_SCOPE="x_snc_msm_ppoker"
NEW_SCOPE="$1"

if [ -z "$NEW_SCOPE" ]; then
    echo "❌ Error: No scope provided"
    echo ""
    echo "Usage: ./change_scope.sh <new_scope>"
    echo ""
    echo "Examples:"
    echo "  ./change_scope.sh x_123456_msm_poker"
    echo "  ./change_scope.sh x_acme_planning_poker"
    echo ""
    echo "💡 Tip: Create app in ServiceNow Studio first to get auto-generated scope!"
    exit 1
fi

echo "🔄 Changing scope from '$OLD_SCOPE' to '$NEW_SCOPE'..."
echo ""

# Update now.config.json
echo "📝 Updating now.config.json..."
sed -i '' "s/$OLD_SCOPE/$NEW_SCOPE/g" now.config.json

# Update all source files
echo "📝 Updating source files..."
find src/ -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.now.ts" \) \
    -exec sed -i '' "s/$OLD_SCOPE/$NEW_SCOPE/g" {} +

echo ""
echo "✅ Scope updated successfully!"
echo ""
echo "📊 Summary:"
echo "  Old Scope: $OLD_SCOPE"
echo "  New Scope: $NEW_SCOPE"
echo ""
echo "🚀 Next steps:"
echo "  1. npm run build"
echo "  2. npm run deploy"
echo ""
