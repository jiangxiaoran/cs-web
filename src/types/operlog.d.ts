export interface OperLogItem {
  operId: number;
  title: string;
  businessType: number;
  method: string;
  requestMethod: string;
  operatorType: number;
  operName: string;
  deptName: string;
  operUrl: string;
  operIp: string;
  operLocation: string;
  operParam: string;
  jsonResult: string;
  status: number;
  errorMsg?: string;
  operTime: string;
  costTime: number;
}

export interface OperLogParams {
  current?: number;
  size?: number;
  title?: string;
  businessType?: number;
  operName?: string;
  status?: number;
  startTime?: string;
  endTime?: string;
}

export interface OperLogStatistics {
  totalCount: number;
  successCount: number;
  failureCount: number;
  todayCount: number;
}

export interface OperLogResponse {
  success: boolean;
  message: string;
  data: {
    records: OperLogItem[];
    total: number;
    current: number;
    size: number;
  };
}

export interface OperLogDetailResponse {
  success: boolean;
  message: string;
  data: OperLogItem;
}