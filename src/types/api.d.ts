declare namespace API {
  // 基础响应类型
  interface Response {
    code: number;
    message: string;
    data?: any;
  }

  // 用户相关类型
  interface CurrentUser {
    userId: number;
    username: string;
    realName: string;
    email: string;
    phone?: string;
    avatar?: string;
    role: string;
    permissions: string;
    lastLoginTime: string;
    createTime: string;
    updateTime: string;
    isActive: boolean;
    permissionList?: string[];
  }

  interface LoginParams {
    username: string;
    password: string;
  }

  interface LoginResult {
    code: number;
    message: string;
    data: {
      token: string;
      refreshToken: string;
      user: CurrentUser;
    };
  }

  interface RefreshTokenParams {
    refreshToken: string;
  }

  interface RefreshTokenResult {
    code: number;
    message: string;
    data: {
      token: string;
      refreshToken: string;
    };
  }

  // 任务相关类型
  interface JobDef {
    jobId: number;
    jobCode: string;
    jobName: string;
    jobGroup?: string;
    jobType: string;
    executorProc: string;
    executorAddress: string;
    jobParams?: string;
    cronExpression?: string;
    isActive: boolean;
    isDepend: boolean;
    dependJobIds?: string;
    retryCount: number;
    timeout: number;
    notifyEmail?: string;
    description?: string;
    createTime: string;
    updateTime: string;
    status: string;
  }

  interface JobListParams {
    current?: number;
    pageSize?: number;
    jobCode?: string;
    jobName?: string;
    jobGroup?: string;
    status?: string;
    jobType?: string;
    isActive?: boolean;
  }

  interface JobList {
    code: number;
    message: string;
    data: {
      list: JobDef[];
      total: number;
      current: number;
      pageSize: number;
      pages: number;
    };
  }

  // 执行器相关类型
  interface ExecutorGroup {
    executorId: number;
    executorName: string;
    executorAddress: string;
    executorType: string;
    isActive: boolean;
    createTime: string;
    updateTime: string;
  }

  // 执行日志相关类型
  interface JobExecutionLog {
    logId: number;
    jobCode: string;
    batchNo: string;
    executorProc: string;
    executorAddress: string;
    startTime: string;
    endTime?: string;
    status: string;
    errorMessage?: string;
    duration: number;
    jobParams?: string;
    resultData?: string;
    notifyStatus: string;
    notifyEmail?: string;
    notifyTime?: string;
    retryCount: number;
  }

  interface JobLogParams {
    current?: number;
    pageSize?: number;
    jobCode?: string;
    batchNo?: string;
    status?: string;
    startTime?: string;
    endTime?: string;
    executorAddress?: string;
  }

  interface JobLogList {
    code: number;
    message: string;
    data: {
      list: JobExecutionLog[];
      total: number;
      current: number;
      pageSize: number;
      pages: number;
    };
  }

  // 仪表板相关类型
  interface DashboardResponse {
    code: number;
    message: string;
    data: {
      totalJobs: number;
      activeJobs: number;
      runningJobs: number;
      failedJobs: number;
      totalExecutions: number;
      successExecutions: number;
      failedExecutions: number;
      todayExecutions: number;
      systemStatus: string;
      lastUpdateTime: string;
      systemUptime: string;
      cpuUsage: number;
      memoryUsage: number;
      diskUsage: number;
    };
  }

  interface SystemStatusResponse {
    code: number;
    message: string;
    data: {
      systemInfo: {
        systemName: string;
        version: string;
        startTime: string;
        uptime: string;
        lastHealthCheck: string;
      };
      resourceUsage: {
        cpuUsage: number;
        memoryUsage: number;
        diskUsage: number;
        networkIn: string;
        networkOut: string;
      };
      executorStatus: Array<{
        executorAddress: string;
        status: string;
        lastHeartbeat: string;
        runningJobs: number;
        cpuUsage: number;
        memoryUsage: number;
      }>;
      databaseStatus: {
        status: string;
        connectionCount: number;
        slowQueries: number;
        lastBackup: string;
      };
    };
  }

  interface ChartParams {
    startDate?: string;
    endDate?: string;
    groupBy?: string;
    jobCode?: string;
  }

  interface ChartResponse {
    code: number;
    message: string;
    data: {
      dates: string[];
      successCounts: number[];
      failedCounts: number[];
      totalCounts: number[];
      avgDurations: number[];
      timeoutCounts: number[];
    };
  }

  interface JobGroupStatsResponse {
    code: number;
    message: string;
    data: {
      groups: Array<{
        groupName: string;
        totalJobs: number;
        activeJobs: number;
        runningJobs: number;
        successRate: number;
        avgDuration: number;
      }>;
      totalStats: {
        totalJobs: number;
        activeJobs: number;
        runningJobs: number;
        avgSuccessRate: number;
        avgDuration: number;
      };
    };
  }

  interface JobTypeDistributionResponse {
    code: number;
    message: string;
    data: {
      types: Array<{
        jobType: string;
        count: number;
        percentage: number;
        successRate: number;
      }>;
    };
  }

  interface ExecutorPerformanceResponse {
    code: number;
    message: string;
    data: {
      executors: Array<{
        executorAddress: string;
        executionCount: number;
        successCount: number;
        failedCount: number;
        avgDuration: number;
        successRate: number;
        cpuUsage: number;
        memoryUsage: number;
        runningJobs: number;
      }>;
    };
  }

  interface RecentExecutionsResponse {
    code: number;
    message: string;
    data: {
      recentExecutions: Array<{
        logId: number;
        jobCode: string;
        jobName: string;
        batchNo: string;
        startTime: string;
        endTime: string;
        status: string;
        duration: number;
        executorAddress: string;
      }>;
    };
  }

  interface RunningJobsResponse {
    code: number;
    message: string;
    data: {
      runningJobs: Array<{
        logId: number;
        jobCode: string;
        jobName: string;
        batchNo: string;
        startTime: string;
        duration: number;
        progress: number;
        currentStep: string;
        executorAddress: string;
        estimatedEndTime: string;
      }>;
    };
  }

  interface AlertsResponse {
    code: number;
    message: string;
    data: {
      alerts: Array<{
        alertId: number;
        level: string;
        title: string;
        message: string;
        jobCode?: string;
        batchNo?: string;
        createTime: string;
        isRead: boolean;
      }>;
    };
  }

  interface DailyReportResponse {
    code: number;
    message: string;
    data: {
      date: string;
      summary: {
        totalExecutions: number;
        successExecutions: number;
        failedExecutions: number;
        successRate: number;
        avgDuration: number;
        totalDuration: string;
      };
      topJobs: Array<{
        jobCode: string;
        jobName: string;
        executionCount: number;
        successCount: number;
        avgDuration: number;
      }>;
    };
  }

  interface MonthlyReportResponse {
    code: number;
    message: string;
    data: {
      year: number;
      month: number;
      summary: {
        totalExecutions: number;
        successExecutions: number;
        failedExecutions: number;
        successRate: number;
        avgDuration: number;
        totalDuration: string;
      };
      dailyStats?: Array<{
        date: string;
        executions: number;
        successRate: number;
      }>;
      topJobs?: Array<{
        jobCode: string;
        jobName: string;
        executionCount: number;
        successCount: number;
        avgDuration: number;
      }>;
    };
  }
} 