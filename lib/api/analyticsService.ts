import { http } from './httpClient';

export type AdminAnalyticsRange = 'day' | 'week' | 'month' | 'year';

export interface AdminAnalytics {
  range: AdminAnalyticsRange;
  overview: {
    taskCompletionRate: number;
    completedTasks: number;
    totalTasks: number;
    activeUsers: number;
    coverageRate: number;
    avgResponseMinutes: number;
  };
  activitySeries: Array<{
    date: string;
    active: number;
    completed: number;
    pending: number;
  }>;
  projectPerformance: Array<{
    zone: string;
    completion: number;
    coverage: number;
  }>;
  taskDistribution: Array<{
    name: string;
    value: number;
  }>;
  teamPerformance: Array<{
    team: string;
    avg: number;
    active: number;
    members: number;
  }>;
}

interface AdminAnalyticsResponse {
  data: AdminAnalytics;
}

export const analyticsService = {
  async getAdminAnalytics(range: AdminAnalyticsRange): Promise<AdminAnalytics> {
    const response = await http.get<AdminAnalyticsResponse>(`/analytics/admin?range=${range}`);
    return response.data;
  },
};
