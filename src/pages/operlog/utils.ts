import dayjs from 'dayjs';

// 格式化日期时间
export function formatDateTime(time: string | Date): string {
  if (!time) return '-';
  try {
    return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
  } catch (error) {
    return String(time);
  }
}

// 获取业务类型文本
export function getBusinessTypeText(businessType: number): string {
  const typeMap: Record<number, string> = {
    // 基础操作类型
    0: '其它/查询',
    1: '新增/创建',
    2: '修改/更新',
    3: '删除/移除',
    
    // 任务调度相关
    4: '执行/运行任务',
    5: '调度/计划任务',
    6: '暂停任务',
    7: '恢复任务',
    8: '停止任务',
    9: '取消任务',
    
    // 系统配置相关
    10: '配置/设置',
    11: '验证/校验',
    12: '同步/同步状态',
    
    // 监控运维相关
    13: '监控/检查',
    14: '健康检查',
    15: '通知/告警',
    
    // 数据管理相关
    16: '导出数据',
    17: '导入数据',
    18: '备份数据',
    19: '恢复数据',
    20: '清理数据',
    
    // 用户认证相关
    21: '用户登录',
    22: '用户登出',
    23: '权限管理',
    24: '角色管理',
    
    // 批次管理相关
    25: '创建批次',
    26: '启动批次',
    27: '暂停批次',
    28: '恢复批次',
    29: '停止批次',
    30: '取消批次',
    31: '清理批次',
    
    // 执行器管理相关
    32: '添加执行器',
    33: '更新执行器',
    34: '移除执行器',
    35: '执行器健康检查',
    
    // 作业组管理相关
    36: '创建作业组',
    37: '更新作业组',
    38: '删除作业组',
    39: '作业组调度',
    
    // 日志管理相关
    40: '查询日志',
    41: '删除日志',
    42: '清理日志',
    43: '导出日志',
    
    // 统计分析相关
    44: '查询统计',
    45: '计算统计',
    46: '导出统计',
    
    // 系统维护相关
    47: '系统维护',
    48: '清理缓存',
    49: '刷新缓存',
    50: '系统重启',
  };
  return typeMap[businessType] || '未知类型';
}

// 获取业务类型选项（用于Select组件）
export function getBusinessTypeOptions() {
  return [
    { value: 0, label: '其它/查询' },
    { value: 1, label: '新增/创建' },
    { value: 2, label: '修改/更新' },
    { value: 3, label: '删除/移除' },
    { value: 4, label: '执行/运行任务' },
    { value: 5, label: '调度/计划任务' },
    { value: 6, label: '暂停任务' },
    { value: 7, label: '恢复任务' },
    { value: 8, label: '停止任务' },
    { value: 9, label: '取消任务' },
    { value: 10, label: '配置/设置' },
    { value: 11, label: '验证/校验' },
    { value: 12, label: '同步/同步状态' },
    { value: 13, label: '监控/检查' },
    { value: 14, label: '健康检查' },
    { value: 15, label: '通知/告警' },
    { value: 16, label: '导出数据' },
    { value: 17, label: '导入数据' },
    { value: 18, label: '备份数据' },
    { value: 19, label: '恢复数据' },
    { value: 20, label: '清理数据' },
    { value: 21, label: '用户登录' },
    { value: 22, label: '用户登出' },
    { value: 23, label: '权限管理' },
    { value: 24, label: '角色管理' },
    { value: 25, label: '创建批次' },
    { value: 26, label: '启动批次' },
    { value: 27, label: '暂停批次' },
    { value: 28, label: '恢复批次' },
    { value: 29, label: '停止批次' },
    { value: 30, label: '取消批次' },
    { value: 31, label: '清理批次' },
    { value: 32, label: '添加执行器' },
    { value: 33, label: '更新执行器' },
    { value: 34, label: '移除执行器' },
    { value: 35, label: '执行器健康检查' },
    { value: 36, label: '创建作业组' },
    { value: 37, label: '更新作业组' },
    { value: 38, label: '删除作业组' },
    { value: 39, label: '作业组调度' },
    { value: 40, label: '查询日志' },
    { value: 41, label: '删除日志' },
    { value: 42, label: '清理日志' },
    { value: 43, label: '导出日志' },
    { value: 44, label: '查询统计' },
    { value: 45, label: '计算统计' },
    { value: 46, label: '导出统计' },
    { value: 47, label: '系统维护' },
    { value: 48, label: '清理缓存' },
    { value: 49, label: '刷新缓存' },
    { value: 50, label: '系统重启' },
  ];
}

// 获取分组业务类型选项（用于Select组件，按功能模块分组）
export function getGroupedBusinessTypeOptions() {
  return [
    {
      label: '基础操作',
      options: [
        { value: 0, label: '其它/查询' },
        { value: 1, label: '新增/创建' },
        { value: 2, label: '修改/更新' },
        { value: 3, label: '删除/移除' },
      ]
    },
    {
      label: '任务调度',
      options: [
        { value: 4, label: '执行/运行任务' },
        { value: 5, label: '调度/计划任务' },
        { value: 6, label: '暂停任务' },
        { value: 7, label: '恢复任务' },
        { value: 8, label: '停止任务' },
        { value: 9, label: '取消任务' },
      ]
    },
    {
      label: '系统配置',
      options: [
        { value: 10, label: '配置/设置' },
        { value: 11, label: '验证/校验' },
        { value: 12, label: '同步/同步状态' },
      ]
    },
    {
      label: '监控运维',
      options: [
        { value: 13, label: '监控/检查' },
        { value: 14, label: '健康检查' },
        { value: 15, label: '通知/告警' },
      ]
    },
    {
      label: '数据管理',
      options: [
        { value: 16, label: '导出数据' },
        { value: 17, label: '导入数据' },
        { value: 18, label: '备份数据' },
        { value: 19, label: '恢复数据' },
        { value: 20, label: '清理数据' },
      ]
    },
    {
      label: '用户认证',
      options: [
        { value: 21, label: '用户登录' },
        { value: 22, label: '用户登出' },
        { value: 23, label: '权限管理' },
        { value: 24, label: '角色管理' },
      ]
    },
    {
      label: '批次管理',
      options: [
        { value: 25, label: '创建批次' },
        { value: 26, label: '启动批次' },
        { value: 27, label: '暂停批次' },
        { value: 28, label: '恢复批次' },
        { value: 29, label: '停止批次' },
        { value: 30, label: '取消批次' },
        { value: 31, label: '清理批次' },
      ]
    },
    {
      label: '执行器管理',
      options: [
        { value: 32, label: '添加执行器' },
        { value: 33, label: '更新执行器' },
        { value: 34, label: '移除执行器' },
        { value: 35, label: '执行器健康检查' },
      ]
    },
    {
      label: '作业组管理',
      options: [
        { value: 36, label: '创建作业组' },
        { value: 37, label: '更新作业组' },
        { value: 38, label: '删除作业组' },
        { value: 39, label: '作业组调度' },
      ]
    },
    {
      label: '日志管理',
      options: [
        { value: 40, label: '查询日志' },
        { value: 41, label: '删除日志' },
        { value: 42, label: '清理日志' },
        { value: 43, label: '导出日志' },
      ]
    },
    {
      label: '统计分析',
      options: [
        { value: 44, label: '查询统计' },
        { value: 45, label: '计算统计' },
        { value: 46, label: '导出统计' },
      ]
    },
    {
      label: '系统维护',
      options: [
        { value: 47, label: '系统维护' },
        { value: 48, label: '清理缓存' },
        { value: 49, label: '刷新缓存' },
        { value: 50, label: '系统重启' },
      ]
    },
  ];
}

// 获取业务类型颜色
export function getBusinessTypeColor(businessType: number): string {
  // 基础操作类型
  if (businessType >= 0 && businessType <= 3) {
    return 'default';
  }
  // 任务调度相关
  if (businessType >= 4 && businessType <= 9) {
    return 'blue';
  }
  // 系统配置相关
  if (businessType >= 10 && businessType <= 12) {
    return 'purple';
  }
  // 监控运维相关
  if (businessType >= 13 && businessType <= 15) {
    return 'orange';
  }
  // 数据管理相关
  if (businessType >= 16 && businessType <= 20) {
    return 'green';
  }
  // 用户认证相关
  if (businessType >= 21 && businessType <= 24) {
    return 'cyan';
  }
  // 批次管理相关
  if (businessType >= 25 && businessType <= 31) {
    return 'magenta';
  }
  // 执行器管理相关
  if (businessType >= 32 && businessType <= 35) {
    return 'geekblue';
  }
  // 作业组管理相关
  if (businessType >= 36 && businessType <= 39) {
    return 'volcano';
  }
  // 日志管理相关
  if (businessType >= 40 && businessType <= 43) {
    return 'lime';
  }
  // 统计分析相关
  if (businessType >= 44 && businessType <= 46) {
    return 'gold';
  }
  // 系统维护相关
  if (businessType >= 47 && businessType <= 50) {
    return 'red';
  }
  return 'default';
}

// 获取状态文本
export function getStatusText(status: number): string {
  return status === 0 ? '正常' : '异常';
}

// 获取状态颜色
export function getStatusColor(status: number): string {
  return status === 0 ? 'success' : 'error';
}

// 获取操作人员类型文本
export function getOperatorTypeText(operatorType: number): string {
  const typeMap: Record<number, string> = {
    0: '其他',
    1: '后台用户',
    2: '手机端用户',
  };
  return typeMap[operatorType] || '未知';
}

// 截断长文本
export function truncateText(text: string, maxLength: number = 50): string {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}