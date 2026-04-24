import Dexie, { type Table } from 'dexie';

export interface SyncItem {
  id?: string;
  type: 'form_submission' | 'task_update' | 'location_update';
  label: string;
  data: any;
  status: 'pending' | 'synced' | 'failed';
  timestamp: string;
  retries: number;
  error?: string;
  size: string;
}

export interface CachedTask {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  deadline: string;
  project_id: string;
  zone_id: string;
  assigned_to: string;
}

export interface CachedForm {
  id: string;
  title: string;
  description: string;
  form_schema: any;
  project_id: string;
}

export class FieldSyncDB extends Dexie {
  syncQueue!: Table<SyncItem>;
  tasks!: Table<CachedTask>;
  forms!: Table<CachedForm>;

  constructor() {
    super('FieldSyncDB');
    this.version(1).stores({
      syncQueue: '++id, type, status, timestamp',
      tasks: 'id, project_id, assigned_to',
      forms: 'id, project_id'
    });
  }
}

export const db = new FieldSyncDB();
