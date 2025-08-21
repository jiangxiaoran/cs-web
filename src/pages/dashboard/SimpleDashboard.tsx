import { PageContainer } from '@ant-design/pro-components';
import { Card, Col, Row, Statistic, DatePicker, Space, message } from 'antd';
import { useRequest } from '@umijs/max';
import React, { useEffect, useState } from 'react';
import { getDashboardInfo, getExecutionTrend } from '@/services/dashboard/api';
import dayjs from 'dayjs';
import SimpleChart from '@/components/SimpleChart';

const { RangePicker } = DatePicker;

const SimpleDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(7, 'day'),
    dayjs(),
  ]);

  // 获取仪表板信息
  const { data: dashboardData, loading: dashboardLoading, error: dashboardError, run: runDashboard } = useRequest(getDashboardInfo, {
    pollingInterval: 30000, // 30秒刷新一次
    onError: (error) => {
      console.error('获取仪表板数据失败:', error);
      message.error('获取仪表板数据失败: ' + (error instanceof Error ? error.message : String(error)));
    }
  });

  // 获取图表数据
  const { data: chartDataFromRequest, loading: chartLoading, error: chartError, run: runChart } = useRequest(
    () => getExecutionTrend({
      startDate: dateRange[0].format('YYYY-MM-DD'),
      endDate: dateRange[1].format('YYYY-MM-DD'),
      groupBy: 'day',
    }),
    {
      refreshDeps: [dateRange],
      onError: (error) => {
        console.error('获取图表数据失败:', error);
        message.error('获取图表数据失败: ' + (error instanceof Error ? error.message : String(error)));
      }
    }
  );

  // 正确访问API响应的data字段
  const dashboardContent = (dashboardData as any)?.data || dashboardData;
  const chartContent = (chartDataFromRequest as any)?.data || chartDataFromRequest;

  // 处理日期范围变化
  const handleDateRangeChange = (dates: any) => {
    if (dates && dates.length === 2) {
      console.log('🔥 日期范围变化:', dates[0].format('YYYY-MM-DD'), '到', dates[1].format('YYYY-MM-DD'));
      setDateRange([dates[0], dates[1]]);
      
      // 立即刷新图表数据
      runChart();
    }
  };

  // 页面加载完成后自动刷新数据
  useEffect(() => {
    runDashboard();
    runChart();
  }, []);

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
      {(dashboardError || chartError) && (
        <Card style={{ marginBottom: 16 }}>
          <div style={{ color: 'red' }}>
            {dashboardError && <div>仪表板数据获取失败: {dashboardError.message}</div>}
            {chartError && <div>图表数据获取失败: {chartError.message}</div>}
          </div>
        </Card>
      )}

      {/* 统计卡片 */}
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

      {/* 数据状态显示 */}
      {!dashboardLoading && !dashboardContent && (
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
      )}

      {/* 图表区域 */}
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
    </PageContainer>
  );
};

export default SimpleDashboard;
