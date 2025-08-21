import React, { useEffect, useState } from 'react';
import { Card, Table, Tag, Spin, Empty } from 'antd';
import { getOperLogList } from '@/services/operlog/api';
import { getBusinessTypeText, getBusinessTypeColor } from '../utils';

interface BusinessTypeStat {
  businessType: number;
  typeName: string;
  count: number;
  successCount: number;
  failureCount: number;
  successRate: number;
  avgCostTime: number;
  color: string;
}

interface BusinessTypeStatsProps {
  timeRange?: [string, string];
}

const BusinessTypeStats: React.FC<BusinessTypeStatsProps> = ({ timeRange }) => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<BusinessTypeStat[]>([]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const params: any = {
        current: 1,
        size: 1000, // 获取足够的数据来统计
      };

      if (timeRange && timeRange.length === 2) {
        params.startTime = timeRange[0];
        params.endTime = timeRange[1];
      }

      const response = await getOperLogList(params);
      if (response.success && response.data?.records) {
        // 统计业务类型详细信息
        const typeStats: Record<number, any> = {};
        
        response.data.records.forEach((log: any) => {
          const type = log.businessType;
          if (!typeStats[type]) {
            typeStats[type] = {
              count: 0,
              successCount: 0,
              failureCount: 0,
              totalCostTime: 0,
            };
          }
          
          typeStats[type].count++;
          if (log.status === 0) {
            typeStats[type].successCount++;
          } else {
            typeStats[type].failureCount++;
          }
          
          if (log.costTime) {
            typeStats[type].totalCostTime += log.costTime;
          }
        });

        // 转换为表格数据格式
        const tableData: BusinessTypeStat[] = Object.entries(typeStats).map(([type, stat]) => {
          const businessType = Number(type);
          return {
            businessType,
            typeName: getBusinessTypeText(businessType),
            count: stat.count,
            successCount: stat.successCount,
            failureCount: stat.failureCount,
            successRate: stat.count > 0 ? Math.round((stat.successCount / stat.count) * 100) : 0,
            avgCostTime: stat.count > 0 ? Math.round(stat.totalCostTime / stat.count) : 0,
            color: getBusinessTypeColor(businessType),
          };
        });

        // 按操作次数排序
        tableData.sort((a, b) => b.count - a.count);
        setStats(tableData);
      }
    } catch (error) {
      console.error('获取业务类型统计失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [timeRange]);

  const columns = [
    {
      title: '业务类型',
      dataIndex: 'typeName',
      key: 'typeName',
      width: 200,
      render: (text: string, record: BusinessTypeStat) => (
        <Tag color={record.color}>{text}</Tag>
      ),
    },
    {
      title: '总操作数',
      dataIndex: 'count',
      key: 'count',
      width: 100,
      sorter: (a: BusinessTypeStat, b: BusinessTypeStat) => a.count - b.count,
    },
    {
      title: '成功次数',
      dataIndex: 'successCount',
      key: 'successCount',
      width: 100,
      render: (value: number) => (
        <Tag color="success">{value}</Tag>
      ),
    },
    {
      title: '失败次数',
      dataIndex: 'failureCount',
      key: 'failureCount',
      width: 100,
      render: (value: number) => (
        <Tag color="error">{value}</Tag>
      ),
    },
    {
      title: '成功率',
      dataIndex: 'successRate',
      key: 'successRate',
      width: 100,
      render: (value: number) => (
        <Tag color={value >= 90 ? 'success' : value >= 70 ? 'warning' : 'error'}>
          {value}%
        </Tag>
      ),
      sorter: (a: BusinessTypeStat, b: BusinessTypeStat) => a.successRate - b.successRate,
    },
    {
      title: '平均耗时(ms)',
      dataIndex: 'avgCostTime',
      key: 'avgCostTime',
      width: 120,
      render: (value: number) => value || '-',
      sorter: (a: BusinessTypeStat, b: BusinessTypeStat) => a.avgCostTime - b.avgCostTime,
    },
  ];

  if (loading) {
    return (
      <Card title="业务类型详细统计" style={{ marginBottom: '24px' }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  if (stats.length === 0) {
    return (
      <Card title="业务类型详细统计" style={{ marginBottom: '24px' }}>
        <Empty description="暂无数据" />
      </Card>
    );
  }

  return (
    <Card title="业务类型详细统计" style={{ marginBottom: '24px' }}>
      <Table
        columns={columns}
        dataSource={stats}
        rowKey="businessType"
        pagination={false}
        size="small"
        scroll={{ x: 800 }}
      />
    </Card>
  );
};

export default BusinessTypeStats;
