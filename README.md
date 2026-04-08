# FieldSync Admin Dashboard

FieldSync Admin Dashboard is a Next.js-based admin and control-plane interface for a real-time field operations platform. It is designed for organizations running distributed field work such as surveys, census programs, outreach campaigns, inspections, and operational monitoring.

The platform separates responsibilities across four primary roles:

- Admin: system owner and platform controller
- Supervisor: project owner and operational manager
- Team Leader: field execution coordinator
- Field Worker: task executor and data collector

This repository currently focuses on the dashboard experience, admin control surfaces, and supporting product documentation for the broader FieldSync platform.

## Overview

FieldSync is built around two major layers:

- Project operations: projects, teams, zones, forms, tracking, submissions, analytics
- Platform governance: users, sessions, audit logs, security monitoring, alerts, maintenance, backup, storage, API monitoring, and emergency controls

The current UI covers the admin/system-level experience and includes pages for:

- System overview
- Global users and supervisors
- Projects overview
- Analytics and audit logs
- Security center, sessions, policies, and threat detection
- Alerts and notifications
- Broadcast messaging
- System settings and emergency controls
- Maintenance tools such as server health, database, backups, storage, rate limits, sync monitor, feature flags, sandbox, and API monitoring

## Current Scope

This repository is primarily a frontend/admin-dashboard implementation and product foundation.

Implemented in this codebase today:

- Multi-page admin dashboard built with the Next.js App Router
- Dashboard navigation and route structure
- System-level admin views and control panels
- Documentation describing platform architecture and module design

Planned or implied by documentation, but not fully implemented here as a complete production backend:

- Authentication services
- Persistent database integration
- Real-time production telemetry
- Background sync pipelines
- Full API and business logic layer
- Mobile field app workflows

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Radix UI primitives
- Recharts
- Lucide React icons
- React Hook Form and Zod-ready validation tooling

## Key Product Concepts

### Admin Control Plane

The Admin is not a project manager. The Admin operates at platform level and is responsible for:

- Monitoring users, sessions, alerts, and audit logs
- Reviewing security events and suspicious activity
- Controlling platform settings and policies
- Broadcasting system-wide announcements
- Managing maintenance and emergency controls

### Supervisor-Owned Operations

Supervisors own project execution. In the broader product architecture they are responsible for:

- Creating and managing projects
- Organizing teams and team leaders
- Defining zones and workflows
- Managing project forms and submissions

### Production-Oriented Maintenance

The dashboard includes operational sections that move the product beyond a simple demo UI:

- System health monitoring
- Error tracking
- Backup and restore
- Storage monitoring
- API monitoring
- Rate limiting controls
- Offline sync monitoring
- Feature flags
- Sandbox/testing views

## Major Routes

The main dashboard entry point is:

```txt
/dashboard
```

Key routes available in the current UI:

- `/dashboard`
- `/dashboard/users`
- `/dashboard/supervisors`
- `/dashboard/projects`
- `/dashboard/forms`
- `/dashboard/tracking`
- `/dashboard/analytics`
- `/dashboard/audit`
- `/dashboard/security`
- `/dashboard/security/threats`
- `/dashboard/security/sessions`
- `/dashboard/security/policies`
- `/dashboard/alerts`
- `/dashboard/broadcast`
- `/dashboard/settings`
- `/dashboard/emergency`
- `/dashboard/maintenance`
- `/dashboard/maintenance/server`
- `/dashboard/maintenance/database`
- `/dashboard/maintenance/backup`
- `/dashboard/maintenance/errors`
- `/dashboard/maintenance/rate-limits`
- `/dashboard/maintenance/sync`
- `/dashboard/maintenance/storage`
- `/dashboard/maintenance/api`
- `/dashboard/maintenance/features`
- `/dashboard/maintenance/sandbox`

## Project Structure

```txt
app/
  dashboard/
    analytics/
    alerts/
    audit/
    broadcast/
    emergency/
    forms/
    maintenance/
    projects/
    security/
    settings/
    supervisors/
    tracking/
    users/
components/
  dashboard/
  ui/
lib/
```

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- npm installed

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

Open `http://localhost:3000`, then go to:

```txt
http://localhost:3000/dashboard
```

### Production build

```bash
npm run build
npm run start
```

## Available Scripts

- `npm run dev` - start the development server
- `npm run build` - create a production build
- `npm run start` - start the production server
- `npm run lint` - run ESLint

## Documentation

This repository includes supporting product and architecture documents:

- [PROJECT DOCUMENTATION.md](./PROJECT%20DOCUMENTATION.md)
- [MODULE OUTLINE.md](./MODULE%20OUTLINE.md)
- [SYSTEM MAINTAINANCE FEATURES.md](./SYSTEM%20MAINTAINANCE%20FEATURES.md)
- [ADMIN DASHBOARD UPDATED.md](./ADMIN%20DASHBOARD%20UPDATED.md)
- [QUICK_START.md](./QUICK_START.md)

## Notes

- The dashboard is structured as a professional admin interface for a larger field operations system.
- Some pages represent product-ready control surfaces and documentation-driven architecture before full backend integration.
- The current repository is best understood as the admin web application and platform design foundation for FieldSync.

## License

This project currently has no license declared in the repository. Add a license if the project is intended for public distribution.
