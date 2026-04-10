# FieldSync Dashboards - Quick Start

This quick start reflects the current frontend state of FieldSync.

Available now in the codebase:

- Admin Dashboard: **Complete** ✅
- Supervisor Dashboard: **Complete** ✅ (incl. Project Context)
- Team Leader Frontend: planned
- Field Worker Frontend: planned
- Backend and production integrations: planned after the remaining role surfaces

## 1. Start the Application

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open either dashboard in your browser:

```txt
http://localhost:3000/dashboard
http://localhost:3000/supervisor
```

## 2. What You Can Access Right Now

The current repository contains two frontend surfaces:

- Admin Dashboard: the system-level control plane for platform governance
- Supervisor Dashboard: the project-level workspace for field operations control

Still not implemented as dedicated frontends:

- Team Leader
- Field Worker

## 3. Admin Dashboard Navigation

Main admin route:

```txt
/dashboard
```

Key admin areas:

- System Overview
- Global Users
- Supervisors
- Projects Overview
- Global Form Templates
- System Analytics
- Audit and Logs
- Security Center
- Alerts
- Broadcast
- Settings
- Emergency Control
- Maintenance modules such as server, database, backups, storage, rate limits, sync, API monitor, feature flags, and sandbox

Recommended admin tour:

1. `/dashboard`
2. `/dashboard/users`
3. `/dashboard/projects`
4. `/dashboard/security`
5. `/dashboard/audit`
6. `/dashboard/maintenance`

## 4. Supervisor Dashboard Navigation

Main supervisor route:

```txt
/supervisor (Workspace)
```

Key supervisor areas:

- Project List (Workspace)
- Project Creation Wizard
- Project Dashboard (Scoped)
- Live Map
- Teams & Users
- Zones & Geofencing
- Forms and Tasks
- Analytics & Audit Logs
- Project settings
- Personal settings

Recommended supervisor tour:

1. `/supervisor` (Project List)
2. `/supervisor/projects/new` (Creation Flow)
3. `/supervisor/projects/proj-nairobi-2026` (Sample Project Overview)
4. `/supervisor/projects/proj-nairobi-2026/map` (Live project map)
5. `/supervisor/projects/proj-nairobi-2026/analytics` (Project data)

## 5. How to Read the Current State

These dashboards are already available as frontend product surfaces, but they are not yet fully wired to a production backend.

That means:

- The route structure and UI flows are in place
- The role separation between Admin and Supervisor is now visible in the product
- Team Leader and Field Worker surfaces are still future phases
- Authentication, persistence, live production telemetry, and business logic are still later implementation work

## 6. Helpful Documents

For deeper context, continue with:

- [README.md](./README.md)
- [PROJECT DOCUMENTATION.md](./PROJECT%20DOCUMENTATION.md)
- [ADMIN DASHBOARD UPDATED.md](./ADMIN%20DASHBOARD%20UPDATED.md)
- [SUPERVISOR DASHBOARD.md](./SUPERVISOR%20DASHBOARD.md)
- [MODULE OUTLINE.md](./MODULE%20OUTLINE.md)
- [SYSTEM MAINTAINANCE FEATURES.md](./SYSTEM%20MAINTAINANCE%20FEATURES.md)

## 7. Fastest Meaningful Walkthrough

If you want the quickest way to understand the current product direction:

1. Open `/dashboard` to see the system-level Admin layer
2. Open `/supervisor` to see the project-level Supervisor layer
3. Compare [ADMIN DASHBOARD UPDATED.md](./ADMIN%20DASHBOARD%20UPDATED.md) with [SUPERVISOR DASHBOARD.md](./SUPERVISOR%20DASHBOARD.md)

That gives you the clearest view of the current architecture shift: Admin owns the platform, while Supervisor owns project execution.
