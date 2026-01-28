# Security Configuration Instructions

## Overview
This document provides instructions for fixing the Auth DB Connection Strategy security issue that cannot be automated via code.

## Auth DB Connection Strategy Fix

### Issue
Your project's Auth server is configured to use a fixed number of connections (10) instead of a percentage-based allocation. This prevents the Auth server from scaling properly when you increase your database instance size.

### Solution
This setting must be updated through the Supabase Dashboard:

1. **Navigate to your Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project: `rwkvmaiitmfkxqsymfex`

2. **Access Database Settings**
   - Click on "Project Settings" (gear icon in the left sidebar)
   - Navigate to "Database" section
   - Scroll to "Connection Pooling"

3. **Update Auth Pooler Configuration**
   - Find the "Auth" pooler section
   - Change the connection strategy from "Fixed (10 connections)" to "Percentage-based"
   - Recommended setting: **15-20% of max_connections**
   - Click "Save" or "Update"

4. **Verify the Change**
   - The Auth server will automatically restart with the new configuration
   - Connection pool will now scale with your database instance size

### Why This Matters
- **Scalability**: Percentage-based allocation allows the Auth server to use more connections as your database grows
- **Performance**: Prevents Auth bottlenecks when handling many concurrent users
- **Flexibility**: Automatically adjusts when you upgrade your database tier

### Alternative (API Method)
If you have access to the Supabase Management API, you can also update this programmatically:

```bash
# This requires your Supabase access token
curl -X PATCH 'https://api.supabase.com/v1/projects/{ref}/config/auth' \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"db_pool_strategy": "percentage", "db_pool_percentage": 15}'
```

## RLS Policy Fix

✅ **Already Fixed** - The RLS policy has been automatically updated via database migration.

### What Was Fixed
- Removed the insecure INSERT policy that had `WITH CHECK (true)`
- Added a new policy with proper validation:
  - Validates all required fields are present and not empty
  - Enforces maximum length limits to prevent abuse
  - Checks data types and format

### Migration Applied
- Migration file: `fix_rls_security_policy`
- Policy name: "Validated insert for Toekomst IDs"
- Status: ✅ Applied successfully

## Summary

| Issue | Status | Action Required |
|-------|--------|----------------|
| RLS Policy Always True | ✅ Fixed | None - automatically applied |
| Auth DB Connection Strategy | ⚠️ Manual Action Required | Update via Supabase Dashboard |

---

**Note**: The RLS policy fix has been automatically applied to your database. Only the Auth connection strategy requires manual configuration through the Supabase Dashboard.
