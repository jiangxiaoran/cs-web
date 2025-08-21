import request from '@/utils/request';

/** 获取任务列表 */
export async function getJobList(params: API.JobListParams) {
  return request('/v1/jobs', {
    method: 'GET',
    params,
  });
}

/** 获取执行器分组 */
export async function getExecutorGroups() {
  return request('/v1/jobs/system/executors', {
    method: 'GET',
  });
}

/** 添加任务 */
export async function addJob(job: Partial<API.JobDef>) {
  return request('/v1/jobs', {
    method: 'POST',
    data: job,
  });
}

/** 更新任务 */
export async function updateJob(job: Partial<API.JobDef>) {
  return request(`/v1/jobs/${job.jobId}`, {
    method: 'PUT',
    data: job,
  });
}

/** 删除任务 */
export async function deleteJob(jobId: number) {
  return request(`/v1/jobs/${jobId}`, {
    method: 'DELETE',
  });
}

/** 启动任务 */
export async function startJob(jobId: number | string) {
  return request(`/v1/job-control/jobs/${jobId}/start`, {
    method: 'POST',
    data: { jobId },
  });
}

/** 停止任务（支持批次号） */
export async function stopJob(jobCode: string, batchNo?: string) {
  const params = batchNo ? { batchNo } : {};
  return request(`/v1/job-control/job/${jobCode}/stop`, {
    method: 'POST',
    params,
  });
}

/** 暂停任务（支持批次号） */
export async function pauseJob(jobCode: string, batchNo?: string) {
  const params = batchNo ? { batchNo } : {};
  return request(`/v1/job-control/job/${jobCode}/pause`, {
    method: 'POST',
    params,
  });
}

/** 恢复任务（支持批次号） */
export async function resumeJob(jobCode: string, batchNo?: string) {
  const params = batchNo ? { batchNo } : {};
  return request(`/v1/job-control/job/${jobCode}/resume`, {
    method: 'POST',
    params,
  });
}

/** 取消任务（支持批次号） */
export async function cancelJob(jobCode: string, batchNo?: string) {
  const params = batchNo ? { batchNo } : {};
  return request(`/v1/job-control/job/${jobCode}/cancel`, {
    method: 'POST',
    params,
  });
}

/** 获取执行日志列表 */
export async function getJobExecutionLogList(params: API.JobLogParams) {
  return request('/v1/jobs/logs', {
    method: 'GET',
    params,
  });
}

/** 清除执行日志 */
export async function clearJobExecutionLog(logId: number) {
  return request(`/v1/jobs/logs/${logId}`, {
    method: 'DELETE',
  });
}

/** 获取执行日志详情 */
export async function getJobExecutionLogDetail(logId: number) {
  return request(`/v1/jobs/logs/${logId}`, {
    method: 'GET',
  });
}

// ==================== 根据执行日志ID操作 ====================

/** 根据执行日志ID暂停任务 */
export async function pauseJobByLogId(logId: number) {
  return request(`/v1/job-control/job/execution/${logId}/pause`, {
    method: 'POST',
  });
}

/** 根据执行日志ID恢复任务 */
export async function resumeJobByLogId(logId: number) {
  return request(`/v1/job-control/job/execution/${logId}/resume`, {
    method: 'POST',
  });
}

/** 根据执行日志ID停止任务 */
export async function stopJobByLogId(logId: number) {
  return request(`/v1/job-control/job/execution/${logId}/stop`, {
    method: 'POST',
  });
}

/** 根据执行日志ID取消任务 */
export async function cancelJobByLogId(logId: number) {
  return request(`/v1/job-control/job/execution/${logId}/cancel`, {
    method: 'POST',
  });
}

// ==================== 作业组控制接口（支持批次号） ====================

/** 暂停作业组（支持批次号） */
export async function pauseJobGroup(groupName: string, batchNo?: string) {
  const params = batchNo ? { batchNo } : {};
  return request(`/v1/job-control/group/${groupName}/pause`, {
    method: 'POST',
    params,
  });
}

/** 恢复作业组（支持批次号） */
export async function resumeJobGroup(groupName: string, batchNo?: string) {
  const params = batchNo ? { batchNo } : {};
  return request(`/v1/job-control/group/${groupName}/resume`, {
    method: 'POST',
    params,
  });
}

/** 停止作业组（支持批次号） */
export async function stopJobGroup(groupName: string, batchNo?: string) {
  const params = batchNo ? { batchNo } : {};
  return request(`/v1/job-control/group/${groupName}/stop`, {
    method: 'POST',
    params,
  });
}

/** 取消作业组（支持批次号） */
export async function cancelJobGroup(groupName: string, batchNo?: string) {
  const params = batchNo ? { batchNo } : {};
  return request(`/v1/job-control/group/${groupName}/cancel`, {
    method: 'POST',
    params,
  });
}

// ==================== 批次级别操作 ====================

/** 根据批次号批量暂停任务 */
export async function batchPauseJobsByBatchNo(batchNo: string) {
  return request(`/v1/job-control/batch/${batchNo}/pause`, {
    method: 'POST',
  });
}

/** 根据批次号批量停止任务 */
export async function batchStopJobsByBatchNo(batchNo: string) {
  return request(`/v1/job-control/batch/${batchNo}/stop`, {
    method: 'POST',
  });
}

/** 获取批次中的所有作业 */
export async function getBatchJobs(batchNo: string) {
  return request(`/v1/job-control/batch/${batchNo}/jobs`, {
    method: 'GET',
  });
}

/** 获取批次中的所有作业组 */
export async function getBatchGroups(batchNo: string) {
  return request(`/v1/job-control/batch/${batchNo}/groups`, {
    method: 'GET',
  });
}

/** 清理批次数据 */
export async function cleanupBatchData(batchNo: string) {
  return request(`/v1/job-control/batch/${batchNo}`, {
    method: 'DELETE',
  });
}

/** 获取批次统计信息 */
export async function getBatchStatistics(batchNo: string) {
  return request(`/v1/job-control/batch/${batchNo}/statistics`, {
    method: 'GET',
  });
}

// ==================== 状态查询接口（支持批次号） ====================

/** 获取作业状态（支持批次号） */
export async function getJobStatus(jobCode: string, batchNo?: string) {
  const params = batchNo ? { batchNo } : {};
  return request(`/v1/job-control/job/${jobCode}/status`, {
    method: 'GET',
    params,
  });
}

/** 获取作业组状态（支持批次号） */
export async function getGroupStatus(groupName: string, batchNo?: string) {
  const params = batchNo ? { batchNo } : {};
  return request(`/v1/job-control/group/${groupName}/status`, {
    method: 'GET',
    params,
  });
} 