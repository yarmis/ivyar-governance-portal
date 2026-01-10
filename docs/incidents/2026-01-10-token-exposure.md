# Service Token Exposure Incident

**Date:** 2026-01-10
**Status:** RESOLVED
**Environment:** Development only

## What Happened
Service Token accidentally exposed during Cloudflare Access setup.

## Resolution
- Token revoked within 10 minutes
- Database audited - no unauthorized changes
- New token to be created (not exposed)

## Lessons
- Never use NEXT_PUBLIC_* for secrets
- Always use server-side API proxy
