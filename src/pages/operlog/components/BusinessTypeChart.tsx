import React, { useEffect, useState, useRef } from 'react';
import { Card, Spin, Empty } from 'antd';
import * as echarts from 'echarts';
import { getOperLogList } from '@/services/operlog/api';
import { getBusinessTypeText, getBusinessTypeColor } from '../utils';

interface BusinessTypeData {
  type: string;
  value: number;
  color: string;
}

interface BusinessTypeChartProps {
  timeRange?: [string, string];
}

const BusinessTypeChart: React.FC<BusinessTypeChartProps> = ({ timeRange }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<BusinessTypeData[]>([]);
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  const fetchData = async () => {
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
        // 统计业务类型分布
        const typeCount: Record<number, number> = {};
        response.data.records.forEach((log: any) => {
          const type = log.businessType;
          typeCount[type] = (typeCount[type] || 0) + 1;
        });

        // 转换为图表数据格式
        const chartData: BusinessTypeData[] = Object.entries(typeCount).map(([type, count]) => ({
          type: getBusinessTypeText(Number(type)),
          value: count,
          color: getBusinessTypeColor(Number(type)),
        }));

        // 按数量排序，只显示前10个
        chartData.sort((a, b) => b.value - a.value);
        setData(chartData.slice(0, 10));
      }
    } catch (error) {
      console.error('获取业务类型统计失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  useEffect(() => {
    if (chartRef.current && data.length > 0) {
      // 销毁之前的图表实例
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }

      // 创建新的图表实例
      chartInstance.current = echarts.init(chartRef.current);
      
      const option = {
        title: {
          text: '业务类型分布',
          left: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold',
          },
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          top: 'middle',
        },
        series: [
          {
            name: '操作次数',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['60%', '50%'],
            data: data.map(item => ({
              name: item.type,
              value: item.value,
              itemStyle: {
                color: item.color,
              },
            })),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
            label: {
              show: true,
              formatter: '{b}: {c}',
            },
          },
        ],
      };

      chartInstance.current.setOption(option);
    }

    // 清理函数
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
    };
  }, [data]);

  // 监听窗口大小变化，调整图表大小
  useEffect(() => {
    const handleResize = () => {
      if (chartInstance.current) {
        chartInstance.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) {
    return (
      <Card title="业务类型分布" style={{ marginBottom: '24px' }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card title="业务类型分布" style={{ marginBottom: '24px' }}>
        <Empty description="暂无数据" />
      </Card>
    );
  }

  return (
    <Card title="业务类型分布" style={{ marginBottom: '24px' }}>
      <div ref={chartRef} style={{ height: '400px', width: '100%' }} />
    </Card>
  );
};

export default BusinessTypeChart;
