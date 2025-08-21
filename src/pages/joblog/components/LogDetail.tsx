import { Descriptions, Tag, Timeline, Card, Space, Typography } from 'antd';
import { 
  UserOutlined, 
  ClockCircleOutlined, 
  FileTextOutlined, 
  CheckCircleOutlined, 
  MessageOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  StopOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import React from 'react';
import { formatDateTime, formatDuration } from '@/utils/dateUtils';

const { Title, Text } = Typography;

interface LogDetailProps {
  log: API.JobExecutionLog;
}

const LogDetail: React.FC<LogDetailProps> = ({ log }) => {
  // 执行状态标签
  const getStatusTag = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return <Tag color="success">成功</Tag>;
      case 'FAILED':
        return <Tag color="error">失败</Tag>;
      case 'RUNNING':
        return <Tag color="processing">运行中</Tag>;
      case 'PENDING':
        return <Tag color="default">等待中</Tag>;
      case 'PAUSED':
        return <Tag color="warning">已暂停</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  // 生成执行时间线数据
  const generateTimelineData = () => {
    const timelineData = [];
    
    // 任务创建/分配
    timelineData.push({
      icon: <UserOutlined style={{ color: '#1890ff' }} />,
      title: '任务已分配',
      subtitle: `已分配给执行器: ${log.executorProc || '未知'}`,
      time: formatDateTime(log.startTime),
      color: '#1890ff'
    });

    // 任务开始执行
    if (log.startTime) {
      timelineData.push({
        icon: <PlayCircleOutlined style={{ color: '#52c41a' }} />,
        title: '开始执行',
        subtitle: `由执行器开始执行任务`,
        time: formatDateTime(log.startTime),
        color: '#52c41a'
      });
    }

    // 任务状态更新
    if (log.status === 'RUNNING') {
      timelineData.push({
        icon: <ClockCircleOutlined style={{ color: '#faad14' }} />,
        title: '执行中',
        subtitle: '任务正在执行中...',
        time: formatDateTime(new Date()),
        color: '#faad14'
      });
    } else if (log.status === 'PAUSED') {
      timelineData.push({
        icon: <PauseCircleOutlined style={{ color: '#faad14' }} />,
        title: '已暂停',
        subtitle: '任务执行已暂停',
        time: formatDateTime(log.startTime),
        color: '#faad14'
      });
    }

    // 任务完成或失败
    if (log.status === 'SUCCESS' && log.endTime) {
      timelineData.push({
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
        title: '执行完成',
        subtitle: `任务执行成功，耗时 ${log.duration || 0} 秒`,
        time: formatDateTime(log.endTime),
        color: '#52c41a'
      });
    } else if (log.status === 'FAILED' && log.endTime) {
      timelineData.push({
        icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
        title: '执行失败',
        subtitle: log.errorMessage || '任务执行失败',
        time: formatDateTime(log.endTime),
        color: '#ff4d4f'
      });
    } else if (log.status === 'STOPPED' && log.endTime) {
      timelineData.push({
        icon: <StopOutlined style={{ color: '#ff4d4f' }} />,
        title: '执行停止',
        subtitle: '任务执行被手动停止',
        time: formatDateTime(log.endTime),
        color: '#ff4d4f'
      });
    }

    // 通知状态
    if (log.notifyStatus) {
      let notifyIcon, notifyTitle, notifyColor;
      switch (log.notifyStatus) {
        case 'SENT':
          notifyIcon = <CheckCircleOutlined />;
          notifyTitle = '通知已发送';
          notifyColor = '#52c41a';
          break;
        case 'PENDING':
          notifyIcon = <ClockCircleOutlined />;
          notifyTitle = '通知待发送';
          notifyColor = '#faad14';
          break;
        case 'FAILED':
          notifyIcon = <ExclamationCircleOutlined />;
          notifyTitle = '通知发送失败';
          notifyColor = '#ff4d4f';
          break;
        default:
          notifyIcon = <MessageOutlined />;
          notifyTitle = '通知状态未知';
          notifyColor = '#8c8c8c';
      }
      
      timelineData.push({
        icon: React.cloneElement(notifyIcon, { style: { color: notifyColor } }),
        title: notifyTitle,
        subtitle: `通知状态: ${log.notifyStatus}`,
        time: log.endTime || log.startTime,
        color: notifyColor
      });
    }

    return timelineData;
  };

  const timelineData = generateTimelineData();

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* 任务时间线 */}
      <Card title="任务时间线" size="small">
        <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
          通过详细的更新和时间戳跟踪任务的执行进度。
        </Text>
        <Timeline
          items={timelineData.map((item, index) => ({
            color: item.color,
            children: (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
                  {item.title}
                </div>
                <div style={{ color: '#666', fontSize: '12px', marginBottom: 2 }}>
                  {item.subtitle}
                </div>
                <div style={{ color: '#999', fontSize: '11px' }}>
                  {item.time}
                </div>
              </div>
            ),
          }))}
        />
      </Card>

      {/* 任务详情 */}
      <Card title="任务详情" size="small">
        <Descriptions column={2} size="small" bordered>
          <Descriptions.Item label="日志ID" span={1}>
            {log.logId}
          </Descriptions.Item>
          <Descriptions.Item label="作业代码" span={1}>
            {log.jobCode}
          </Descriptions.Item>
          <Descriptions.Item label="批次号" span={1}>
            {log.batchNo || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="执行状态" span={1}>
            {getStatusTag(log.status)}
          </Descriptions.Item>
          <Descriptions.Item label="开始时间" span={1}>
            {log.startTime}
          </Descriptions.Item>
          <Descriptions.Item label="结束时间" span={1}>
            {log.endTime || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="执行时长" span={1}>
            {log.duration ? `${log.duration}秒` : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="重试次数" span={1}>
            {log.retryCount || 0}
          </Descriptions.Item>
          <Descriptions.Item label="通知状态" span={2}>
            {log.notifyStatus ? (
              <Tag color={
                log.notifyStatus === 'SENT' ? 'success' : 
                log.notifyStatus === 'PENDING' ? 'warning' : 'error'
              }>
                {log.notifyStatus === 'SENT' ? '已发送' : 
                 log.notifyStatus === 'PENDING' ? '待发送' : '发送失败'}
              </Tag>
            ) : '-'}
          </Descriptions.Item>
          {log.errorMessage && (
            <Descriptions.Item label="错误信息" span={2}>
              <Text type="danger">{log.errorMessage}</Text>
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      {/* 备注 */}
      <Card title="备注" size="small">
        <Text type="secondary">
          {log.errorMessage ? 
            `执行过程中出现错误: ${log.errorMessage}` : 
            '任务执行正常，无特殊备注。'
          }
        </Text>
      </Card>
    </Space>
  );
};

export default LogDetail; 