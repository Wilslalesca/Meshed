# Team Bulk Add (Manager-Only)

This document describes the feature that lets team managers (and admins) invite multiple athletes at once using CSV or Excel uploads.

## Overview
- Purpose: streamline onboarding of athletes to a team.
- Entry points (UI):
  - Team page toolbar: "Bulk Upload CSV" button (manager-only).
  - "Add User" modal: file input accepts CSV/Excel; selecting a file switches to bulk mode.
- Supported file types: `.csv`, `.xlsx`, `.xls`.

## Roles & Permissions
- Allowed: team `manager` and global `admin` only.
- Denied: athletes and non-managers.
- Enforcement:
  - Backend verifies team manager status via `TeamStaffModel.findStaffRecord(teamId, userId)`.
  - Admins bypass team check.

## API
- `POST /teams/:teamId/athletes/bulk-upload`
- Auth: `Authorization: Bearer <access_token>` (required)
- Content-Type: `multipart/form-data`
- Form field: `file` (CSV or Excel)
- Responses:
  - `200 OK`: `{ success: true, message, details: { success, failed, errors[] } }`
  - `400 Bad Request`: missing file, unsupported type, or no valid emails found
  - `403 Forbidden`: user lacks manager/admin permission
  - `404 Not Found`: unknown `teamId`
- Single invite reference: `POST /teams/:teamId/athletes/by-email` with JSON `{ email }`.

## Parsing & Validation
- CSV: emails extracted from lines (one per line or comma/space separated).
- Excel: scans all cells in all sheets; any text matching an email pattern is collected.
- Duplicates removed; emails normalized to lowercase.
- Invalid emails ignored and reported in `details.errors`.

## Data Effects
- For each email:
  - Existing user: add to `user_teams` with role `athlete`.
  - New email: create a "ghost" user (pending activation), then add to `user_teams`.
  - Ghost users get an invite token via `InviteModel.createInvite(...)`.

## Email Notifications
- Provider: Resend.
- Required environment variables:
  - `RESEND_API_KEY` (if missing, sending is skipped with a warning).
  - `FRONTEND_ORIGIN` used to build invite/login links.
- Messages:
  - Ghost users: invite email with activation link (`/register/invite?invite=<token>`).
  - Existing users: "added to team" email with link to login.

## UI Details
- Team toolbar (manager-only): `Edit`, `Delete`, `Add User`, `Bulk Upload CSV`.
- Invite modal:
  - Email field for single invite.
  - File input for bulk import (`.csv,.xlsx,.xls`).
  - Selecting a file disables email input; bulk upload runs on submit.

## Error Handling
- Clear messages for invalid type, missing file, and partial failures.
- Backend returns per-email errors in `details.errors`.

## Security Considerations
- All routes require a valid access token.
- Team-scoped manager verification prevents athlete-led bulk imports.
- Suggested hardening (future): file size limits, rate limiting, server-side content-type validation.

## Example Workflow
1. Manager opens team page and clicks "Bulk Upload CSV" (or uses the file input in the invite modal).
2. Selects `.csv` or `.xlsx/.xls` with athlete emails.
3. API parses emails, creates ghost users as needed, and adds all athletes to the team.
4. Emails send (if `RESEND_API_KEY` is set).
5. Roster refresh shows newly added members.
