# FieldSync Admin Dashboard - Quick Start

This quick start guide is for the current completed frontend milestone of the FieldSync platform: the Admin Dashboard.

FieldSync is being built in stages:

- Admin Dashboard: complete
- Supervisor Frontend: planned
- Team Leader Frontend: planned
- Field Worker Frontend: planned
- Backend implementation: planned after the main frontend role surfaces are complete

## 1. Start the Application

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open the app in your browser:

```txt
http://localhost:3000/dashboard
```

## 2. What You Are Accessing Right Now

The current frontend scope is the Admin Dashboard, which acts as the system-level control plane for FieldSync.

This means the current UI focuses on:

- Global system visibility
- User and supervisor oversight
- Project monitoring
- Security review
- Audit and analytics
- System maintenance and operational controls

This is not yet the Supervisor, Team Leader, or Field Worker frontend.

## 3. Main Navigation

The sidebar is organized into the following sections.

### System Overview

- System Overview
- Real-Time Activity

### Platform Control

- Global Users
- Supervisors
- Projects Overview
- Global Form Templates

### Analytics and Audit

- System Analytics
- Audit and Logs

### Security

- Security Center
- System Alerts

### System Maintenance

- System Health
- Server Status
- Database
- Backup and Restore
- Error Tracking
- Rate Limiting
- Sync Monitor
- Storage
- API Monitor
- Feature Flags
- Test Environment

### Configuration

- Notifications
- Broadcast
- System Settings
- Emergency Control

## 4. Recommended First Tour

If you are opening the project for the first time, use this route order:

1. `/dashboard`
   Review the platform overview, KPIs, activity, and quick actions.
2. `/dashboard/users`
   Explore global user management and role-based user tabs.
3. `/dashboard/supervisors`
   Review supervisor visibility and moderation controls.
4. `/dashboard/projects`
   Inspect project oversight and status filtering.
5. `/dashboard/security`
   Review the security center, threats, sessions, and access policies.
6. `/dashboard/audit`
   Check the system audit trail and event history.
7. `/dashboard/maintenance`
   Explore operational and maintenance-level views.

## 5. Key Areas and What They Mean

### System Overview

The main dashboard summarizes the current platform state, including:

- Global usage metrics
- System health indicators
- Activity trends
- User distribution
- Recent activity
- Quick navigation shortcuts

### Global Users

This section gives the Admin a platform-wide view of users across roles. You can:

- View all users
- Filter by role
- Filter by status
- Open role-specific tabs
- Access moderation-style actions

### Supervisors

This section is for system-level visibility into supervisors. It supports:

- Reviewing supervisor accounts
- Monitoring activity-related data
- Investigating supervisor status
- Understanding project ownership at a high level

### Projects Overview

This is a read-only plus control-layer project view for Admin. It helps you:

- See all projects across the system
- Review active versus frozen projects
- Inspect project ownership
- Understand activity level and moderation options

### Global Form Templates

This section represents the admin-level template layer. It allows:

- Reviewing global reusable templates
- Opening the create-template flow
- Managing template visibility and status conceptually

### Security Center

This area groups together:

- Security overview
- Threat detection
- Session management
- Access policies

Use it to review suspicious activity, platform sessions, and policy-level controls.

### Audit and Logs

This is the investigation surface for platform events. It is useful for:

- Tracking admin actions
- Reviewing security-relevant events
- Inspecting submission and user activity
- Following system-level history

### System Maintenance

This is one of the most important parts of the current dashboard. It covers:

- System health
- Server and database views
- Backup and restore
- Error tracking
- Rate limiting
- Sync monitoring
- Storage monitoring
- API monitoring
- Feature flags
- Test environment tooling

### Configuration and Emergency Control

This section supports operational control at platform level, including:

- Notifications
- Broadcast messages
- System settings
- Emergency controls

## 6. Common Workflows

### Review Overall Platform Status

1. Open `/dashboard`
2. Check KPI cards and system health
3. Review recent activity
4. Use quick actions to jump to areas needing attention

### Inspect Global Users

1. Open `/dashboard/users`
2. Use search and filters
3. Switch between role tabs
4. Open user action menus for moderation-style actions

### Check Security Issues

1. Open `/dashboard/security`
2. Review the overview cards
3. Open threats, sessions, or policies depending on the issue
4. Cross-check events in `/dashboard/audit`

### Investigate an Operational Issue

1. Open `/dashboard/alerts`
2. Review `/dashboard/audit`
3. Check `/dashboard/security` if the issue is security-related
4. Check `/dashboard/maintenance` if the issue looks infrastructural

### Review System Maintenance Status

1. Open `/dashboard/maintenance`
2. Inspect health and performance panels
3. Drill into server, database, storage, sync, or errors
4. Review backup, feature flags, or sandbox if needed

## 7. UI Notes

### Sidebar Behavior

- The sidebar supports grouped navigation
- Active items are highlighted
- Some sections contain nested links
- On smaller screens the navigation collapses appropriately

### Notifications

- The header notification control provides a quick in-app notification panel
- Full alert-style review happens in the alerts section

### Theme Toggle

- The user menu in the sidebar footer includes the theme switch
- Light and dark mode can be toggled there

## 8. Current Development Reality

When using this quick start, keep in mind:

- The current completed frontend is the Admin Dashboard
- Some pages represent product-ready interfaces before full backend wiring
- Supervisor, Team Leader, and Field Worker interfaces are still future frontend phases
- Backend services will come after the role-based frontend surfaces are completed

## 9. Helpful Documents

For deeper understanding, continue with:

- [README.md](./README.md)
- [PROJECT DOCUMENTATION.md](./PROJECT%20DOCUMENTATION.md)
- [MODULE OUTLINE.md](./MODULE%20OUTLINE.md)
- [ADMIN DASHBOARD UPDATED.md](./ADMIN%20DASHBOARD%20UPDATED.md)
- [SYSTEM MAINTAINANCE FEATURES.md](./SYSTEM%20MAINTAINANCE%20FEATURES.md)

## 10. First Recommendation

If you want the fastest meaningful walkthrough, start here:

1. `/dashboard`
2. `/dashboard/users`
3. `/dashboard/projects`
4. `/dashboard/security`
5. `/dashboard/audit`
6. `/dashboard/maintenance`

That path gives you the clearest view of what the current FieldSync admin milestone already covers.
