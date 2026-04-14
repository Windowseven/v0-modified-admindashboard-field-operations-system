// ─────────────────────────────────────────────────────────────────────────────
// FieldSync – Mock data for Field Agent (User) Dashboard
// ─────────────────────────────────────────────────────────────────────────────

// ── Profile ──────────────────────────────────────────────────────────────────
export interface UserProfile {
  id: string
  name: string
  firstName: string
  email: string
  phone: string
  assignedZone: string
  assignedProject: string
  teamName: string
  teamLeader: string
  role: 'field_agent'
  avatar: string
  joinedAt: string
  deviceId: string
  locationSharingEnabled: boolean
  notificationsEnabled: boolean
}

export const mockUserProfile: UserProfile = {
  id: 'fa-001',
  name: 'John Mwangi',
  firstName: 'John',
  email: 'john.mwangi@fieldsync.io',
  phone: '+255 712 345 678',
  assignedZone: 'Zone Alpha – North',
  assignedProject: 'Dar es Salaam Urban Survey 2024',
  teamName: 'Team Alpha',
  teamLeader: 'Grace Kimani',
  role: 'field_agent',
  avatar: '/placeholder-user.jpg',
  joinedAt: '2024-01-15',
  deviceId: 'DEV-FA-001',
  locationSharingEnabled: true,
  notificationsEnabled: true,
}

// ── Session ───────────────────────────────────────────────────────────────────
export type SessionStatus = 'active' | 'not_started' | 'ended'

export interface UserSession {
  status: SessionStatus
  startedAt: string | null
  duration: string
  tasksCompleted: number
  formsSubmitted: number
}

export const mockUserSession: UserSession = {
  status: 'active',
  startedAt: '08:15 AM',
  duration: '02:34:12',
  tasksCompleted: 3,
  formsSubmitted: 7,
}

// ── Tasks ─────────────────────────────────────────────────────────────────────
export type TaskStatus = 'pending' | 'in-progress' | 'completed'
export type TaskMode = 'individual' | 'group'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface UserTask {
  id: string
  title: string
  description: string
  location: string
  zone: string
  deadline: string
  mode: TaskMode
  status: TaskStatus
  priority: TaskPriority
  linkedForm: string | null
  assignedBy: string
  completedAt: string | null
}

export const mockUserTasks: UserTask[] = [
  {
    id: 'task-u-1',
    title: 'Household Survey – Block A1',
    description: 'Complete surveys for all 12 households in Block A1 using the Standard HH Form.',
    location: 'Block A1, Zone Alpha North',
    zone: 'Zone Alpha – North',
    deadline: 'Today, 5:00 PM',
    mode: 'individual',
    status: 'in-progress',
    priority: 'high',
    linkedForm: 'form-hh-standard',
    assignedBy: 'Grace Kimani',
    completedAt: null,
  },
  {
    id: 'task-u-2',
    title: 'Infrastructure Mapping – Road 4',
    description: 'Document road conditions and photograph key infrastructure points along Road 4.',
    location: 'Road 4, Zone Alpha North',
    zone: 'Zone Alpha – North',
    deadline: 'Today, 6:00 PM',
    mode: 'individual',
    status: 'pending',
    priority: 'medium',
    linkedForm: 'form-infra-map',
    assignedBy: 'Grace Kimani',
    completedAt: null,
  },
  {
    id: 'task-u-3',
    title: 'Community Meeting – Checkpoint 3',
    description: 'Attend and log community meeting at Checkpoint 3. Record attendance and key discussion points.',
    location: 'Checkpoint 3, Zone Alpha',
    zone: 'Zone Alpha',
    deadline: 'Today, 3:00 PM',
    mode: 'group',
    status: 'completed',
    priority: 'high',
    linkedForm: 'form-meeting-log',
    assignedBy: 'Grace Kimani',
    completedAt: '02:47 PM',
  },
  {
    id: 'task-u-4',
    title: 'Water Point Inspection',
    description: 'Inspect and record conditions of water points 7, 8, and 9 in the northern sector.',
    location: 'Sector North – Water Points 7-9',
    zone: 'Zone Alpha – North',
    deadline: 'Tomorrow, 12:00 PM',
    mode: 'individual',
    status: 'pending',
    priority: 'low',
    linkedForm: 'form-water-inspect',
    assignedBy: 'Grace Kimani',
    completedAt: null,
  },
  {
    id: 'task-u-5',
    title: 'Boundary Verification – East Edge',
    description: 'Verify and confirm the eastern boundary of Zone Alpha North using GPS coordinates.',
    location: 'East Edge, Zone Alpha North',
    zone: 'Zone Alpha – North',
    deadline: 'Tomorrow, 4:00 PM',
    mode: 'individual',
    status: 'pending',
    priority: 'medium',
    linkedForm: null,
    assignedBy: 'Grace Kimani',
    completedAt: null,
  },
]

// ── Forms ─────────────────────────────────────────────────────────────────────
export type FormStatus = 'not-started' | 'draft' | 'submitted'

export interface FormField {
  id: string
  label: string
  type: 'text' | 'number' | 'dropdown' | 'textarea' | 'radio' | 'checkbox'
  required: boolean
  options?: string[]
  placeholder?: string
  value?: string | number | boolean
}

export interface FormStep {
  id: string
  title: string
  description: string
  fields: FormField[]
}

export interface UserForm {
  id: string
  title: string
  description: string
  linkedTask: string | null
  zone: string
  steps: FormStep[]
  status: FormStatus
  draftStep: number
  submittedAt: string | null
  assignedBy: string
  deadline: string
}

export const mockUserForms: UserForm[] = [
  {
    id: 'form-hh-standard',
    title: 'Standard Household Survey',
    description: 'Collect demographic and socioeconomic data for each household in your zone.',
    linkedTask: 'task-u-1',
    zone: 'Zone Alpha – North',
    status: 'draft',
    draftStep: 1,
    submittedAt: null,
    assignedBy: 'Grace Kimani',
    deadline: 'Today, 5:00 PM',
    steps: [
      {
        id: 'step-1',
        title: 'Household Identification',
        description: 'Basic info about the household and its location.',
        fields: [
          { id: 'hh-id', label: 'Household ID', type: 'text', required: true, placeholder: 'e.g. HH-2024-0042' },
          { id: 'gps-lat', label: 'GPS Latitude', type: 'number', required: true, placeholder: '-6.7924' },
          { id: 'gps-lng', label: 'GPS Longitude', type: 'number', required: true, placeholder: '39.2083' },
          { id: 'address', label: 'Address / Description', type: 'textarea', required: false, placeholder: 'Describe the location...' },
        ],
      },
      {
        id: 'step-2',
        title: 'Household Composition',
        description: 'Information about the people living in this household.',
        fields: [
          { id: 'total-members', label: 'Total Members', type: 'number', required: true, placeholder: '0' },
          { id: 'adults', label: 'Adults (18+)', type: 'number', required: true, placeholder: '0' },
          { id: 'children', label: 'Children (<18)', type: 'number', required: true, placeholder: '0' },
          { id: 'head-gender', label: 'Head of Household Gender', type: 'dropdown', required: true, options: ['Male', 'Female', 'Other', 'Prefer not to say'] },
        ],
      },
      {
        id: 'step-3',
        title: 'Socioeconomic Status',
        description: 'Basic economic information about the household.',
        fields: [
          { id: 'income-level', label: 'Income Level', type: 'radio', required: true, options: ['Low (<100k TZS/mo)', 'Medium (100k–500k TZS/mo)', 'High (>500k TZS/mo)', 'Unknown'] },
          { id: 'primary-livelihood', label: 'Primary Livelihood', type: 'dropdown', required: true, options: ['Agriculture', 'Fishing', 'Trade/Commerce', 'Employment', 'Other'] },
          { id: 'has-electricity', label: 'Has Access to Electricity', type: 'radio', required: true, options: ['Yes', 'No', 'Sometimes'] },
          { id: 'water-source', label: 'Water Source', type: 'dropdown', required: true, options: ['Piped', 'Well', 'River/Stream', 'Borehole', 'Other'] },
        ],
      },
      {
        id: 'step-4',
        title: 'Confirmation & Notes',
        description: 'Final review and any additional field notes.',
        fields: [
          { id: 'respondent-name', label: 'Respondent Name', type: 'text', required: true, placeholder: 'Full name' },
          { id: 'respondent-consented', label: 'Respondent gave informed consent', type: 'radio', required: true, options: ['Yes', 'No'] },
          { id: 'field-notes', label: 'Field Notes', type: 'textarea', required: false, placeholder: 'Any additional observations...' },
        ],
      },
    ],
  },
  {
    id: 'form-infra-map',
    title: 'Infrastructure Mapping Form',
    description: 'Document road conditions and infrastructure in your area.',
    linkedTask: 'task-u-2',
    zone: 'Zone Alpha – North',
    status: 'not-started',
    draftStep: 0,
    submittedAt: null,
    assignedBy: 'Grace Kimani',
    deadline: 'Today, 6:00 PM',
    steps: [
      {
        id: 'step-1',
        title: 'Location Details',
        description: 'Identify the infrastructure location.',
        fields: [
          { id: 'road-name', label: 'Road Name / ID', type: 'text', required: true, placeholder: 'e.g. Road 4' },
          { id: 'segment-start', label: 'Segment Start (GPS)', type: 'text', required: true, placeholder: '-6.xxx, 39.xxx' },
          { id: 'segment-end', label: 'Segment End (GPS)', type: 'text', required: true, placeholder: '-6.xxx, 39.xxx' },
        ],
      },
      {
        id: 'step-2',
        title: 'Condition Assessment',
        description: 'Rate the condition of this infrastructure.',
        fields: [
          { id: 'road-condition', label: 'Road Condition', type: 'radio', required: true, options: ['Good', 'Fair', 'Poor', 'Very Poor'] },
          { id: 'surface-type', label: 'Surface Type', type: 'dropdown', required: true, options: ['Tarmac', 'Gravel', 'Dirt', 'Mixed'] },
          { id: 'notes', label: 'Condition Notes', type: 'textarea', required: false, placeholder: 'Describe issues...' },
        ],
      },
    ],
  },
  {
    id: 'form-meeting-log',
    title: 'Community Meeting Log',
    description: 'Record community meeting attendance and key discussion points.',
    linkedTask: 'task-u-3',
    zone: 'Zone Alpha',
    status: 'submitted',
    draftStep: 0,
    submittedAt: '02:51 PM',
    assignedBy: 'Grace Kimani',
    deadline: 'Today, 3:00 PM',
    steps: [],
  },
  {
    id: 'form-water-inspect',
    title: 'Water Point Inspection',
    description: 'Document condition and functionality of water points.',
    linkedTask: 'task-u-4',
    zone: 'Zone Alpha – North',
    status: 'not-started',
    draftStep: 0,
    submittedAt: null,
    assignedBy: 'Grace Kimani',
    deadline: 'Tomorrow, 12:00 PM',
    steps: [
      {
        id: 'step-1',
        title: 'Water Point Identification',
        description: 'Identify the water point being inspected.',
        fields: [
          { id: 'wp-id', label: 'Water Point ID', type: 'text', required: true, placeholder: 'e.g. WP-007' },
          { id: 'wp-type', label: 'Water Point Type', type: 'dropdown', required: true, options: ['Borehole', 'Standpipe', 'Kiosk', 'Well'] },
          { id: 'gps', label: 'GPS Coordinates', type: 'text', required: true, placeholder: '-6.xxx, 39.xxx' },
        ],
      },
      {
        id: 'step-2',
        title: 'Functionality Check',
        description: 'Check if the water point is working.',
        fields: [
          { id: 'is-functional', label: 'Is Functional?', type: 'radio', required: true, options: ['Yes', 'No', 'Partially'] },
          { id: 'water-quality', label: 'Visible Water Quality', type: 'radio', required: true, options: ['Clear', 'Turbid', 'Contaminated'] },
          { id: 'notes', label: 'Notes', type: 'textarea', required: false, placeholder: 'Describe issues...' },
        ],
      },
    ],
  },
]

// ── Teammates (Nearby) ────────────────────────────────────────────────────────
export type MemberStatus = 'online' | 'offline' | 'idle'

export interface NearbyTeammate {
  id: string
  name: string
  status: MemberStatus
  distance: string
  location: string
  currentActivity: string
  lastSeen: string
  isTeamLeader: boolean
}

export const mockNearbyTeam: NearbyTeammate[] = [
  {
    id: 'tm-grace',
    name: 'Grace Kimani',
    status: 'online',
    distance: '0.3 km',
    location: 'Zone Alpha – Central',
    currentActivity: 'Monitoring team',
    lastSeen: 'Now',
    isTeamLeader: true,
  },
  {
    id: 'tm-amina',
    name: 'Amina Hassan',
    status: 'online',
    distance: '0.6 km',
    location: 'Zone Alpha – North',
    currentActivity: 'Filling form #23',
    lastSeen: '1m ago',
    isTeamLeader: false,
  },
  {
    id: 'tm-peter',
    name: 'Peter Makore',
    status: 'idle',
    distance: '1.1 km',
    location: 'Zone Alpha – East',
    currentActivity: 'Idle',
    lastSeen: '6m ago',
    isTeamLeader: false,
  },
  {
    id: 'tm-fatuma',
    name: 'Fatuma Said',
    status: 'offline',
    distance: '2.4 km',
    location: 'Unknown',
    currentActivity: 'Offline',
    lastSeen: '14m ago',
    isTeamLeader: false,
  },
  {
    id: 'tm-david',
    name: 'David Odhiambo',
    status: 'online',
    distance: '0.9 km',
    location: 'Zone Alpha – North',
    currentActivity: 'Traveling to point',
    lastSeen: '2m ago',
    isTeamLeader: false,
  },
]

// ── Notifications ─────────────────────────────────────────────────────────────
export type NotificationType = 'task' | 'form' | 'message' | 'alert' | 'system'

export interface UserNotification {
  id: string
  type: NotificationType
  title: string
  body: string
  time: string
  isRead: boolean
  actionUrl?: string
}

export const mockUserNotifications: UserNotification[] = [
  {
    id: 'notif-1',
    type: 'alert',
    title: 'Zone boundary warning',
    body: 'You are approaching the edge of Zone Alpha – North. Stay within boundaries.',
    time: '5 min ago',
    isRead: false,
    actionUrl: '/user/map',
  },
  {
    id: 'notif-2',
    type: 'task',
    title: 'New task assigned',
    body: 'Water Point Inspection has been assigned to you. Deadline: Tomorrow, 12:00 PM.',
    time: '32 min ago',
    isRead: false,
    actionUrl: '/user/tasks',
  },
  {
    id: 'notif-3',
    type: 'message',
    title: 'Message from Grace Kimani',
    body: 'Great work on Block A1! Please prioritize Road 4 next.',
    time: '1 hr ago',
    isRead: false,
    actionUrl: '/user/help',
  },
  {
    id: 'notif-4',
    type: 'form',
    title: 'Form draft reminder',
    body: 'Your Standard Household Survey draft is unsaved. Resume anytime.',
    time: '2 hr ago',
    isRead: true,
    actionUrl: '/user/forms/form-hh-standard',
  },
  {
    id: 'notif-5',
    type: 'system',
    title: 'Offline sync completed',
    body: '3 form submissions have been synced successfully.',
    time: '3 hr ago',
    isRead: true,
  },
  {
    id: 'notif-6',
    type: 'task',
    title: 'Task completed acknowledged',
    body: 'Community Meeting – Checkpoint 3 has been acknowledged by your team leader.',
    time: '4 hr ago',
    isRead: true,
  },
]

// ── Help Requests ─────────────────────────────────────────────────────────────
export type HelpRequestStatus = 'pending' | 'accepted' | 'rejected'
export type HelpRequestType = 'help' | 'meeting' | 'assistance'

export interface HelpRequest {
  id: string
  type: HelpRequestType
  message: string
  sentAt: string
  status: HelpRequestStatus
  responseFrom: string | null
  responseAt: string | null
  responseNote: string | null
}

export const mockHelpRequests: HelpRequest[] = [
  {
    id: 'help-1',
    type: 'meeting',
    message: 'Need to discuss Block A1 boundaries with team leader.',
    sentAt: '01:30 PM',
    status: 'accepted',
    responseFrom: 'Grace Kimani',
    responseAt: '01:35 PM',
    responseNote: 'Meet me at Checkpoint 3 at 3 PM.',
  },
  {
    id: 'help-2',
    type: 'help',
    message: 'Having trouble identifying household IDs in Block A1. Need guidance.',
    sentAt: '10:15 AM',
    status: 'rejected',
    responseFrom: 'Grace Kimani',
    responseAt: '10:20 AM',
    responseNote: 'Check the zone briefing document or ask Peter nearby.',
  },
  {
    id: 'help-3',
    type: 'assistance',
    message: 'Battery running low. May go offline soon.',
    sentAt: '08:45 AM',
    status: 'accepted',
    responseFrom: 'Grace Kimani',
    responseAt: '08:50 AM',
    responseNote: 'Charging station available at Checkpoint 2.',
  },
]

// ── Offline Sync ──────────────────────────────────────────────────────────────
export type SyncStatus = 'synced' | 'pending' | 'failed'

export interface SyncItem {
  id: string
  type: 'form_submission' | 'location_update' | 'task_update'
  label: string
  status: SyncStatus
  size: string
  timestamp: string
  retries: number
}

export const mockSyncItems: SyncItem[] = [
  {
    id: 'sync-1',
    type: 'form_submission',
    label: 'Community Meeting Log – Checkpoint 3',
    status: 'synced',
    size: '4.2 KB',
    timestamp: '02:51 PM',
    retries: 0,
  },
  {
    id: 'sync-2',
    type: 'form_submission',
    label: 'Household Survey – HH-0041',
    status: 'synced',
    size: '3.8 KB',
    timestamp: '11:22 AM',
    retries: 0,
  },
  {
    id: 'sync-3',
    type: 'form_submission',
    label: 'Standard HH Survey – Draft (HH-0042)',
    status: 'pending',
    size: '2.1 KB',
    timestamp: '10:45 AM',
    retries: 0,
  },
  {
    id: 'sync-4',
    type: 'location_update',
    label: 'Location batch – 08:00–09:00',
    status: 'synced',
    size: '1.2 KB',
    timestamp: '09:05 AM',
    retries: 0,
  },
  {
    id: 'sync-5',
    type: 'form_submission',
    label: 'Water Point Inspection – WP-005',
    status: 'failed',
    size: '3.1 KB',
    timestamp: 'Yesterday 4:12 PM',
    retries: 3,
  },
  {
    id: 'sync-6',
    type: 'task_update',
    label: 'Task status update – task-u-3',
    status: 'synced',
    size: '0.4 KB',
    timestamp: '02:47 PM',
    retries: 0,
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
export function getFormById(id: string) {
  return mockUserForms.find((f) => f.id === id)
}

export function getTaskById(id: string) {
  return mockUserTasks.find((t) => t.id === id)
}

export const syncSummary = {
  total: mockSyncItems.length,
  synced: mockSyncItems.filter((s) => s.status === 'synced').length,
  pending: mockSyncItems.filter((s) => s.status === 'pending').length,
  failed: mockSyncItems.filter((s) => s.status === 'failed').length,
}

export const taskSummary = {
  total: mockUserTasks.length,
  completed: mockUserTasks.filter((t) => t.status === 'completed').length,
  inProgress: mockUserTasks.filter((t) => t.status === 'in-progress').length,
  pending: mockUserTasks.filter((t) => t.status === 'pending').length,
}

