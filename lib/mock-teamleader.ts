import { ProjectStatus } from './mock-projects'

// Mock Team Members
export interface MockTeamMember {
  id: string
  name: string
  role: 'leader' | 'member'
  status: 'online' | 'offline' | 'idle' | 'active'
  currentActivity: string
  location: string
  lastSeen: string
  tasksCompleted: number
  formsSubmitted: number
  avatar: string
  sessionActive: boolean
  distanceFromLeader?: number
}

export const mockTeamMembers: MockTeamMember[] = [
  {
    id: 'tl-john-doe',
    name: 'John Doe (Leader)',
    role: 'leader',
    status: 'active',
    currentActivity: 'Monitoring team',
    location: 'Zone Alpha - Central',
    lastSeen: 'Now',
    tasksCompleted: 12,
    formsSubmitted: 45,
    avatar: '/placeholder-user.jpg',
    sessionActive: true,
  },
  {
    id: 'tm-jane-smith',
    name: 'Jane Smith',
    role: 'member',
    status: 'online',
    currentActivity: 'Filling form #23',
    location: 'Zone Alpha - North',
    lastSeen: '1m ago',
    tasksCompleted: 8,
    formsSubmitted: 32,
    avatar: '/placeholder-user.jpg',
    sessionActive: true,
    distanceFromLeader: 0.8,
  },
  {
    id: 'tm-mike-johnson',
    name: 'Mike Johnson',
    role: 'member',
    status: 'idle',
    currentActivity: 'Idle in zone',
    location: 'Zone Alpha - South',
    lastSeen: '5m ago',
    tasksCompleted: 5,
    formsSubmitted: 18,
    avatar: '/placeholder-user.jpg',
    sessionActive: true,
    distanceFromLeader: 1.2,
  },
  {
    id: 'tm-sarah-lee',
    name: 'Sarah Lee',
    role: 'member',
    status: 'offline',
    currentActivity: 'Offline',
    location: 'Outside zone',
    lastSeen: '12m ago',
    tasksCompleted: 10,
    formsSubmitted: 28,
    avatar: '/placeholder-user.jpg',
    sessionActive: false,
    distanceFromLeader: 2.5,
  },
  // Add more to reach 20+
]

// Mock Tasks
export interface MockTask {
  id: string
  title: string
  description: string
  assignedTo: string[]
  status: 'pending' | 'in-progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  dueDate: string
  progress: number
}

export const mockTasks: MockTask[] = [
  {
    id: 'task-1',
    title: 'Complete Zone Alpha North survey',
    description: 'Survey all households in north section.',
    assignedTo: ['tm-jane-smith'],
    status: 'in-progress',
    priority: 'high',
    dueDate: 'Today 6PM',
    progress: 65,
  },
  {
    id: 'task-2',
    title: 'Review form submissions',
    description: 'Check and approve 15 pending forms.',
    assignedTo: ['tl-john-doe'],
    status: 'pending',
    priority: 'medium',
    dueDate: 'Tomorrow',
    progress: 0,
  },
  // Add 10+ more
]

// Mock Forms/Notifications/Activity similar pattern...
export const mockForms = [] // Placeholder
export const mockNotifications = [] // Placeholder  
export const mockActivityLogs = [] // Placeholder

export function getTeamMemberById(id: string) {
  return mockTeamMembers.find(m => m.id === id)
}

