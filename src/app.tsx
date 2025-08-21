import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { SettingDrawer } from '@ant-design/pro-components';
import type { RequestConfig, RunTimeLayoutConfig } from '@umijs/max';
import { history } from '@umijs/max';
import React from 'react';
import {
  AvatarDropdown,
  AvatarName,
  Footer,
  Question,
  SelectLang,
} from '@/components';
import { currentUser as queryCurrentUser } from '@/services/ant-design-pro/api';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';
import '@ant-design/v5-patch-for-react-19';

const isDev = process.env.NODE_ENV === 'development';
const isDevOrTest = isDev || process.env.CI;
const loginPath = '/user/login';

// 开发环境下启用详细日志
if (isDev) {
  console.log('🔧 Development mode enabled - HTTP logging will be shown');
  
  // 重写console.log以添加时间戳
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;
  
  console.log = (...args) => {
    const timestamp = new Date().toISOString();
    originalLog(`[${timestamp}]`, ...args);
  };
  
  console.error = (...args) => {
    const timestamp = new Date().toISOString();
    originalError(`[${timestamp}]`, ...args);
  };
  
  console.warn = (...args) => {
    const timestamp = new Date().toISOString();
    originalWarn(`[${timestamp}]`, ...args);
  };
  
  // 全局错误处理
  window.addEventListener('error', (event) => {
    console.error('❌ Global Error:', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error,
      timestamp: new Date().toISOString(),
    });
  });
  
  // 未处理的Promise拒绝
  window.addEventListener('unhandledrejection', (event) => {
    console.error('❌ Unhandled Promise Rejection:', {
      reason: event.reason,
      timestamp: new Date().toISOString(),
    });
  });
}

/**
 * @see https://umijs.org/docs/api/runtime-config#getinitialstate
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      // 检查是否有token
      const token = localStorage.getItem('token');
      if (!token) {
        return undefined;
      }
      
      const msg = await queryCurrentUser({
        skipErrorHandler: true,
      });
      
      // 处理后端API响应格式
      if (msg && msg.success && msg.data) {
        return msg.data;
      } else if (msg && msg.data) {
        // 兼容不同的响应格式
        return msg.data;
      }
      
      return undefined;
    } catch (_error) {
      console.error('获取用户信息失败:', _error);
      // 如果获取用户信息失败，清除token并跳转到登录页
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      history.push(loginPath);
    }
    return undefined;
  };
  
  // 如果不是登录页面，执行
  const { location } = history;
  if (
    ![loginPath, '/user/register', '/user/register-result'].includes(
      location.pathname,
    )
  ) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings as Partial<LayoutSettings>,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({
  initialState,
  setInitialState,
}) => {
  return {
    actionsRender: () => [
      <Question key="doc" />,
      <SelectLang key="SelectLang" />,
    ],
    avatarProps: {
      src: initialState?.currentUser?.avatar,
      title: <AvatarName />,
      render: (_, avatarChildren) => (
        <AvatarDropdown>{avatarChildren}</AvatarDropdown>
      ),
    },
    // 移除水印配置
    // waterMarkProps: {
    //   content: initialState?.currentUser?.name,
    // },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    bgLayoutImgList: [
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    links: isDevOrTest
      ? [
          // 移除OpenAI文档链接
        ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {/* 隐藏设置抽屉
          {isDevOrTest && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
          */}
        </>
      );
    },
    ...initialState?.settings,
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request: RequestConfig = {
  ...errorConfig,
  // 请求拦截器
  requestInterceptors: [
    (config: any) => {
      // 从localStorage获取token
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // 开发环境下打印请求日志
      if (isDev) {
        const logData = {
          method: config.method?.toUpperCase(),
          url: config.url,
          baseURL: config.baseURL,
          headers: config.headers,
          params: config.params,
          data: config.data,
          timestamp: new Date().toISOString(),
        };
        
        console.group('🚀 HTTP Request');
        console.log('Method:', logData.method);
        console.log('URL:', logData.url);
        console.log('BaseURL:', logData.baseURL);
        console.log('Headers:', logData.headers);
        console.log('Params:', logData.params);
        console.log('Data:', logData.data);
        console.log('Timestamp:', logData.timestamp);
        console.groupEnd();
      }
      
      return config;
    },
  ],
  // 响应拦截器
  responseInterceptors: [
    (response: any) => {
      // 处理响应数据
      const { data, status, statusText, config } = response;
      
      // 开发环境下打印响应日志
      if (isDev) {
        const logData = {
          method: config.method?.toUpperCase(),
          url: config.url,
          status: status,
          statusText: statusText,
          data: data,
          timestamp: new Date().toISOString(),
        };
        
        console.group('✅ HTTP Response');
        console.log('Method:', logData.method);
        console.log('URL:', logData.url);
        console.log('Status:', logData.status, logData.statusText);
        console.log('Data:', logData.data);
        console.log('Timestamp:', logData.timestamp);
        console.groupEnd();
      }
      
      // 如果响应成功，检查是否需要更新token
      if (data && (data as any).code === 200 && (data as any).data && (data as any).data.token) {
        localStorage.setItem('token', (data as any).data.token);
      }
      
      return response;
    },
  ],
};
