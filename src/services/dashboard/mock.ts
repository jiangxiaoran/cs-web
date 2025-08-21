import { API } from '@/types/dashboard';

// 模拟仪表板信息
export const mockDashboardInfo: API.DashboardInfo = {
  jobInfoCount: 156,
  jobLogCount: 2847,
  jobLogSuccessCount: 2651,
  jobLogFailCount: 196,
  executorCount: 8,
};

// 模拟图表数据
export const mockChartData: API.ChartData = {
  triggerDayList: [
    '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月', '13月', '14月'
  ],
  triggerDayCountSucList: [120, 132, 101, 134, 90, 230, 210, 182, 191, 234, 290, 330, 310, 123],
  triggerDayCountFailList: [20, 32, 21, 34, 10, 30, 20, 18, 19, 24, 29, 33, 31, 12],
  triggerDayCountRunningList: [5, 8, 3, 6, 2, 8, 5, 4, 3, 6, 8, 9, 7, 3],
  triggerCountSucTotal: 2651,
  triggerCountFailTotal: 312,
  triggerCountRunningTotal: 76,
}; 