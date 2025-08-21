import request from '@/utils/request';
import type { OperLogParams, OperLogResponse, OperLogDetailResponse, OperLogStatistics } from '@/types/operlog.d';

// 获取操作日志列表
export async function getOperLogList(params: OperLogParams): Promise<OperLogResponse> {
  return request('/v1/operlog/list', {
    method: 'GET',
    params,
  });
}

// 获取操作日志详情
export async function getOperLogDetail(operId: number): Promise<OperLogDetailResponse> {
  return request(`/v1/operlog/${operId}`, {
    method: 'GET',
  });
}

// 删除操作日志
export async function deleteOperLog(operId: number): Promise<{ success: boolean; message: string }> {
  return request(`/v1/operlog/${operId}`, {
    method: 'DELETE',
  });
}

// 批量删除操作日志
export async function batchDeleteOperLog(operIds: number[]): Promise<{ success: boolean; message: string }> {
  return request('/v1/operlog/batch-delete', {
    method: 'DELETE',
    data: { operIds },
  });
}

// 清空所有操作日志
export async function clearOperLog(): Promise<{ success: boolean; message: string }> {
  return request('/v1/operlog/clear', {
    method: 'DELETE',
  });
}

// 获取操作日志统计信息
export async function getOperLogStatistics(): Promise<{ success: boolean; message: string; data: OperLogStatistics }> {
  return request('/v1/operlog/statistics', {
    method: 'GET',
  });
}