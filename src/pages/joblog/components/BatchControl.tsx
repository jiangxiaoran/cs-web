import React, { useState } from 'react';
import { Button, Modal, message, Space, Tag, Tooltip } from 'antd';
import {
  PauseCircleOutlined,
  StopOutlined,
  DeleteOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import {
  batchPauseJobsByBatchNo,
  batchStopJobsByBatchNo,
  getBatchJobs,
  getBatchGroups,
  cleanupBatchData,
} from '@/services/job/api';

interface BatchControlProps {
  batchNo: string;
  onSuccess?: () => void;
}

const BatchControl: React.FC<BatchControlProps> = ({ batchNo, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [batchInfo, setBatchInfo] = useState<{
    jobs: string[];
    groups: string[];
  } | null>(null);

  // 获取批次信息
  const fetchBatchInfo = async () => {
    try {
      setLoading(true);
      const [jobsRes, groupsRes] = await Promise.all([
        getBatchJobs(batchNo),
        getBatchGroups(batchNo),
      ]);

      if (jobsRes.success && groupsRes.success) {
        setBatchInfo({
          jobs: jobsRes.data || [],
          groups: groupsRes.data || [],
        });
      }
    } catch (error) {
      message.error('获取批次信息失败');
    } finally {
      setLoading(false);
    }
  };

  // 批量暂停
  const handleBatchPause = async () => {
    try {
      setLoading(true);
      const result = await batchPauseJobsByBatchNo(batchNo);
      
      if (result.success) {
        message.success(result.msg || '批量暂停成功');
        onSuccess?.();
      } else {
        message.error(result.msg || '批量暂停失败');
      }
    } catch (error) {
      message.error('批量暂停失败');
    } finally {
      setLoading(false);
    }
  };

  // 批量停止
  const handleBatchStop = async () => {
    try {
      setLoading(true);
      const result = await batchStopJobsByBatchNo(batchNo);
      
      if (result.success) {
        message.success(result.msg || '批量停止成功');
        onSuccess?.();
      } else {
        message.error(result.msg || '批量停止失败');
      }
    } catch (error) {
      message.error('批量停止失败');
    } finally {
      setLoading(false);
    }
  };

  // 清理批次数据
  const handleCleanup = () => {
    Modal.confirm({
      title: '确认清理',
      content: `确定要清理批次 ${batchNo} 的所有数据吗？此操作不可恢复！`,
      okText: '确认清理',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          setLoading(true);
          const result = await cleanupBatchData(batchNo);
          
          if (result.success) {
            message.success(result.msg || '批次数据清理成功');
            onSuccess?.();
          } else {
            message.error(result.msg || '批次数据清理失败');
          }
        } catch (error) {
          message.error('批次数据清理失败');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  return (
    <div>
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        {/* 批次信息显示 */}
        <div style={{ marginBottom: 16 }}>
          <Tag color="blue">批次号: {batchNo}</Tag>
          {batchInfo && (
            <>
              <Tag color="green">作业数量: {batchInfo.jobs.length}</Tag>
              <Tag color="orange">作业组数量: {batchInfo.groups.length}</Tag>
            </>
          )}
        </div>

        {/* 批次操作按钮 */}
        <Space wrap>
          <Tooltip title="查看批次详情">
            <Button
              icon={<EyeOutlined />}
              onClick={fetchBatchInfo}
              loading={loading}
            >
              查看详情
            </Button>
          </Tooltip>

          <Tooltip title="批量暂停">
            <Button
              icon={<PauseCircleOutlined />}
              onClick={handleBatchPause}
              loading={loading}
            >
              批量暂停
            </Button>
          </Tooltip>

          <Tooltip title="批量停止">
            <Button
              icon={<StopOutlined />}
              onClick={handleBatchStop}
              loading={loading}
            >
              批量停止
            </Button>
          </Tooltip>

          <Tooltip title="清理批次数据">
            <Button
              icon={<DeleteOutlined />}
              danger
              onClick={handleCleanup}
              loading={loading}
            >
              清理数据
            </Button>
          </Tooltip>
        </Space>

        {/* 批次详细信息 */}
        {batchInfo && (
          <div style={{ marginTop: 16 }}>
            <h4>批次详情</h4>
            <div style={{ marginBottom: 8 }}>
              <strong>作业列表:</strong>
              {batchInfo.jobs.length > 0 ? (
                <div style={{ marginTop: 4 }}>
                  {batchInfo.jobs.map((jobCode, index) => (
                    <Tag key={index} color="blue" style={{ marginBottom: 4 }}>
                      {jobCode}
                    </Tag>
                  ))}
                </div>
              ) : (
                <span style={{ color: '#999' }}> 无作业</span>
              )}
            </div>
            <div>
              <strong>作业组列表:</strong>
              {batchInfo.groups.length > 0 ? (
                <div style={{ marginTop: 4 }}>
                  {batchInfo.groups.map((groupName, index) => (
                    <Tag key={index} color="orange" style={{ marginBottom: 4 }}>
                      {groupName}
                    </Tag>
                  ))}
                </div>
              ) : (
                <span style={{ color: '#999' }}> 无作业组</span>
              )}
            </div>
          </div>
        )}
      </Space>
    </div>
  );
};

export default BatchControl;