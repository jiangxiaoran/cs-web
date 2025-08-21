import request from '@/utils/request';

/** 获取仪表板信息 */
export async function getDashboardInfo(params?: {
  startDate?: string;
  endDate?: string;
  jobCode?: string;
}) {
  return request<API.DashboardResponse>('/v1/dashboard/overview', {
    method: 'GET',
    params,
  });
}

/** 获取系统状态详情 */
export async function getSystemStatus() {
  return request<API.SystemStatusResponse>('/v1/dashboard/system-status', {
    method: 'GET',
  });
}

/** 获取执行趋势图表数据 */
export async function getExecutionTrend(params: API.ChartParams) {
  return request<API.ChartResponse>('/v1/dashboard/chart/execution-trend', {
    method: 'GET',
    params,
  });
}

/** 获取任务分组统计 */
export async function getJobGroupStats() {
  return request<API.JobGroupStatsResponse>('/v1/dashboard/chart/job-group-stats', {
    method: 'GET',
  });
}

/** 获取任务类型分布 */
export async function getJobTypeDistribution() {
  return request<API.JobTypeDistributionResponse>('/v1/dashboard/chart/job-type-distribution', {
    method: 'GET',
  });
}

/** 获取执行器性能统计 */
export async function getExecutorPerformance(params?: {
  startDate?: string;
  endDate?: string;
}) {
  return request<API.ExecutorPerformanceResponse>('/v1/dashboard/chart/executor-performance', {
    method: 'GET',
    params,
  });
}

/** 获取最近执行记录 */
export async function getRecentExecutions(limit: number = 10) {
  return request<API.RecentExecutionsResponse>('/v1/dashboard/recent-executions', {
    method: 'GET',
    params: { limit },
  });
}

/** 获取当前运行任务 */
export async function getRunningJobs() {
  return request<API.RunningJobsResponse>('/v1/dashboard/running-jobs', {
    method: 'GET',
  });
}

/** 获取系统告警信息 */
export async function getAlerts(params?: {
  level?: string;
  limit?: number;
}) {
  return request<API.AlertsResponse>('/v1/dashboard/alerts', {
    method: 'GET',
    params,
  });
}

/** 获取日报表 */
export async function getDailyReport(date?: string) {
  return request<API.DailyReportResponse>('/v1/dashboard/report/daily', {
    method: 'GET',
    params: { date },
  });
}

/** 获取月报表 */
export async function getMonthlyReport(params?: {
  year?: number;
  month?: number;
}) {
  return request<API.MonthlyReportResponse>('/v1/dashboard/report/monthly', {
    method: 'GET',
    params,
  });
} 