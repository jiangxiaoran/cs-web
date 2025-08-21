import React, { useEffect, useState, useRef } from 'react';
import { Card, Spin, Empty } from 'antd';
import * as echarts from 'echarts';
import { getOperLogList } from '@/services/operlog/api';
import { getBusinessTypeText, getBusinessTypeColor } from '../utils';

interface BusinessTypeHeatmapProps {
  timeRange?: [string, string];
}

const BusinessTypeHeatmap: React.FC<BusinessTypeHeatmapProps> = ({ timeRange }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
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
        // 按小时和业务类型分组统计
        const hourlyTypeStats: Record<string, Record<number, number>> = {};
        
        response.data.records.forEach((log: any) => {
          const time = new Date(log.operTime);
          const hourKey = `${time.getHours()}:00`;
          const businessType = log.businessType;
          
          if (!hourlyTypeStats[hourKey]) {
            hourlyTypeStats[hourKey] = {};
          }
          
          hourlyTypeStats[hourKey][businessType] = (hourlyTypeStats[hourKey][businessType] || 0) + 1;
        });

        // 获取所有出现的业务类型
        const allTypes = new Set<number>();
        Object.values(hourlyTypeStats).forEach(hourStats => {
          Object.keys(hourStats).forEach(type => allTypes.add(Number(type)));
        });

        const typeList = Array.from(allTypes).sort((a, b) => a - b);
        const hourList = Array.from({ length: 24 }, (_, i) => `${i}:00`);

        // 转换为热力图数据格式
        const heatmapData: [number, number, number][] = [];
        hourList.forEach((hour, hourIndex) => {
          typeList.forEach((type, typeIndex) => {
            const count = hourlyTypeStats[hour]?.[type] || 0;
            heatmapData.push([typeIndex, hourIndex, count]);
          });
        });

        setData({
          heatmapData,
          typeList,
          hourList,
        });
      }
    } catch (error) {
      console.error('获取业务类型热力图失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  useEffect(() => {
    if (chartRef.current && data.heatmapData) {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }

      chartInstance.current = echarts.init(chartRef.current);
      
      const option = {
        title: {
          text: '业务类型操作热力图',
          left: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold',
          },
        },
        tooltip: {
          position: 'top',
          formatter: (params: any) => {
            const hour = data.hourList[params.data[1]];
            const type = getBusinessTypeText(data.typeList[params.data[0]]);
            const count = params.data[2];
            return `${hour}<br/>${type}: ${count} 次`;
          },
        },
        grid: {
          height: '50%',
          top: '15%',
        },
        xAxis: {
          type: 'category',
          data: data.typeList.map(type => getBusinessTypeText(type)),
          splitArea: {
            show: true,
          },
          axisLabel: {
            rotate: 45,
            fontSize: 10,
          },
        },
        yAxis: {
          type: 'category',
          data: data.hourList,
          splitArea: {
            show: true,
          },
        },
        visualMap: {
          min: 0,
          max: Math.max(...data.heatmapData.map(item => item[2])),
          calculable: true,
          orient: 'horizontal',
          left: 'center',
          bottom: '5%',
          inRange: {
            color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffcc', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'],
          },
        },
        series: [{
          name: '操作次数',
          type: 'heatmap',
          data: data.heatmapData,
          label: {
            show: true,
            fontSize: 8,
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        }],
      };

      chartInstance.current.setOption(option);
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
    };
  }, [data]);

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
      <Card title="业务类型操作热力图" style={{ marginBottom: '24px' }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  if (!data.heatmapData || data.heatmapData.length === 0) {
    return (
      <Card title="业务类型操作热力图" style={{ marginBottom: '24px' }}>
        <Empty description="暂无数据" />
      </Card>
    );
  }

  return (
    <Card title="业务类型操作热力图" style={{ marginBottom: '24px' }}>
      <div style={{ fontSize: '12px', color: '#666', textAlign: 'center', marginBottom: '16px' }}>
        横轴：业务类型 | 纵轴：24小时 | 颜色深浅：操作次数
      </div>
      <div ref={chartRef} style={{ height: '500px', width: '100%' }} />
    </Card>
  );
};

export default BusinessTypeHeatmap;
