import React, { useEffect, useState, useRef } from 'react';
import { Card, Spin, Empty, Select, Row, Col, Statistic } from 'antd';
import * as echarts from 'echarts';
import { getOperLogList } from '@/services/operlog/api';
import { getBusinessTypeText, getBusinessTypeColor } from '../utils';

const { Option } = Select;

interface BusinessTypeComparisonProps {
  timeRange?: [string, string];
}

const BusinessTypeComparison: React.FC<BusinessTypeComparisonProps> = ({ timeRange }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>({});
  const [selectedTypes, setSelectedTypes] = useState<number[]>([4, 6, 7, 8, 9, 21]);
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params: any = {
        current: 1,
        size: 1000,
      };

      if (timeRange && timeRange.length === 2) {
        params.startTime = timeRange[0];
        params.endTime = timeRange[1];
      }

      const response = await getOperLogList(params);
      if (response.success && response.data?.records) {
        // 统计业务类型性能指标
        const typeStats: Record<number, any> = {};
        
        response.data.records.forEach((log: any) => {
          const type = log.businessType;
          if (!typeStats[type]) {
            typeStats[type] = {
              count: 0,
              successCount: 0,
              failureCount: 0,
              totalCostTime: 0,
              costTimes: [],
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
            typeStats[type].costTimes.push(log.costTime);
          }
        });

        // 计算性能指标
        const performanceData = Object.entries(typeStats).map(([type, stats]) => {
          const businessType = Number(type);
          const costTimes = stats.costTimes.sort((a: number, b: number) => a - b);
          const p95Index = Math.floor(costTimes.length * 0.95);
          
          return {
            businessType,
            typeName: getBusinessTypeText(businessType),
            count: stats.count,
            successRate: stats.count > 0 ? (stats.successCount / stats.count) * 100 : 0,
            avgCostTime: stats.count > 0 ? stats.totalCostTime / stats.count : 0,
            p95CostTime: costTimes.length > 0 ? costTimes[p95Index] : 0,
            maxCostTime: costTimes.length > 0 ? Math.max(...costTimes) : 0,
            minCostTime: costTimes.length > 0 ? Math.min(...costTimes) : 0,
            color: getBusinessTypeColor(businessType),
          };
        });

        setData({ performanceData, typeStats });
      }
    } catch (error) {
      console.error('获取业务类型对比失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  useEffect(() => {
    if (chartRef.current && data.performanceData) {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }

      chartInstance.current = echarts.init(chartRef.current);
      
      const filteredData = data.performanceData.filter((item: any) => 
        selectedTypes.includes(item.businessType)
      );

      const option = {
        title: {
          text: '业务类型性能对比',
          left: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold',
          },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {
          data: ['平均耗时', 'P95耗时', '最大耗时'],
          bottom: 10,
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: filteredData.map((item: any) => item.typeName),
          axisLabel: {
            rotate: 45,
            fontSize: 10,
          },
        },
        yAxis: {
          type: 'value',
          name: '耗时(ms)',
        },
        series: [
          {
            name: '平均耗时',
            type: 'bar',
            data: filteredData.map((item: any) => ({
              value: Math.round(item.avgCostTime),
              itemStyle: { color: item.color },
            })),
          },
          {
            name: 'P95耗时',
            type: 'bar',
            data: filteredData.map((item: any) => ({
              value: Math.round(item.p95CostTime),
              itemStyle: { color: item.color, opacity: 0.7 },
            })),
          },
          {
            name: '最大耗时',
            type: 'bar',
            data: filteredData.map((item: any) => ({
              value: Math.round(item.maxCostTime),
              itemStyle: { color: item.color, opacity: 0.5 },
            })),
          },
        ],
      };

      chartInstance.current.setOption(option);
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
    };
  }, [data, selectedTypes]);

  useEffect(() => {
    const handleResize = () => {
      if (chartInstance.current) {
        chartInstance.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTypeChange = (values: number[]) => {
    setSelectedTypes(values);
  };

  if (loading) {
    return (
      <Card title="业务类型性能对比" style={{ marginBottom: '24px' }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  if (!data.performanceData || data.performanceData.length === 0) {
    return (
      <Card title="业务类型性能对比" style={{ marginBottom: '24px' }}>
        <Empty description="暂无数据" />
      </Card>
    );
  }

  const filteredData = data.performanceData.filter((item: any) => 
    selectedTypes.includes(item.businessType)
  );

  return (
    <Card title="业务类型性能对比" style={{ marginBottom: '24px' }}>
      <div style={{ fontSize: '12px', color: '#666', textAlign: 'center', marginBottom: '16px' }}>
        业务类型性能指标对比分析
      </div>
    </Card>
  );
};

export default BusinessTypeComparison;
