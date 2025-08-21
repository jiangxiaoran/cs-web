import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable,
  FooterToolbar,
} from '@ant-design/pro-components';
import { Button, message, Modal, Space, Tag, Drawer, Tooltip } from 'antd';
import { 
  PauseCircleOutlined, 
  PlayCircleOutlined, 
  StopOutlined, 
  CloseCircleOutlined,
  EyeOutlined
} from '@ant-design/icons';
import React, { useRef, useState, useEffect } from 'react';
import { 
  getJobExecutionLogList, 
  clearJobExecutionLog, 
  getJobExecutionLogDetail,
  stopJob,
  pauseJob,
  resumeJob,
  cancelJob,
  pauseJobByLogId,
  resumeJobByLogId,
  stopJobByLogId,
  cancelJobByLogId
} from '@/services/job/api';
import LogDetail from './components/LogDetail';
import BatchDetail from './components/BatchDetail';
import { formatDateTime, formatDuration } from '@/utils/dateUtils';
import { 
  EXECUTION_STATUS, 
  getExecutionStatusConfig, 
  canExecuteAction,
  getStatusText,
  getStatusColor,
  getStatusTagStatus,
  getAvailableActions
} from '@/constants/executionStatus';

const JobLogList: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const [selectedRows, setSelectedRows] = useState<API.JobExecutionLog[]>([]);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentLog, setCurrentLog] = useState<API.JobExecutionLog>();
  const [batchDetailVisible, setBatchDetailVisible] = useState(false);
  const [currentBatchNo, setCurrentBatchNo] = useState<string>('');
  const [searchCollapsed, setSearchCollapsed] = useState(true);

  // 执行状态标签
  const getStatusTag = (status: string) => {
    const config = getExecutionStatusConfig(status);
    return <Tag color={config.color}>{config.text}</Tag>;
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

  // 获取操作按钮
  const getActionButtons = (record: API.JobExecutionLog) => {
    const buttons = [];

    // 查看详情按钮
    buttons.push(
      <Tooltip key="detail" title="查看详情">
        <Button
          type="text"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => {
            setCurrentLog(record);
            setDetailVisible(true);
          }}
        />
      </Tooltip>
    );

    // 根据执行状态显示不同的控制按钮
    const availableActions = getAvailableActions(record.status);
    
    if (availableActions.includes('pause')) {
      buttons.push(
        <Tooltip key="pause" title="暂停">
          <Button
            type="text"
            size="small"
            icon={<PauseCircleOutlined />}
            onClick={async () => {
              try {
                await pauseJobByLogId(record.logId);
                message.success('暂停成功');
                actionRef.current?.reload();
              } catch (error) {
                message.error('暂停失败');
              }
            }}
          />
        </Tooltip>
      );
    }
    
    if (availableActions.includes('resume')) {
      buttons.push(
        <Tooltip key="resume" title="恢复">
          <Button
            type="text"
            size="small"
            icon={<PlayCircleOutlined />}
            onClick={async () => {
              try {
                await resumeJobByLogId(record.logId);
                message.success('恢复成功');
                actionRef.current?.reload();
              } catch (error) {
                message.error('恢复失败');
              }
            }}
          />
        </Tooltip>
      );
    }
    
    if (availableActions.includes('stop')) {
      buttons.push(
        <Tooltip key="stop" title="停止">
          <Button
            type="text"
            size="small"
            icon={<StopOutlined />}
            onClick={async () => {
              try {
                await stopJobByLogId(record.logId);
                message.success('停止成功');
                actionRef.current?.reload();
              } catch (error) {
                message.error('停止失败');
              }
            }}
          />
        </Tooltip>
      );
    }
    
    if (availableActions.includes('cancel')) {
      buttons.push(
        <Tooltip key="cancel" title="取消">
          <Button
            type="text"
            size="small"
            icon={<CloseCircleOutlined />}
            onClick={async () => {
              try {
                await cancelJobByLogId(record.logId);
                message.success('取消成功');
                actionRef.current?.reload();
              } catch (error) {
                message.error('取消失败');
              }
            }}
          />
        </Tooltip>
      );
    }

    return buttons;
  };

  // 批量操作处理
  const handleBatchOperation = async (operation: string) => {
    if (selectedRows.length === 0) {
      message.warning('请选择要操作的任务');
      return;
    }

    const operationMap: { [key: string]: { api: Function; successMsg: string; errorMsg: string } } = {
      pause: { api: pauseJobByLogId, successMsg: '暂停成功', errorMsg: '暂停失败' },
      resume: { api: resumeJobByLogId, successMsg: '恢复成功', errorMsg: '恢复失败' },
      stop: { api: stopJobByLogId, successMsg: '停止成功', errorMsg: '停止失败' },
      cancel: { api: cancelJobByLogId, successMsg: '取消成功', errorMsg: '取消失败' },
    };

    const operationConfig = operationMap[operation];
    if (!operationConfig) {
      message.error('不支持的操作类型');
      return;
    }

    try {
      const promises = selectedRows.map(row => operationConfig.api(row.logId));
      await Promise.all(promises);
      message.success(operationConfig.successMsg);
      actionRef.current?.reload();
    } catch (error) {
      message.error(operationConfig.errorMsg);
    }
  };

  const columns: ProColumns<API.JobExecutionLog>[] = [
    {
      title: '日志ID',
      dataIndex: 'logId',
      width: 100,
      search: false,
      sorter: true,
      defaultSortOrder: 'descend',
    },
    {
      title: '作业代码',
      dataIndex: 'jobCode',
      width: 150,
      ellipsis: true,
      search: true,
      render: (text, record) => (
        <a
          onClick={() => {
            setCurrentLog(record);
            setDetailVisible(true);
          }}
          style={{ cursor: 'pointer' }}
        >
          {text}
        </a>
      ),
    },
    {
      title: '执行状态',
      dataIndex: 'status',
      width: 100,
      render: (_, record) => getStatusTag(record.status),
      valueType: 'select',
      valueEnum: {
        [EXECUTION_STATUS.PENDING]: { text: getStatusText(EXECUTION_STATUS.PENDING), status: getStatusTagStatus(EXECUTION_STATUS.PENDING) },
        [EXECUTION_STATUS.RUNNING]: { text: getStatusText(EXECUTION_STATUS.RUNNING), status: getStatusTagStatus(EXECUTION_STATUS.RUNNING) },
        [EXECUTION_STATUS.PAUSED]: { text: getStatusText(EXECUTION_STATUS.PAUSED), status: getStatusTagStatus(EXECUTION_STATUS.PAUSED) },
        [EXECUTION_STATUS.STOPPED]: { text: getStatusText(EXECUTION_STATUS.STOPPED), status: getStatusTagStatus(EXECUTION_STATUS.STOPPED) },
        [EXECUTION_STATUS.COMPLETED]: { text: getStatusText(EXECUTION_STATUS.COMPLETED), status: getStatusTagStatus(EXECUTION_STATUS.COMPLETED) },
        [EXECUTION_STATUS.SUCCESS]: { text: getStatusText(EXECUTION_STATUS.SUCCESS), status: getStatusTagStatus(EXECUTION_STATUS.SUCCESS) },
        [EXECUTION_STATUS.FAILED]: { text: getStatusText(EXECUTION_STATUS.FAILED), status: getStatusTagStatus(EXECUTION_STATUS.FAILED) },
        [EXECUTION_STATUS.CANCELLED]: { text: getStatusText(EXECUTION_STATUS.CANCELLED), status: getStatusTagStatus(EXECUTION_STATUS.CANCELLED) },
      },
    },
    {
      title: '批次号',
      dataIndex: 'batchNo',
      width: 180,
      ellipsis: true,
      search: true,
      render: (text, record) => (
        <a
          onClick={() => {
            setCurrentBatchNo(record.batchNo || '');
            setBatchDetailVisible(true);
          }}
          style={{ cursor: 'pointer' }}
        >
          {text || '-'}
        </a>
      ),
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 160,
      search: {
        transform: (value) => {
          // 处理时间范围搜索
          if (Array.isArray(value) && value.length === 2) {
            return {
              startTime: value[0]?.format?.('YYYY-MM-DD HH:mm:ss') || value[0],
              endTime: value[1]?.format?.('YYYY-MM-DD HH:mm:ss') || value[1],
            };
          }
          return {};
        },
      },
      valueType: 'dateTimeRange',
      fieldProps: {
        format: 'YYYY-MM-DD HH:mm:ss',
        showTime: true,
        placeholder: ['开始时间', '结束时间'],
        allowClear: true,
        onChange: (dates: any, dateStrings: string[]) => {
          // 手动触发搜索
          if (actionRef.current) {
            actionRef.current.reload();
          }
        },
      },
      render: (text, record) => {
        // 直接使用record中的startTime，避免text参数问题
        if (record && record.startTime) {
          return formatDateTime(record.startTime);
        }
        return '-';
      },
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      width: 160,
      search: false,
      render: (text) => {
        // 如果text是字符串，直接返回
        if (typeof text === 'string') {
          return formatDateTime(text);
        }
        
        // 如果text是null或undefined，返回'-'
        if (!text) {
          return '-';
        }
        
        // 其他情况，尝试转换为字符串
        return String(text);
      },
    },
    {
      title: '错误信息',
      dataIndex: 'errorMessage',
      ellipsis: true,
      width: 200,
      search: false,
      render: (text) => text || '-',
    },
    {
      title: '执行时长(秒)',
      dataIndex: 'duration',
      width: 120,
      search: false,
      render: (text) => {
        // 确保传入的是有效数字
        if (text === null || text === undefined || isNaN(Number(text)) || !isFinite(Number(text))) {
          return '-';
        }
        return formatDuration(Number(text));
      },
    },
    {
      title: '通知状态',
      dataIndex: 'notifyStatus',
      width: 100,
      render: (_, record) => getNotifyStatusTag(record.notifyStatus),
      valueType: 'select',
      valueEnum: {
        'SENT': { text: '已发送', status: 'Success' },
        'PENDING': { text: '待发送', status: 'Warning' },
        'FAILED': { text: '发送失败', status: 'Error' },
      },
    },
    {
      title: '执行器地址',
      dataIndex: 'executorAddress',
      width: 150,
      ellipsis: true,
      search: true,
      render: (text) => text || '-',
    },
    {
      title: '重试次数',
      dataIndex: 'retryCount',
      width: 100,
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 120,
      render: (_, record) => getActionButtons(record),
    },
  ];

  const handleBatchClear = async () => {
    if (selectedRows.length === 0) {
      message.warning('请选择要清除的日志');
      return;
    }

    Modal.confirm({
      title: '批量清除',
      content: `确定要清除选中的 ${selectedRows.length} 条日志吗？`,
      onOk: async () => {
        try {
          await Promise.all(
            selectedRows.map((row) => clearJobExecutionLog(row.logId))
          );
          message.success('批量清除成功');
          setSelectedRows([]);
          actionRef.current?.reload();
        } catch (error) {
          message.error('批量清除失败');
        }
      },
    });
  };

  useEffect(() => {
    actionRef.current?.reload();
  }, []);

  return (
    <PageContainer>
      <ProTable<API.JobExecutionLog>
        headerTitle="执行日志"
        actionRef={actionRef}
        rowKey="logId"
        manualRequest={false}
        revalidateOnFocus={false}
        debounceTime={500}
        search={{
          labelWidth: 120,
          defaultCollapsed: true,
          collapsed: searchCollapsed,
          span: 8,
          onCollapse: (collapsed) => {
            setSearchCollapsed(collapsed);
          },
          collapseRender: (collapsed) => (collapsed ? '展开搜索' : '收起搜索'),
        }}
        toolBarRender={() => [
          <Tooltip key="pause-resume" title={selectedRows.some(row => getAvailableActions(row.status).includes('resume')) ? '恢复' : '暂停'}>
            <Button
              icon={selectedRows.some(row => getAvailableActions(row.status).includes('resume')) ? <PlayCircleOutlined /> : <PauseCircleOutlined />}
              onClick={() => {
                const hasResumableTasks = selectedRows.some(row => getAvailableActions(row.status).includes('resume'));
                const hasPausableTasks = selectedRows.some(row => getAvailableActions(row.status).includes('pause'));
                
                if (hasResumableTasks && hasPausableTasks) {
                  message.warning('请选择状态相同的任务进行批量操作');
                  return;
                }
                
                if (hasResumableTasks) {
                  handleBatchOperation('resume');
                } else if (hasPausableTasks) {
                  handleBatchOperation('pause');
                } else {
                  message.warning('选中的任务不支持暂停/恢复操作');
                }
              }}
              disabled={selectedRows.length === 0 || !selectedRows.some(row => 
                getAvailableActions(row.status).includes('pause') || getAvailableActions(row.status).includes('resume')
              )}
            />
          </Tooltip>,
          <Tooltip key="stop" title="停止">
            <Button
              icon={<StopOutlined />}
              onClick={() => handleBatchOperation('stop')}
              disabled={selectedRows.length === 0 || !selectedRows.some(row => 
                getAvailableActions(row.status).includes('stop')
              )}
            />
          </Tooltip>,
          <Tooltip key="cancel" title="取消">
            <Button
              icon={<CloseCircleOutlined />}
              onClick={() => handleBatchOperation('cancel')}
              disabled={selectedRows.length === 0 || !selectedRows.some(row => 
                getAvailableActions(row.status).includes('cancel')
              )}
            />
          </Tooltip>,
          <Button
            key="clear"
            danger
            onClick={handleBatchClear}
            disabled={selectedRows.length === 0}
          >
            批量清除
          </Button>,
        ]}
        request={async (params) => {
          try {
            // 构建请求参数
            const requestParams = { ...params };
            
            // 处理ProTable的排序参数
            if (params.sorter) {
              const { field, order } = params.sorter;
              if (field && order) {
                requestParams.orderBy = field;
                requestParams.orderDirection = order === 'descend' ? 'desc' : 'asc';
              }
            }
            
            // 如果没有排序参数，默认按logId降序排列
            if (!requestParams.orderBy && !requestParams.orderDirection) {
              requestParams.orderBy = 'logId';
              requestParams.orderDirection = 'desc';
            }
            
            // 过滤掉空值参数
            Object.keys(requestParams).forEach(key => {
              if (requestParams[key] === '' || requestParams[key] === null || requestParams[key] === undefined) {
                delete requestParams[key];
              }
            });
            
            const response = await getJobExecutionLogList(requestParams);
            
            // 处理后端ApiResponse格式
            if (response && response.success) {
              // 标准ApiResponse格式
              if (response.data && response.data.list) {
                return {
                  data: response.data.list,
                  total: response.data.total || 0,
                  success: true,
                };
              }
              // 直接返回数据的情况
              if (response.data && Array.isArray(response.data)) {
                return {
                  data: response.data,
                  total: response.data.length,
                  success: true,
                };
              }
            }
            // 兼容其他格式
            if (response && response.list) {
              return {
                data: response.list,
                total: response.total || 0,
                success: true,
              };
            }
            if (Array.isArray(response)) {
              return {
                data: response,
                total: response.length,
                success: true,
              };
            }
            return {
              data: [],
              total: 0,
              success: false,
            };
          } catch (error) {
            console.error('获取执行日志列表失败:', error);
            return {
              data: [],
              total: 0,
              success: false,
            };
          }
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />

      {selectedRows.length > 0 && (
        <FooterToolbar>
          <Space>
            <Tooltip title={selectedRows.some(row => getAvailableActions(row.status).includes('resume')) ? '批量恢复' : '批量暂停'}>
              <Button 
                icon={selectedRows.some(row => getAvailableActions(row.status).includes('resume')) ? <PlayCircleOutlined /> : <PauseCircleOutlined />}
                onClick={() => {
                  const hasResumableTasks = selectedRows.some(row => getAvailableActions(row.status).includes('resume'));
                  const hasPausableTasks = selectedRows.some(row => getAvailableActions(row.status).includes('pause'));
                  
                  if (hasResumableTasks && hasPausableTasks) {
                    message.warning('请选择状态相同的任务进行批量操作');
                    return;
                  }
                  
                  if (hasResumableTasks) {
                    handleBatchOperation('resume');
                  } else if (hasPausableTasks) {
                    handleBatchOperation('pause');
                  } else {
                    message.warning('选中的任务不支持暂停/恢复操作');
                  }
                }}
                disabled={!selectedRows.some(row => 
                  getAvailableActions(row.status).includes('pause') || getAvailableActions(row.status).includes('resume')
                )}
              />
            </Tooltip>
            <Tooltip title="批量停止">
              <Button 
                icon={<StopOutlined />}
                onClick={() => handleBatchOperation('stop')}
                disabled={!selectedRows.some(row => getAvailableActions(row.status).includes('stop'))}
              />
            </Tooltip>
            <Tooltip title="批量取消">
              <Button 
                icon={<CloseCircleOutlined />}
                onClick={() => handleBatchOperation('cancel')}
                disabled={!selectedRows.some(row => getAvailableActions(row.status).includes('cancel'))}
              />
            </Tooltip>
            <Button onClick={handleBatchClear} danger>
              批量清除
            </Button>
          </Space>
        </FooterToolbar>
      )}

             <Drawer
         title="日志详情"
         width={600}
         open={detailVisible}
         onClose={() => {
           setDetailVisible(false);
           setCurrentLog(undefined);
         }}
       >
         {currentLog && <LogDetail log={currentLog} />}
       </Drawer>

       <Drawer
         title="批次详情"
         width={800}
         open={batchDetailVisible}
         onClose={() => {
           setBatchDetailVisible(false);
           setCurrentBatchNo('');
         }}
       >
         {currentBatchNo && <BatchDetail batchNo={currentBatchNo} onClose={() => setBatchDetailVisible(false)} />}
       </Drawer>
    </PageContainer>
  );
};

export default JobLogList; 