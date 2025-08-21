import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import { Button, message, Modal, Space, Tag, Tooltip } from 'antd';
import { 
  PlusOutlined, 
  PlayCircleOutlined, 
  DeleteOutlined 
} from '@ant-design/icons';
import React, { useRef, useState } from 'react';
import { 
  getJobList, 
  deleteJob, 
  startJob
} from '@/services/job/api';
import CreateJobModal from './components/CreateJobModal';

const JobList: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const [selectedRows, setSelectedRows] = useState<API.JobDef[]>([]);
  const [createModalVisible, setCreateModalVisible] = useState(false);

  // 任务状态标签
  const getStatusTag = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Tag color="success">激活</Tag>;
      case 'INACTIVE':
        return <Tag color="default">停用</Tag>;
      case 'PAUSED':
        return <Tag color="warning">暂停</Tag>;
      case 'RUNNING':
        return <Tag color="processing">运行中</Tag>;
      case 'STOPPED':
        return <Tag color="error">已停止</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  // 任务类型标签
  const getJobTypeTag = (type: string) => {
    switch (type) {
      case 'PROCEDURE':
        return <Tag color="blue">存储过程</Tag>;
      case 'SCRIPT':
        return <Tag color="green">脚本</Tag>;
      case 'HTTP':
        return <Tag color="orange">HTTP</Tag>;
      default:
        return <Tag color="default">{type}</Tag>;
    }
  };

  // 依赖状态标签
  const getDependTag = (isDepend: boolean) => {
    return isDepend ? <Tag color="red">有依赖</Tag> : <Tag color="green">无依赖</Tag>;
  };

  // 激活状态标签
  const getActiveTag = (isActive: boolean) => {
    return isActive ? <Tag color="success">激活</Tag> : <Tag color="default">停用</Tag>;
  };

  // 获取操作按钮
  const getActionButtons = (record: API.JobDef) => {
    const buttons = [];

    // 启动按钮
    if (record.status === 'INACTIVE') {
      buttons.push(
        <a
          key="start"
          onClick={async () => {
            try {
              await startJob(record.jobId);
              message.success('启动成功');
              actionRef.current?.reload();
            } catch (error) {
              message.error('启动失败');
            }
          }}
        >
          启动
        </a>
      );
    }

    // 删除按钮
    buttons.push(
      <a
        key="delete"
        onClick={() => {
          Modal.confirm({
            title: '确认删除',
            content: `确定要删除任务 "${record.jobName}" 吗？`,
            onOk: async () => {
              try {
                await deleteJob(record.jobId);
                message.success('删除成功');
                actionRef.current?.reload();
              } catch (error) {
                message.error('删除失败');
              }
            },
          });
        }}
      >
        删除
      </a>
    );

    return buttons;
  };

  const columns: ProColumns<API.JobDef>[] = [
    {
      title: 'ID',
      dataIndex: 'jobId',
      width: 80,
      search: false,
    },
    {
      title: '作业代码',
      dataIndex: 'jobCode',
      width: 150,
      ellipsis: true,
    },
    {
      title: '作业名称',
      dataIndex: 'jobName',
      width: 200,
      ellipsis: true,
    },
    {
      title: '作业分组',
      dataIndex: 'jobGroup',
      width: 120,
    },
    {
      title: '存储过程',
      dataIndex: 'procName',
      width: 150,
      ellipsis: true,
      search: false,
    },
    {
      title: '任务类型',
      dataIndex: 'jobType',
      width: 120,
      render: (_, record) => getJobTypeTag(record.jobType || ''),
      valueType: 'select',
      valueEnum: {
        'PROCEDURE': { text: '存储过程', status: 'Processing' },
        'SCRIPT': { text: '脚本', status: 'Default' },
        'HTTP': { text: 'HTTP', status: 'Warning' },
      },
    },
    {
      title: '调度时间',
      dataIndex: 'scheduleTime',
      width: 100,
      search: false,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (_, record) => getStatusTag(record.status),
      valueType: 'select',
      valueEnum: {
        'ACTIVE': { text: '激活', status: 'Success' },
        'INACTIVE': { text: '停用', status: 'Default' },
        'PAUSED': { text: '暂停', status: 'Warning' },
        'RUNNING': { text: '运行中', status: 'Processing' },
        'STOPPED': { text: '已停止', status: 'Error' },
      },
    },
    {
      title: '依赖状态',
      dataIndex: 'isDepend',
      width: 100,
      render: (_, record) => getDependTag(record.isDepend),
      search: false,
    },
    {
      title: '激活状态',
      dataIndex: 'isActive',
      width: 100,
      render: (_, record) => getActiveTag(record.isActive),
      search: false,
    },
    {
      title: '超时时间(秒)',
      dataIndex: 'timeoutSec',
      width: 120,
      search: false,
    },
    {
      title: '重试次数',
      dataIndex: 'retryCount',
      width: 100,
      search: false,
    },
    {
      title: '最后运行时间',
      dataIndex: 'lastRunTime',
      width: 160,
      search: false,
      render: (text) => text || '-',
    },
    {
      title: '下次运行时间',
      dataIndex: 'nextRunTime',
      width: 160,
      search: false,
      render: (text) => text || '-',
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (_, record) => getActionButtons(record),
    },
  ];

  const handleBatchOperation = async (operation: string) => {
    if (selectedRows.length === 0) {
      message.warning('请选择要操作的任务');
      return;
    }

    const operationMap: { [key: string]: { api: Function; successMsg: string; errorMsg: string } } = {
      start: { api: startJob, successMsg: '批量启动成功', errorMsg: '批量启动失败' },
      delete: { api: deleteJob, successMsg: '批量删除成功', errorMsg: '批量删除失败' },
    };

    const { api, successMsg, errorMsg } = operationMap[operation];

    try {
      await Promise.all(selectedRows.map((row) => api(row.jobId)));
      message.success(successMsg);
      setSelectedRows([]);
      actionRef.current?.reload();
    } catch (error) {
      message.error(errorMsg);
    }
  };

  return (
    <PageContainer>
      <ProTable<API.JobDef>
        headerTitle="任务管理"
        actionRef={actionRef}
        rowKey="jobId"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="add"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
          >
            新增任务
          </Button>,
          <Tooltip title="启动任务" key="start">
            <Button
              icon={<PlayCircleOutlined />}
              onClick={() => {
                if (selectedRows.length === 0) {
                  message.warning('请选择要启动的任务');
                  return;
                }
                handleBatchOperation('start');
              }}
            />
          </Tooltip>,
          <Tooltip title="删除任务" key="delete">
            <Button
              icon={<DeleteOutlined />}
              danger
              onClick={() => {
                if (selectedRows.length === 0) {
                  message.warning('请选择要删除的任务');
                  return;
                }
                Modal.confirm({
                  title: '确认删除',
                  content: `确定要删除选中的 ${selectedRows.length} 个任务吗？`,
                  onOk: async () => {
                    try {
                      await Promise.all(selectedRows.map((row) => deleteJob(row.jobId)));
                      message.success('批量删除成功');
                      setSelectedRows([]);
                      actionRef.current?.reload();
                    } catch (error) {
                      message.error('批量删除失败');
                    }
                  },
                });
              }}
            />
          </Tooltip>,
        ]}
        request={async (params) => {
          try {
            const response = await getJobList(params);
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
            console.error('获取任务列表失败:', error);
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
        <FooterToolbar
          extra={
            <div>
              已选择 <a style={{ fontWeight: 600 }}>{selectedRows.length}</a> 项
            </div>
          }
        >
          <Space>
            <Button onClick={() => handleBatchOperation('start')}>
              批量启动
            </Button>
            <Button onClick={() => handleBatchOperation('delete')} danger>
              批量删除
            </Button>
          </Space>
        </FooterToolbar>
      )}

      <CreateJobModal
        visible={createModalVisible}
        onVisibleChange={setCreateModalVisible}
        onSuccess={() => {
          setCreateModalVisible(false);
          actionRef.current?.reload();
        }}
      />
    </PageContainer>
  );
};

export default JobList; 