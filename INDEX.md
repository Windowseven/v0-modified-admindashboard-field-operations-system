# FieldSync Documentation Index

This index reflects the current state of the repository.

Implemented frontend surfaces:

- Admin Dashboard at `/dashboard` ✅
- Supervisor Dashboard at `/supervisor` ✅ (with Workspace/Project context)

Still planned:

- Team Leader frontend
- Field Worker frontend
- Backend and production service wiring

## Start Here

- [README.md](./README.md)
  Overall repository scope, current status, route summary, and project structure.
- [QUICK_START.md](./QUICK_START.md)
  Fastest way to run the app and tour both dashboards.
- [PROJECT DOCUMENTATION.md](./PROJECT%20DOCUMENTATION.md)
  Product vision, role model, delivery phases, and architecture.

## Role-Specific Docs

- [ADMIN DASHBOARD UPDATED.md](./ADMIN%20DASHBOARD%20UPDATED.md)
  Admin responsibilities, permissions, and system-level boundaries.
- [SUPERVISOR DASHBOARD.md](./SUPERVISOR%20DASHBOARD.md)
  Supervisor responsibilities, project-level visibility, and operational boundaries.

## Technical and Product Docs

- [DASHBOARD.md](./DASHBOARD.md)
  General dashboard notes and implementation overview.
- [DASHBOARD_IMPLEMENTATION.md](./DASHBOARD_IMPLEMENTATION.md)
  Technical structure and implementation details.
- [MODULE OUTLINE.md](./MODULE%20OUTLINE.md)
  Broader platform module breakdown.
- [SYSTEM MAINTAINANCE FEATURES.md](./SYSTEM%20MAINTAINANCE%20FEATURES.md)
  System maintenance and reliability tooling.
- [ADMIN_DASHBOARD_SUMMARY.md](./ADMIN_DASHBOARD_SUMMARY.md)
  Summary of the admin dashboard surface.

## Current Route Summary

Admin routes:

- `/dashboard`
- `/dashboard/users`
- `/dashboard/supervisors`
- `/dashboard/projects`
- `/dashboard/forms`
- `/dashboard/tracking`
- `/dashboard/analytics`
- `/dashboard/audit`
- `/dashboard/security`
- `/dashboard/alerts`
- `/dashboard/broadcast`
- `/dashboard/settings`
- `/dashboard/emergency`
- `/dashboard/maintenance`

Supervisor routes:

- `/supervisor` (Workspace Redirect)
- `/supervisor/projects` (Project List)
- `/supervisor/projects/new` (Creation Wizard)
- `/supervisor/projects/[projectId]/*` (All operational modules)
- `/supervisor/settings` (Personal settings)

## Recommended Read Order

1. [README.md](./README.md)
2. [QUICK_START.md](./QUICK_START.md)
3. [PROJECT DOCUMENTATION.md](./PROJECT%20DOCUMENTATION.md)
4. [ADMIN DASHBOARD UPDATED.md](./ADMIN%20DASHBOARD%20UPDATED.md)
5. [SUPERVISOR DASHBOARD.md](./SUPERVISOR%20DASHBOARD.md)

## Current Architecture Snapshot

- Admin owns platform-wide governance, security, audit, maintenance, and global visibility
- Supervisor owns project execution, teams, zones, tasks, invitations, and project analytics
- Team Leader and Field Worker remain future frontend phases

This means the documentation should now be read as a complete Admin plus Supervisor system, including multi-project support.
