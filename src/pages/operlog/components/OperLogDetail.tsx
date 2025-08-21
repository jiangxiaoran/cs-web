import React, { useState } from 'react';
import { Modal, Descriptions, Tag, Divider, Button, Tooltip, Space } from 'antd';
import { CopyOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import type { OperLogItem } from '@/types/operlog.d';
import { getBusinessTypeText, getOperatorTypeText, formatDateTime } from '../utils';

interface OperLogDetailProps {
  visible: boolean;
  onCancel: () => void;
  operLog: OperLogItem | null;
}

// 文本截断工具函数
const truncateText = (text: string, maxLength: number = 50): string => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// 格式化JSON字符串
const formatJSON = (jsonString: string): string => {
  try {
    const parsed = JSON.parse(jsonString);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return jsonString;
  }
};

// 复制到剪贴板
const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    // 降级方案
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
};

const OperLogDetail: React.FC<OperLogDetailProps> = ({ visible, onCancel, operLog }) => {
  const [showFullParams, setShowFullParams] = useState(false);
  const [showFullResult, setShowFullResult] = useState(false);
  const [showFullError, setShowFullError] = useState(false);

  if (!operLog) return null;

  return (
    <Modal
      title="操作日志详情"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={900}
      destroyOnClose
      style={{ top: 20 }}
    >
      <Descriptions column={2} bordered size="small" labelStyle={{ fontWeight: 'bold', width: '120px' }}>
        <Descriptions.Item label="操作标题" span={2}>
          <div style={{ 
            fontSize: '14px', 
            fontWeight: '500',
            color: '#1890ff',
            wordBreak: 'break-word'
          }}>
            {operLog.title}
          </div>
        </Descriptions.Item>
        
        <Descriptions.Item label="业务类型">
          <Tag color="blue">{getBusinessTypeText(operLog.businessType)}</Tag>
        </Descriptions.Item>
        
        <Descriptions.Item label="操作状态">
          <Tag color={operLog.status === 0 ? 'success' : 'error'}>
            {operLog.status === 0 ? '正常' : '异常'}
          </Tag>
        </Descriptions.Item>
        
        <Descriptions.Item label="操作人员">
          <Tooltip title={operLog.operName}>
            <span>{truncateText(operLog.operName, 15)}</span>
          </Tooltip>
        </Descriptions.Item>
        
        <Descriptions.Item label="部门名称">
          <Tooltip title={operLog.deptName}>
            <span>{truncateText(operLog.deptName, 15)}</span>
          </Tooltip>
        </Descriptions.Item>
        
        <Descriptions.Item label="操作人员类型">
          {getOperatorTypeText(operLog.operatorType)}
        </Descriptions.Item>
        
        <Descriptions.Item label="请求方法">
          <Tag color="geekblue">{operLog.requestMethod}</Tag>
        </Descriptions.Item>
        
        <Descriptions.Item label="方法名称" span={2}>
          <div style={{ 
            backgroundColor: '#f6f8fa', 
            padding: '6px 8px', 
            borderRadius: '4px',
            fontSize: '12px',
            fontFamily: 'monospace',
            wordBreak: 'break-all',
            maxHeight: '60px',
            overflow: 'auto'
          }}>
            {operLog.method}
          </div>
        </Descriptions.Item>
        
        <Descriptions.Item label="请求URL" span={2}>
          <div style={{ 
            backgroundColor: '#f6f8fa', 
            padding: '6px 8px', 
            borderRadius: '4px',
            fontSize: '12px',
            fontFamily: 'monospace',
            wordBreak: 'break-all',
            maxHeight: '60px',
            overflow: 'auto'
          }}>
            {operLog.operUrl}
          </div>
        </Descriptions.Item>
        
        <Descriptions.Item label="IP地址">
          <code style={{ fontSize: '12px', color: '#1890ff' }}>{operLog.operIp}</code>
        </Descriptions.Item>
        
        <Descriptions.Item label="操作地点">
          <span>{operLog.operLocation || '未知'}</span>
        </Descriptions.Item>
        
        <Descriptions.Item label="操作时间">
          <span style={{ color: '#52c41a' }}>{formatDateTime(operLog.operTime)}</span>
        </Descriptions.Item>
        
        <Descriptions.Item label="耗时">
          <Tag color={operLog.costTime < 1000 ? 'success' : operLog.costTime < 5000 ? 'warning' : 'error'}>
            {operLog.costTime}ms
          </Tag>
        </Descriptions.Item>
        
        <Descriptions.Item label="请求参数" span={2}>
          <div style={{ position: 'relative' }}>
            <Space style={{ marginBottom: '8px' }}>
              <Button 
                type="text" 
                size="small" 
                icon={showFullParams ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                onClick={() => setShowFullParams(!showFullParams)}
              >
                {showFullParams ? '收起' : '展开'}
              </Button>
              <Button 
                type="text" 
                size="small" 
                icon={<CopyOutlined />}
                onClick={() => handleCopy(operLog.operParam || '', '请求参数')}
              >
                复制
              </Button>
            </Space>
            <pre style={{ 
              fontSize: '12px', 
              backgroundColor: '#f6f8fa', 
              padding: '8px', 
              borderRadius: '4px',
              margin: 0,
              maxHeight: showFullParams ? '400px' : '120px',
              overflow: 'auto',
              border: '1px solid #e8e8e8',
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              {operLog.operParam ? formatJSON(operLog.operParam) : '无'}
            </pre>
          </div>
        </Descriptions.Item>
        
        <Descriptions.Item label="返回结果" span={2}>
          <div style={{ position: 'relative' }}>
            <Space style={{ marginBottom: '8px' }}>
              <Button 
                type="text" 
                size="small" 
                icon={showFullResult ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                onClick={() => setShowFullResult(!showFullResult)}
              >
                {showFullResult ? '收起' : '展开'}
              </Button>
              <Button 
                type="text" 
                size="small" 
                icon={<CopyOutlined />}
                onClick={() => handleCopy(operLog.jsonResult || '', '返回结果')}
              >
                复制
              </Button>
            </Space>
            <pre style={{ 
              fontSize: '12px', 
              backgroundColor: '#f6f8fa', 
              padding: '8px', 
              borderRadius: '4px',
              margin: 0,
              maxHeight: showFullResult ? '400px' : '120px',
              overflow: 'auto',
              border: '1px solid #e8e8e8',
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              {operLog.jsonResult ? formatJSON(operLog.jsonResult) : '无'}
            </pre>
          </div>
        </Descriptions.Item>
        
        {operLog.errorMsg && (
          <Descriptions.Item label="错误信息" span={2}>
            <div style={{ position: 'relative' }}>
              <Space style={{ marginBottom: '8px' }}>
                <Button 
                  type="text" 
                  size="small" 
                  icon={showFullError ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                  onClick={() => setShowFullError(!showFullError)}
                >
                  {showFullError ? '收起' : '展开'}
                </Button>
                <Button 
                  type="text" 
                  size="small" 
                  icon={<CopyOutlined />}
                  onClick={() => handleCopy(operLog.errorMsg || '', '错误信息')}
                >
                  复制
                </Button>
              </Space>
              <pre style={{ 
                fontSize: '12px', 
                backgroundColor: '#fff2f0', 
                color: '#cf1322',
                padding: '8px', 
                borderRadius: '4px',
                margin: 0,
                maxHeight: showFullError ? '400px' : '120px',
                overflow: 'auto',
                border: '1px solid #ffccc7',
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {operLog.errorMsg}
              </pre>
            </div>
          </Descriptions.Item>
        )}
      </Descriptions>
    </Modal>
  );
};

export default OperLogDetail;