declare namespace API {
  // 仪表板信息
  interface DashboardInfo {
    jobInfoCount: number;
    jobLogCount: number;
    jobLogSuccessCount: number;
    jobLogFailCount: number;
    executorCount: number;
  }

  // 图表数据
  interface ChartData {
    triggerDayList: string[];
    triggerDayCountSucList: number[];
    triggerDayCountFailList: number[];
    triggerDayCountRunningList: number[];
    triggerCountSucTotal: number;
    triggerCountFailTotal: number;
    triggerCountRunningTotal: number;
  }

  // 图表请求参数
  interface ChartParams {
    startDate: string;
    endDate: string;
  }

  // 图表响应
  interface ChartResponse {
    code: number;
    msg: string;
    content: ChartData;
  }

  // 仪表板响应
  interface DashboardResponse {
    code: number;
    msg: string;
    content: DashboardInfo;
  }
} 