import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Form,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
  Tag,
  Tooltip,
  Popconfirm,
  message,
  Statistic,
  Divider,
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  DeleteOutlined,
  ClearOutlined,
  EyeOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { getOperLogList, deleteOperLog, clearOperLog, getOperLogStatistics } from '@/services/operlog/api';
import type { OperLogItem, OperLogParams, OperLogStatistics } from '@/types/operlog.d';
import { formatDateTime, getBusinessTypeText, getStatusText, getStatusColor, getBusinessTypeOptions, getGroupedBusinessTypeOptions, getBusinessTypeColor } from './utils';
import OperLogDetail from './components/OperLogDetail';

const { RangePicker } = DatePicker;
const { Option } = Select;

const OperLogPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [operLogList, setOperLogList] = useState<OperLogItem[]>([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statistics, setStatistics] = useState<OperLogStatistics | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentOperLog, setCurrentOperLog] = useState<OperLogItem | null>(null);

  // 获取操作日志列表
  const fetchOperLogList = async (params: OperLogParams = {}) => {
    setLoading(true);
    try {
      const response = await getOperLogList({
        current: params.current || current,
        size: params.size || pageSize,
        ...params,
      });
      
      if (response.success) {
        setOperLogList(response.data.records || []);
        setTotal(response.data.total || 0);
        if (params.current) setCurrent(params.current);
        if (params.size) setPageSize(params.size);
      } else {
        message.error(response.message || '获取操作日志失败');
      }
    } catch (error) {
      console.error('获取操作日志失败:', error);
      message.error('获取操作日志失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取统计信息
  const fetchStatistics = async () => {
    try {
      const response = await getOperLogStatistics();
      if (response.success) {
        setStatistics(response.data);
      }
    } catch (error) {
      console.error('获取统计信息失败:', error);
    }
  };

  // 搜索
  const handleSearch = async () => {
    const values = await form.validateFields();
    const params: OperLogParams = {};
    
    if (values.title) params.title = values.title;
    if (values.businessType !== undefined) params.businessType = values.businessType;
    if (values.operName) params.operName = values.operName;
    if (values.status !== undefined) params.status = values.status;
    
    await fetchOperLogList(params);
  };

  // 重置
  const handleReset = () => {
    form.resetFields();
    fetchOperLogList({ current: 1 });
  };

  // 刷新
  const handleRefresh = () => {
    fetchOperLogList();
    fetchStatistics();
  };

  // 删除操作日志
  const handleDelete = async (operId: number) => {
    try {
      const response = await deleteOperLog(operId);
      if (response.success) {
        message.success('删除成功');
        fetchOperLogList();
        fetchStatistics();
      } else {
        message.error(response.message || '删除失败');
      }
    } catch (error) {
      console.error('删除失败:', error);
      message.error('删除失败');
    }
  };

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的操作日志');
      return;
    }

    try {
      // 这里需要后端支持批量删除，暂时逐个删除
      for (const operId of selectedRowKeys) {
        await deleteOperLog(Number(operId));
      }
      message.success('批量删除成功');
      setSelectedRowKeys([]);
      fetchOperLogList();
      fetchStatistics();
    } catch (error) {
      console.error('批量删除失败:', error);
      message.error('批量删除失败');
    }
  };

  // 清空所有操作日志
  const handleClearAll = async () => {
    try {
      const response = await clearOperLog();
      if (response.success) {
        message.success('清空成功');
        setSelectedRowKeys([]);
        fetchOperLogList();
        fetchStatistics();
      } else {
        message.error(response.message || '清空失败');
      }
    } catch (error) {
      console.error('清空失败:', error);
      message.error('清空失败');
    }
  };

  // 分页变化
  const handleTableChange = (page: number, size: number) => {
    fetchOperLogList({ current: page, size });
  };

  // 查看详情
  const handleViewDetail = (record: OperLogItem) => {
    setCurrentOperLog(record);
    setDetailVisible(true);
  };

  // 表格列定义
  const columns: ColumnsType<OperLogItem> = [
    {
      title: '操作标题',
      dataIndex: 'title',
      key: 'title',
      width: 150,
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: '业务类型',
      dataIndex: 'businessType',
      key: 'businessType',
      width: 100,
      render: (businessType) => (
        <Tag color={getBusinessTypeColor(businessType)}>
          {getBusinessTypeText(businessType)}
        </Tag>
      ),
    },
    {
      title: '操作人员',
      dataIndex: 'operName',
      key: 'operName',
      width: 120,
    },
    {
      title: '操作状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: '请求方法',
      dataIndex: 'method',
      key: 'method',
      width: 200,
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: '请求URL',
      dataIndex: 'operUrl',
      key: 'operUrl',
      width: 200,
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: 'IP地址',
      dataIndex: 'operIp',
      key: 'operIp',
      width: 120,
    },
    {
      title: '操作时间',
      dataIndex: 'operTime',
      key: 'operTime',
      width: 160,
      render: (time) => formatDateTime(time),
      sorter: true,
    },
    {
      title: '耗时(ms)',
      dataIndex: 'costTime',
      key: 'costTime',
      width: 100,
      render: (costTime) => costTime || '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button
              type="link"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>
          <Popconfirm
            title="确定要删除这条操作日志吗？"
            onConfirm={() => handleDelete(record.operId)}
            okText="确定"
            cancelText="取消"
          >
            <Tooltip title="删除">
              <Button
                type="link"
                size="small"
                danger
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 初始化
  useEffect(() => {
    fetchOperLogList();
    fetchStatistics();
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      {/* 统计信息 */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={24}>
          <Col span={6}>
            <Statistic
              title="总操作数"
              value={statistics?.totalCount || 0}
              valueStyle={{ color: '#3f8600' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="成功操作"
              value={statistics?.successCount || 0}
              valueStyle={{ color: '#3f8600' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="失败操作"
              value={statistics?.failureCount || 0}
              valueStyle={{ color: '#cf1322' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="今日操作"
              value={statistics?.todayCount || 0}
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
        </Row>
      </Card>

      {/* 搜索表单 */}
      <Card style={{ marginBottom: '24px' }}>
        <Form
          form={form}
          layout="horizontal"
          onFinish={handleSearch}
        >
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item name="title" label="操作标题">
                <Input placeholder="请输入操作标题" allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="businessType" label="业务类型">
                <Select placeholder="请选择业务类型" allowClear>
                  {getGroupedBusinessTypeOptions().map(group => (
                    <Select.OptGroup key={group.label} label={group.label}>
                      {group.options.map(option => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select.OptGroup>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="operName" label="操作人员">
                <Input placeholder="请输入操作人员" allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="status" label="操作状态">
                <Select placeholder="请选择操作状态" allowClear>
                  <Option value={0}>正常</Option>
                  <Option value={1}>异常</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="timeRange" label="操作时间">
                <RangePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder={['开始时间', '结束时间']}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                    搜索
                  </Button>
                  <Button onClick={handleReset}>重置</Button>
                  <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
                    刷新
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* 操作按钮 */}
      <Card style={{ marginBottom: '24px' }}>
        <Space>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={handleBatchDelete}
            disabled={selectedRowKeys.length === 0}
          >
            批量删除 ({selectedRowKeys.length})
          </Button>
          <Popconfirm
            title="确定要清空所有操作日志吗？此操作不可恢复！"
            icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
            onConfirm={handleClearAll}
            okText="确定"
            cancelText="取消"
          >
            <Button danger icon={<ClearOutlined />}>
              清空所有
            </Button>
          </Popconfirm>
        </Space>
      </Card>

      {/* 数据表格 */}
      <Card>
        <Table
          columns={columns}
          dataSource={operLogList}
          rowKey="operId"
          loading={loading}
          pagination={{
            current,
            pageSize,
            total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条/总共 ${total} 条`,
            onChange: handleTableChange,
            onShowSizeChange: handleTableChange,
          }}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          scroll={{ x: 1200 }}
          size="middle"
        />
      </Card>

      {/* 详情弹窗 */}
      <OperLogDetail
        visible={detailVisible}
        onCancel={() => setDetailVisible(false)}
        operLog={currentOperLog}
      />
    </div>
  );
};

export default OperLogPage;