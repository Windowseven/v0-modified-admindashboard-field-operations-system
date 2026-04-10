export type ProjectStatus = 'active' | 'paused' | 'draft' | 'archived'

export interface MockProject {
  id: string
  name: string
  description: string
  status: ProjectStatus
  progress: number
  teamCount: number
  memberCount: number
  zoneCount: number
  formCount: number
  startDate: string
  deadline: string
  lastOpened: string
  lastActivity: string
  createdAt: string
  location: string
  totalSubmissions: number
  targetSubmissions: number
}

export const mockProjects: MockProject[] = [
  {
    id: 'proj-nairobi-2026',
    name: 'Urban Survey — Nairobi',
    description: 'Comprehensive household and infrastructure survey across 12 zones in Nairobi County.',
    status: 'active',
    progress: 67,
    teamCount: 5,
    memberCount: 42,
    zoneCount: 12,
    formCount: 5,
    startDate: 'Mar 1, 2026',
    deadline: 'Jun 30, 2026',
    lastOpened: '2m ago',
    lastActivity: 'Team Alpha submitted 22 forms · 9m ago',
    createdAt: 'Feb 20, 2026',
    location: 'Nairobi, Kenya',
    totalSubmissions: 292,
    targetSubmissions: 436,
  },
  {
    id: 'proj-mombasa-2026',
    name: 'Coastal Infrastructure Audit',
    description: 'Mapping and audit of coastal infrastructure assets across Mombasa County.',
    status: 'paused',
    progress: 34,
    teamCount: 3,
    memberCount: 18,
    zoneCount: 7,
    formCount: 3,
    startDate: 'Jan 15, 2026',
    deadline: 'May 15, 2026',
    lastOpened: '3d ago',
    lastActivity: 'Project paused by supervisor · 3d ago',
    createdAt: 'Jan 5, 2026',
    location: 'Mombasa, Kenya',
    totalSubmissions: 89,
    targetSubmissions: 260,
  },
  {
    id: 'proj-kampala-draft',
    name: 'Kampala Market Census',
    description: 'Draft — Market vendor census across 5 key markets in Kampala.',
    status: 'draft',
    progress: 0,
    teamCount: 0,
    memberCount: 0,
    zoneCount: 5,
    formCount: 2,
    startDate: '—',
    deadline: 'Aug 1, 2026',
    lastOpened: '1w ago',
    lastActivity: 'Draft created · 1w ago',
    createdAt: 'Apr 2, 2026',
    location: 'Kampala, Uganda',
    totalSubmissions: 0,
    targetSubmissions: 150,
  },
]

export function getProjectById(id: string): MockProject | undefined {
  return mockProjects.find((p) => p.id === id)
}

export const statusConfig: Record<ProjectStatus, { label: string; className: string; dot: string }> = {
  active: {
    label: 'Active',
    className: 'bg-emerald-500/10 text-emerald-500',
    dot: 'bg-emerald-500 animate-pulse',
  },
  paused: {
    label: 'Paused',
    className: 'bg-amber-500/10 text-amber-500',
    dot: 'bg-amber-500',
  },
  draft: {
    label: 'Draft',
    className: 'bg-muted text-muted-foreground',
    dot: 'bg-muted-foreground',
  },
  archived: {
    label: 'Archived',
    className: 'bg-secondary text-secondary-foreground',
    dot: 'bg-secondary-foreground',
  },
}
