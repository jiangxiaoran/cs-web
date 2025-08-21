/**
 * 执行状态常量定义
 * 与后端 JobControlService.ExecutionStatus 保持一致
 */

export const EXECUTION_STATUS = {
  PENDING: 'PENDING',      // 等待执行
  RUNNING: 'RUNNING',      // 运行中
  PAUSED: 'PAUSED',        // 已暂停
  STOPPED: 'STOPPED',      // 已停止
  COMPLETED: 'COMPLETED',  // 已完成
  SUCCESS: 'SUCCESS',      // 执行成功（兼容性）
  FAILED: 'FAILED',        // 执行失败
  CANCELLED: 'CANCELLED'   // 已取消
} as const;

export type ExecutionStatusType = typeof EXECUTION_STATUS[keyof typeof EXECUTION_STATUS];

/**
 * 执行状态配置
 */
export const EXECUTION_STATUS_CONFIG = {
  [EXECUTION_STATUS.PENDING]: {
    text: '等待中',
    color: 'default',
    status: 'Default',
    icon: 'ClockCircleOutlined',
    canPause: true,    // 修改：允许PENDING状态的任务可以暂停
    canResume: false,
    canStop: true,
    canCancel: true
  },
  [EXECUTION_STATUS.RUNNING]: {
    text: '运行中',
    color: 'processing',
    status: 'Processing',
    icon: 'ClockCircleOutlined',
    canPause: true,
    canResume: false,
    canStop: true,
    canCancel: true
  },
  [EXECUTION_STATUS.PAUSED]: {
    text: '已暂停',
    color: 'warning',
    status: 'Warning',
    icon: 'PauseCircleOutlined',
    canPause: false,
    canResume: true,
    canStop: true,
    canCancel: true
  },
  [EXECUTION_STATUS.STOPPED]: {
    text: '已停止',
    color: 'error',
    status: 'Error',
    icon: 'StopOutlined',
    canPause: false,
    canResume: false,
    canStop: false,
    canCancel: false
  },
  [EXECUTION_STATUS.COMPLETED]: {
    text: '已完成',
    color: 'success',
    status: 'Success',
    icon: 'CheckCircleOutlined',
    canPause: false,
    canResume: false,
    canStop: false,
    canCancel: false
  },
  [EXECUTION_STATUS.SUCCESS]: {
    text: '成功',
    color: 'success',
    status: 'Success',
    icon: 'CheckCircleOutlined',
    canPause: false,
    canResume: false,
    canStop: false,
    canCancel: false
  },
  [EXECUTION_STATUS.FAILED]: {
    text: '失败',
    color: 'error',
    status: 'Error',
    icon: 'ExclamationCircleOutlined',
    canPause: false,
    canResume: false,
    canStop: false,
    canCancel: false
  },
  [EXECUTION_STATUS.CANCELLED]: {
    text: '已取消',
    color: 'default',
    status: 'Default',
    icon: 'CloseCircleOutlined',
    canPause: false,
    canResume: false,
    canStop: false,
    canCancel: false
  }
} as const;

/**
 * 获取执行状态配置
 */
export function getExecutionStatusConfig(status: string) {
  const upperStatus = status?.toUpperCase();
  return EXECUTION_STATUS_CONFIG[upperStatus as ExecutionStatusType] || EXECUTION_STATUS_CONFIG[EXECUTION_STATUS.PENDING];
}

/**
 * 检查状态是否支持特定操作
 */
export function canExecuteAction(status: string, action: 'pause' | 'resume' | 'stop' | 'cancel'): boolean {
  const config = getExecutionStatusConfig(status);
  switch (action) {
    case 'pause':
      return config.canPause;
    case 'resume':
      return config.canResume;
    case 'stop':
      return config.canStop;
    case 'cancel':
      return config.canCancel;
    default:
      return false;
  }
}

/**
 * 获取状态显示文本
 */
export function getStatusText(status: string): string {
  return getExecutionStatusConfig(status).text;
}

/**
 * 获取状态颜色
 */
export function getStatusColor(status: string): string {
  return getExecutionStatusConfig(status).color;
}

/**
 * 获取状态标签状态
 */
export function getStatusTagStatus(status: string): string {
  return getExecutionStatusConfig(status).status;
}

/**
 * 获取可执行的操作列表
 */
export function getAvailableActions(status: string): string[] {
  const config = getExecutionStatusConfig(status);
  const actions: string[] = [];
  
  if (config.canPause) actions.push('pause');
  if (config.canResume) actions.push('resume');
  if (config.canStop) actions.push('stop');
  if (config.canCancel) actions.push('cancel');
  
  return actions;
}
