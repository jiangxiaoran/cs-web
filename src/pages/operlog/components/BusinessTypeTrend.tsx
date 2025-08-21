import React, { useEffect, useState, useRef } from 'react';
import { Card, Spin, Empty, Select } from 'antd';
import * as echarts from 'echarts';
import { getOperLogList } from '@/services/operlog/api';
import { getBusinessTypeText, getBusinessTypeColor } from '../utils';

const { Option } = Select;

interface BusinessTypeTrendProps {
  timeRange?: [string, string];
}

const BusinessTypeTrend: React.FC<BusinessTypeTrendProps> = ({ timeRange }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<number[]>([4, 6, 7, 8, 9, 21]); // 默认显示主要业务类型
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
        // 按小时分组统计业务类型
        const hourlyStats: Record<string, Record<number, number>> = {};
        
        response.data.records.forEach((log: any) => {
          const time = new Date(log.operTime);
          const hourKey = `${time.getFullYear()}-${String(time.getMonth() + 1).padStart(2, '0')}-${String(time.getDate()).padStart(2, '0')} ${String(time.getHours()).padStart(2, '0')}:00`;
          const businessType = log.businessType;
          
          if (!hourlyStats[hourKey]) {
            hourlyStats[hourKey] = {};
          }
          
          hourlyStats[hourKey][businessType] = (hourlyStats[hourKey][businessType] || 0) + 1;
        });

        // 转换为图表数据格式
        const timeKeys = Object.keys(hourlyStats).sort();
        const chartData = timeKeys.map(timeKey => {
          const dataPoint: any = { time: timeKey };
          selectedTypes.forEach(type => {
            dataPoint[`type_${type}`] = hourlyStats[timeKey][type] || 0;
          });
          return dataPoint;
        });

        setData(chartData);
      }
    } catch (error) {
      console.error('获取业务类型趋势失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeRange, selectedTypes]);

  useEffect(() => {
    if (chartRef.current && data.length > 0) {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }

      chartInstance.current = echarts.init(chartRef.current);
      
      const series = selectedTypes.map(type => ({
        name: getBusinessTypeText(type),
        type: 'line',
        data: data.map(item => item[`type_${type}`]),
        smooth: true,
        lineStyle: {
          color: getBusinessTypeColor(type),
        },
        itemStyle: {
          color: getBusinessTypeColor(type),
        },
      }));

      const option = {
        title: {
          text: '业务类型趋势',
          left: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold',
          },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
          },
        },
        legend: {
          data: selectedTypes.map(type => getBusinessTypeText(type)),
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
          boundaryGap: false,
          data: data.map(item => item.time),
          axisLabel: {
            rotate: 45,
          },
        },
        yAxis: {
          type: 'value',
          name: '操作次数',
        },
        series,
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
      <Card title="业务类型趋势" style={{ marginBottom: '24px' }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card title="业务类型趋势" style={{ marginBottom: '24px' }}>
        <Empty description="暂无数据" />
      </Card>
    );
  }

  return (
    <Card title="业务类型趋势" style={{ marginBottom: '24px' }}>
      <div style={{ marginBottom: '16px' }}>
        <span style={{ marginRight: '8px' }}>选择业务类型：</span>
        <Select
          mode="multiple"
          style={{ width: '400px' }}
          placeholder="请选择要显示的业务类型"
          value={selectedTypes}
          onChange={handleTypeChange}
          maxTagCount={5}
        >
          <Option value={0}>其它/查询</Option>
          <Option value={4}>执行/运行任务</Option>
          <Option value={6}>暂停任务</Option>
          <Option value={7}>恢复任务</Option>
          <Option value={8}>停止任务</Option>
          <Option value={9}>取消任务</Option>
          <Option value={21}>用户登录</Option>
          <Option value={16}>导出数据</Option>
          <Option value={20}>清理数据</Option>
        </Select>
      </div>
      <div ref={chartRef} style={{ height: '400px', width: '100%' }} />
    </Card>
  );
};

export default BusinessTypeTrend;
