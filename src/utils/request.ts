import axios from 'axios';

// 创建axios实例
const request = axios.create({
  // 根据环境设置不同的baseURL
  // 开发环境：使用代理 /api
  // 生产环境：使用完整路径 /data-platform/api
  baseURL: process.env.NODE_ENV === 'development' ? '/api' : '/data-platform/api',
  timeout: 10000,
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 开发环境下打印请求日志
    if (process.env.NODE_ENV === 'development') {
      console.group('🚀 HTTP Request');
      console.log('Method:', config.method?.toUpperCase());
      console.log('URL:', config.url);
      console.log('BaseURL:', config.baseURL);
      console.log('Full URL:', config.baseURL + config.url);
      console.log('Headers:', config.headers);
      console.log('Data:', config.data);
      console.groupEnd();
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 开发环境下打印响应日志
    if (process.env.NODE_ENV === 'development') {
      console.group('✅ HTTP Response');
      console.log('Status:', response.status, response.statusText);
      console.log('Data:', response.data);
      console.groupEnd();
    }
    
    // 如果响应成功，检查是否需要更新token
    if (response.data && response.data.code === 200 && response.data.data && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
    }
    
    return response.data;
  },
  (error) => {
    // 开发环境下打印错误日志
    if (process.env.NODE_ENV === 'development') {
      console.group('❌ HTTP Error');
      console.log('Error:', error);
      console.log('Response:', error.response);
      console.groupEnd();
    }
    
    return Promise.reject(error);
  }
);

export default request;
