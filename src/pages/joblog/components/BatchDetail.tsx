import { Timeline, Card, Space, Typography, Table, Tag, Button, Tooltip, Row, Col, Statistic } from 'antd';
import { 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  ExclamationCircleOutlined,
  PauseCircleOutlined,
  ReloadOutlined,
  FileTextOutlined,
  StopOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { getJobExecutionLogList, getBatchStatistics } from '@/services/job/api';
import { formatDateTime, formatDuration } from '@/utils/dateUtils';
import BatchControl from './BatchControl';

const { Title, Text } = Typography;

interface BatchDetailProps {
  batchNo: string;
  onClose: () => void;
}

interface BatchTask {
  logId: number;
  jobCode: string;
  status: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  errorMessage?: string;
  notifyStatus?: string;
  retryCount?: number;
}

interface BatchStatistics {
  batchNo: string;
  totalJobs: number;
  runningJobs: number;
  completedJobs: number;
  failedJobs: number;
  pausedJobs: number;
  stoppedJobs: number;
  cancelledJobs: number;
  successRate: number;
  lastUpdateTime: string;
  dataSource: string;
}

const BatchDetail: React.FC<BatchDetailProps> = ({ batchNo, onClose }) => {
  const [batchTasks, setBatchTasks] = useState<BatchTask[]>([]);
  const [batchStatistics, setBatchStatistics] = useState<BatchStatistics | null>(null);
  const [loading, setLoading] = useState(false);

  // 获取批次任务列表
  const fetchBatchTasks = async () => {
    setLoading(true);
    try {
      const response = await getJobExecutionLogList({ batchNo });
      if (response && response.success && response.data) {
        const tasks = Array.isArray(response.data) ? response.data : response.data.list || [];
        // 按照开始时间排序
        const sortedTasks = tasks.sort((a: any, b: any) => 
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );
        setBatchTasks(sortedTasks);
      }
    } catch (error) {
      console.error('获取批次任务失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 获取批次统计信息
  const fetchBatchStatistics = async () => {
    try {
      console.log('🔍 开始获取批次统计信息，批次号:', batchNo);
      const response = await getBatchStatistics(batchNo);
      console.log('🔍 批次统计API响应:', response);
      console.log('🔍 响应类型:', typeof response);
      console.log('🔍 响应结构:', JSON.stringify(response, null, 2));
      
      if (response && response.success && response.data) {
        console.log('🔍 设置批次统计数据:', response.data);
        setBatchStatistics(response.data);
      } else {
        console.warn('🔍 批次统计响应格式不正确:', response);
      }
    } catch (error) {
      console.error('🔍 获取批次统计失败:', error);
    }
  };

  useEffect(() => {
    fetchBatchTasks();
    fetchBatchStatistics();
  }, [batchNo]);

  // 执行状态标签
  const getStatusTag = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'SUCCESS':
      case 'COMPLETED':
        return <Tag color="success">成功</Tag>;
      case 'FAILED':
        return <Tag color="error">失败</Tag>;
      case 'RUNNING':
        return <Tag color="processing">运行中</Tag>;
      case 'PENDING':
        return <Tag color="default">等待中</Tag>;
      case 'PAUSED':
        return <Tag color="warning">已暂停</Tag>;
      case 'STOPPED':
        return <Tag color="error">已停止</Tag>;
      case 'CANCELLED':
        return <Tag color="default">已取消</Tag>;
      default:
        return <Tag color="default">{status || '未知'}</Tag>;
    }
  };

  // 通知状态标签
  const getNotifyStatusTag = (status: string) => {
    switch (status) {
      case 'SENT':
        return <Tag color="success">已发送</Tag>;
      case 'PENDING':
        return <Tag color="warning">待发送</Tag>;
      case 'FAILED':
        return <Tag color="error">发送失败</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  // 生成详细任务执行时间线
  const generateDetailedTaskTimeline = () => {
    if (batchTasks.length === 0) return [];

    return batchTasks.map((task, index) => {
      let icon, color, statusText, tagColor;
      
      switch (task.status?.toUpperCase()) {
        case 'SUCCESS':
        case 'COMPLETED':
          icon = <CheckCircleOutlined />;
          color = '#52c41a';
          statusText = '执行成功';
          tagColor = 'success';
          break;
        case 'FAILED':
          icon = <ExclamationCircleOutlined />;
          color = '#ff4d4f';
          statusText = '执行失败';
          tagColor = 'error';
          break;
        case 'RUNNING':
          icon = <ClockCircleOutlined />;
          color = '#faad14';
          statusText = '执行中';
          tagColor = 'processing';
          break;
        case 'PENDING':
          icon = <ClockCircleOutlined />;
          color = '#d9d9d9';
          statusText = '等待中';
          tagColor = 'default';
          break;
        case 'PAUSED':
          icon = <PauseCircleOutlined />;
          color = '#faad14';
          statusText = '已暂停';
          tagColor = 'warning';
          break;
        case 'STOPPED':
          icon = <StopOutlined />;
          color = '#ff4d4f';
          statusText = '已停止';
          tagColor = 'error';
          break;
        case 'CANCELLED':
          icon = <CloseCircleOutlined />;
          color = '#d9d9d9';
          statusText = '已取消';
          tagColor = 'default';
          break;
        default:
          icon = <FileTextOutlined />;
          color = '#d9d9d9';
          statusText = task.status || '未知';
          tagColor = 'default';
      }

      const startTime = new Date(task.startTime);
      const endTime = task.endTime ? new Date(task.endTime) : null;
      
      // 计算执行时长，确保不会产生NaN
      let duration = 0;
      if (task.duration && !isNaN(task.duration) && isFinite(task.duration)) {
        duration = task.duration;
      } else if (endTime && !isNaN(startTime.getTime()) && !isNaN(endTime.getTime())) {
        duration = Math.round((endTime.getTime() - startTime.getTime()) / 1000);
        // 确保计算结果有效
        if (isNaN(duration) || !isFinite(duration) || duration < 0) {
          duration = 0;
        }
      }

      return {
        icon: React.cloneElement(icon, { style: { color } }),
        color,
        children: (
          <div style={{ 
            marginBottom: 16, 
            padding: '12px 16px', 
            backgroundColor: '#fafafa', 
            borderRadius: '6px',
            border: `1px solid ${color}20`,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f0f0f0';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#fafafa';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          >
            <div style={{ 
              fontWeight: 'bold', 
              marginBottom: 8, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 8,
              fontSize: '14px'
            }}>
              <span style={{ color: '#1890ff' }}>任务 {index + 1}: {task.jobCode}</span>
              <Tag color={tagColor} style={{ margin: 0 }}>
                {statusText}
              </Tag>
            </div>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '8px',
              fontSize: '12px'
            }}>
              <div style={{ color: '#666' }}>
                <Text strong>开始时间:</Text> {formatDateTime(task.startTime)}
              </div>
              {endTime && (
                <div style={{ color: '#666' }}>
                  <Text strong>结束时间:</Text> {formatDateTime(task.endTime)}
                </div>
              )}
              {duration > 0 && (
                <div style={{ color: '#666' }}>
                  <Text strong>执行时长:</Text> {formatDuration(duration)}
                </div>
              )}
              {task.retryCount && task.retryCount > 0 && (
                <div style={{ color: '#faad14' }}>
                  <Text strong>重试次数:</Text> {task.retryCount}
                </div>
              )}
            </div>
                                      {task.errorMessage && 
               task.errorMessage.trim() !== '' && 
               task.status.toUpperCase() !== 'SUCCESS' && 
               !task.errorMessage.toLowerCase().includes('成功') && (
               <div style={{ 
                 color: '#ff4d4f', 
                 fontSize: '12px', 
                 marginTop: '8px',
                 padding: '8px',
                 backgroundColor: '#fff2f0',
                 border: '1px solid #ffccc7',
                 borderRadius: '4px'
               }}>
                 <Text strong></Text> {task.errorMessage}
               </div>
             )}
          </div>
        ),
      };
    });
  };

  // 表格列定义
  const columns = [
    {
      title: '序号',
      key: 'index',
      width: 60,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: '任务ID',
      dataIndex: 'logId',
      key: 'logId',
      width: 80,
    },
    {
      title: '作业代码',
      dataIndex: 'jobCode',
      key: 'jobCode',
      width: 120,
      ellipsis: true,
    },
    {
      title: '执行状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => getStatusTag(status),
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 150,
      render: (text: string) => formatDateTime(text),
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
      width: 150,
      render: (text: string) => formatDateTime(text),
    },
    {
      title: '执行时长',
      dataIndex: 'duration',
      key: 'duration',
      width: 100,
      render: (duration: number) => {
        // 确保传入的是有效数字
        if (duration === null || duration === undefined || isNaN(duration) || !isFinite(duration)) {
          return '-';
        }
        return formatDuration(duration);
      },
    },
    {
      title: '通知状态',
      dataIndex: 'notifyStatus',
      key: 'notifyStatus',
      width: 100,
      render: (status: string) => status ? getNotifyStatusTag(status) : '-',
    },
    {
      title: '重试次数',
      dataIndex: 'retryCount',
      key: 'retryCount',
      width: 80,
    },
  ];

  const detailedTaskTimeline = generateDetailedTaskTimeline();

  // 使用后端统计数据，如果没有则使用前端计算（大小写不敏感）
  const totalTasks = batchStatistics?.totalJobs || batchTasks.length;
  const runningTasks = batchStatistics?.runningJobs || batchTasks.filter(t => t.status.toUpperCase() === 'RUNNING').length;
  const completedTasks = batchStatistics?.completedJobs || batchTasks.filter(t => t.status.toUpperCase() === 'SUCCESS').length;
  const failedTasks = batchStatistics?.failedJobs || batchTasks.filter(t => t.status.toUpperCase() === 'FAILED').length;
  const pausedTasks = batchStatistics?.pausedJobs || batchTasks.filter(t => t.status.toUpperCase() === 'PAUSED').length;
  const successRate = batchStatistics?.successRate || (totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0);

  // 调试日志：显示统计变量的值
  console.log('🔍 统计变量值:', {
    batchStatistics: batchStatistics,
    totalTasks,
    runningTasks,
    completedTasks,
    failedTasks,
    pausedTasks,
    successRate
  });

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* 批次信息头部 */}
      <Card size="small">
        <Space style={{ width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={4} style={{ margin: 0 }}>批次详情</Title>
            <Text type="secondary">批次号: {batchNo}</Text>
          </div>
          <Space>
            <Tooltip title="刷新数据">
              <Button 
                icon={<ReloadOutlined />} 
                onClick={fetchBatchTasks}
                loading={loading}
              />
            </Tooltip>
            <Button onClick={onClose}>关闭</Button>
          </Space>
        </Space>
      </Card>

      {/* 批次统计信息 */}
      <Card title="批次统计" size="small">
        <Row gutter={16}>
          <Col span={4}>
            <Statistic title="总任务数" value={totalTasks} />
          </Col>
          <Col span={4}>
            <Statistic title="运行中" value={runningTasks} valueStyle={{ color: '#1890ff' }} />
          </Col>
          <Col span={4}>
            <Statistic title="已完成" value={completedTasks} valueStyle={{ color: '#52c41a' }} />
          </Col>
          <Col span={4}>
            <Statistic title="已失败" value={failedTasks} valueStyle={{ color: '#ff4d4f' }} />
          </Col>
          <Col span={4}>
            <Statistic title="已暂停" value={pausedTasks} valueStyle={{ color: '#faad14' }} />
          </Col>
          <Col span={4}>
            <Statistic title="成功率" value={successRate} suffix="%" valueStyle={{ color: successRate >= 80 ? '#52c41a' : successRate >= 60 ? '#faad14' : '#ff4d4f' }} />
          </Col>
        </Row>
        {batchStatistics && (
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <Text type="secondary">
              数据来源: {batchStatistics.dataSource} | 
              更新时间: {batchStatistics.lastUpdateTime ? new Date(batchStatistics.lastUpdateTime).toLocaleString() : '未知'}
            </Text>
          </div>
        )}
      </Card>

      {/* 批次控制操作 */}
      <Card title="批次控制" size="small">
        <BatchControl 
          batchNo={batchNo} 
          onSuccess={() => {
            // 刷新批次数据
            fetchBatchTasks();
          }} 
        />
      </Card>

      {/* 详细任务执行时间线 */}
      <Card title="批次执行时间线" size="small">
        <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
          按照执行顺序显示每个作业任务的详细执行情况。
        </Text>
        <Timeline
          items={detailedTaskTimeline}
        />
      </Card>

      {/* 任务列表 */}
      <Card title="任务列表" size="small">
        <Table
          columns={columns}
          dataSource={batchTasks}
          rowKey="logId"
          size="small"
          pagination={false}
          loading={loading}
          scroll={{ x: 800 }}
        />
      </Card>
    </Space>
  );
};

export default BatchDetail; 