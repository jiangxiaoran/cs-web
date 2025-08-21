import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';

interface SimpleChartProps {
  data: any;
  type: 'line' | 'pie';
  height?: number;
  width?: string;
}

const SimpleChart: React.FC<SimpleChartProps> = ({ data, type, height = 400, width = '100%' }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const [isReady, setIsReady] = useState(false);

  // 初始化图表
  useEffect(() => {
    if (chartRef.current && !chartInstance.current) {
      try {
        chartInstance.current = echarts.init(chartRef.current);
        setIsReady(true);
        console.log('✅ 图表初始化成功');
      } catch (error) {
        console.error('❌ 图表初始化失败:', error);
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
    };
  }, []);

  // 更新图表数据
  useEffect(() => {
    if (!isReady || !chartInstance.current || !data) {
      return;
    }

    try {
      console.log('🔥 开始更新图表数据:', data);
      
      let option: any;
      
      if (type === 'line') {
        option = {
          title: { text: '执行趋势图', left: 'center' },
          tooltip: { trigger: 'axis' },
          legend: { data: ['成功', '失败', '总计'], top: 30 },
          grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
          xAxis: { type: 'category', data: data.dates || [] },
          yAxis: { type: 'value' },
          series: [
            {
              name: '成功',
              type: 'line',
              data: data.successCounts || [],
              color: '#00A65A',
            },
            {
              name: '失败',
              type: 'line',
              data: data.failedCounts || [],
              color: '#c23632',
            },
            {
              name: '总计',
              type: 'line',
              data: data.totalCounts || [],
              color: '#F39C12',
            },
          ],
        };
      } else if (type === 'pie') {
        option = {
          title: { text: '执行状态分布', left: 'center' },
          tooltip: { trigger: 'item', formatter: '{b} : {c} ({d}%)' },
          legend: { orient: 'vertical', left: 'left', top: 'middle' },
          series: [
            {
              name: '执行状态',
              type: 'pie',
              radius: '50%',
              data: [
                { value: data.successExecutions || 0, name: '成功' },
                { value: data.failedExecutions || 0, name: '失败' },
                { value: data.runningJobs || 0, name: '运行中' },
              ],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
              },
            },
          ],
          color: ['#00A65A', '#c23632', '#F39C12'],
        };
      }

      if (option) {
        // 清空现有配置
        chartInstance.current.clear();
        
        // 设置新配置
        chartInstance.current.setOption(option, true);
        
        // 强制重绘
        chartInstance.current.resize();
        
        console.log('✅ 图表更新成功');
        
        // 验证配置
        setTimeout(() => {
          const currentOption = chartInstance.current?.getOption();
          console.log('🔥 图表配置验证:', currentOption);
          
          if (currentOption && currentOption.series && Array.isArray(currentOption.series)) {
            const hasData = currentOption.series.some(series => 
              series.data && Array.isArray(series.data) && series.data.length > 0
            );
            console.log('🔥 图表有数据:', hasData);
          }
        }, 100);
      }
    } catch (error) {
      console.error('❌ 图表更新失败:', error);
    }
  }, [data, type, isReady]);

  // 窗口大小变化时重新调整
  useEffect(() => {
    const handleResize = () => {
      if (chartInstance.current) {
        chartInstance.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      ref={chartRef}
      style={{
        width,
        height,
        border: '1px solid #f0f0f0',
        borderRadius: '4px',
        backgroundColor: '#fff',
        visibility: 'visible',
        display: 'block',
        opacity: 1,
        position: 'relative',
        zIndex: 1,
      }}
    />
  );
};

export default SimpleChart;
