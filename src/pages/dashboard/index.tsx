import { PageContainer } from '@ant-design/pro-components';
import { Card, Col, Row, Statistic, DatePicker, Space, message } from 'antd';
import { useRequest } from '@umijs/max';
import React, { useEffect, useState } from 'react';
import { getDashboardInfo, getExecutionTrend } from '@/services/dashboard/api';
import dayjs from 'dayjs';
import SimpleChart from '@/components/SimpleChart';

const { RangePicker } = DatePicker;

/**
 * Dashboard 组件 - 运行报表页面
 * 
 * 功能说明：
 * 1. 显示系统运行状态统计信息
 * 2. 提供日期范围选择功能
 * 3. 展示执行趋势图表和状态分布
 * 4. 支持实时数据刷新
 */
const Dashboard: React.FC = () => {
  // ==================== 状态管理 ====================
  
  /**
   * 日期范围状态
   * 默认显示最近7天的数据
   */
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(7, 'day'),
    dayjs(),
  ]);

  // ==================== API 请求配置 ====================
  
  /**
   * 获取仪表板概览数据
   * 包含任务数量、执行次数、系统状态等统计信息
   */
  const { 
    data: dashboardData, 
    loading: dashboardLoading, 
    error: dashboardError, 
    run: runDashboard 
  } = useRequest(getDashboardInfo, {
    pollingInterval: 30000, // 30秒自动刷新一次
    onError: (error) => {
      console.error('获取仪表板数据失败:', error);
      message.error('获取仪表板数据失败: ' + (error instanceof Error ? error.message : String(error)));
    }
  });

  /**
   * 获取图表趋势数据
   * 根据选择的日期范围获取执行趋势数据
   */
  const { 
    data: chartDataFromRequest, 
    loading: chartLoading, 
    error: chartError, 
    run: runChart 
  } = useRequest(
    () => getExecutionTrend({
      startDate: dateRange[0].format('YYYY-MM-DD'),
      endDate: dateRange[1].format('YYYY-MM-DD'),
      groupBy: 'day',
    }),
    {
      refreshDeps: [dateRange], // 日期变化时自动刷新
      onError: (error) => {
        console.error('获取图表数据失败:', error);
        message.error('获取图表数据失败: ' + (error instanceof Error ? error.message : String(error)));
      }
    }
  );

  // ==================== 数据处理 ====================
  
  /**
   * 提取API响应中的实际数据
   * 兼容不同的API响应格式
   */
  const dashboardContent = (dashboardData as any)?.data || dashboardData;
  const chartContent = (chartDataFromRequest as any)?.data || chartDataFromRequest;

  // ==================== 事件处理函数 ====================
  
  /**
   * 处理日期范围变化
   * @param dates 选择的日期范围
   */
  const handleDateRangeChange = (dates: any) => {
    if (dates && dates.length === 2) {
      console.log('🔥 日期范围变化:', dates[0].format('YYYY-MM-DD'), '到', dates[1].format('YYYY-MM-DD'));
      setDateRange([dates[0], dates[1]]);
      
      // 立即刷新图表数据
      runChart();
    }
  };

  // ==================== 生命周期管理 ====================
  
  /**
   * 组件挂载后自动加载数据
   */
  useEffect(() => {
    runDashboard();
    runChart();
  }, []);

  // ==================== 渲染函数 ====================
  
  /**
   * 渲染错误信息卡片
   */
  const renderErrorCard = () => {
    if (!dashboardError && !chartError) return null;
    
    return (
      <Card style={{ marginBottom: 16 }}>
        <div style={{ color: 'red' }}>
          {dashboardError && <div>仪表板数据获取失败: {dashboardError.message}</div>}
          {chartError && <div>图表数据获取失败: {chartError.message}</div>}
        </div>
      </Card>
    );
  };

  /**
   * 渲染统计信息卡片
   */
  const renderStatisticsCards = () => (
    <Row gutter={16} style={{ marginBottom: 24 }}>
      <Col span={6}>
        <Card>
          <Statistic
            title="任务数量"
            value={dashboardContent?.totalJobs || 0}
            loading={dashboardLoading}
            suffix="个"
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="总执行次数"
            value={dashboardContent?.totalExecutions || 0}
            loading={dashboardLoading}
            suffix="次"
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="成功次数"
            value={dashboardContent?.successExecutions || 0}
            loading={dashboardLoading}
            suffix="次"
            valueStyle={{ color: '#3f8600' }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="失败次数"
            value={dashboardContent?.failedExecutions || 0}
            loading={dashboardLoading}
            suffix="次"
            valueStyle={{ color: '#cf1322' }}
          />
        </Card>
      </Col>
    </Row>
  );

  /**
   * 渲染数据状态提示
   */
  const renderDataStatusCard = () => {
    if (dashboardLoading || dashboardContent) return null;
    
    return (
      <Card style={{ marginBottom: 16 }}>
        <div style={{ textAlign: 'center', color: '#666' }}>
          <p>暂无数据，请检查：</p>
          <ul style={{ textAlign: 'left', display: 'inline-block' }}>
            <li>后端服务是否正常运行（localhost:8081）</li>
            <li>数据库中是否有数据</li>
            <li>API接口是否正常响应</li>
          </ul>
        </div>
      </Card>
    );
  };

  /**
   * 渲染图表区域
   */
  const renderChartSection = () => (
    <Card title="执行趋势报表" loading={chartLoading}>
      <Row gutter={16}>
        <Col span={16}>
          <SimpleChart
            type="line"
            data={chartContent}
            height={400}
            width="100%"
          />
        </Col>
        <Col span={8}>
          <SimpleChart
            type="pie"
            data={dashboardContent}
            height={400}
            width="100%"
          />
        </Col>
      </Row>
    </Card>
  );

  // ==================== 主渲染函数 ====================
  
  return (
    <PageContainer
      title="运行报表"
      extra={
        <Space>
          <RangePicker
            value={dateRange}
            onChange={handleDateRangeChange}
            format="YYYY-MM-DD"
            placeholder={['开始时间', '结束时间']}
          />
        </Space>
      }
    >
      {/* 错误信息显示 */}
      {renderErrorCard()}
      
      {/* 统计信息卡片 */}
      {renderStatisticsCards()}
      
      {/* 数据状态提示 */}
      {renderDataStatusCard()}
      
      {/* 图表区域 */}
      {renderChartSection()}
    </PageContainer>
  );
};

export default Dashboard; 