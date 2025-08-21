declare namespace API {
  // 作业定义表结构
  interface JobDef {
    jobId: number;
    jobCode: string;
    jobName: string;
    jobGroup?: string;
    jobOrder: number;
    groupOrder: number;
    procName?: string;
    jobParams?: string;
    jobType?: string;
    scheduleTime?: string;
    status: string;
    timeoutSec: number;
    retryCount: number;
    notifyEmail?: string;
    isDepend: boolean;
    isActive: boolean;
    lastRunTime?: string;
    nextRunTime?: string;
    createTime: string;
    updateTime: string;
  }

  // 任务列表查询参数
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

  // 任务列表响应
  interface JobList {
    list: JobDef[];
    total: number;
    current: number;
    pageSize: number;
    pages: number;
    success?: boolean;
  }

  // 执行器分组
  interface ExecutorGroup {
    id: number;
    appName: string;
    title: string;
    addressType: number;
    addressList: string;
    updateTime: string;
  }

  // 作业操作参数
  interface JobOperationParams {
    jobId: number;
    operation: 'start' | 'stop' | 'delete';
  }

  // 执行日志表结构
  interface JobExecutionLog {
    logId: number;
    jobCode: string;
    batchNo?: string;
    executorProc?: string;
    executorAddress?: string;
    startTime: string;
    endTime?: string;
    status: string;
    errorMessage?: string;
    duration?: number;
    notifyStatus: string;
    retryCount: number;
  }

  // 执行日志查询参数
  interface JobLogParams {
    current?: number;
    pageSize?: number;
    jobCode?: string;
    batchNo?: string;
    status?: string;
    startTime?: string;
    endTime?: string;
    orderBy?: string;
    orderDirection?: 'asc' | 'desc';
  }

  // 执行日志列表响应
  interface JobLogList {
    list: JobExecutionLog[];
    total: number;
    current: number;
    pageSize: number;
    pages: number;
    success?: boolean;
  }

  // 通用响应类型
  interface Response {
    code: number;
    msg: string;
    data?: any;
    timestamp?: number;
    success?: boolean;
  }
} 