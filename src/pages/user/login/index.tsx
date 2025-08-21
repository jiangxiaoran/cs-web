import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { history, useModel } from '@umijs/max';
import { Alert, message } from 'antd';
import React, { useState } from 'react';
import { login } from '@/services/ant-design-pro/api';

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<any>(null);
  const [type, setType] = useState<string>('account');
  const [loading, setLoading] = useState(false);
  const { initialState, setInitialState } = useModel('@@initialState');

  const handleSubmit = async (values: { username: string; password: string }) => {
    if (loading) {
      return; // 防止重复提交
    }
    
    console.log('🚀 开始登录流程...', values);
    setLoading(true);
    try {
      // 登录
      const msg = await login({ ...values, type }) as any;
      console.log('📡 登录API响应:', msg);
      console.log('📡 响应类型:', typeof msg);
      console.log('📡 响应内容:', JSON.stringify(msg, null, 2));
      
      if (msg && msg.code === 200) {
        const defaultLoginSuccessMessage = '登录成功！';
        message.success(defaultLoginSuccessMessage);
        
        console.log('🔐 登录成功，开始处理跳转逻辑...');
        
        // 保存token到localStorage
        if (msg.data?.token) {
          localStorage.setItem('token', msg.data.token);
          console.log('✅ Token已保存到localStorage');
        }
        if (msg.data?.refreshToken) {
          localStorage.setItem('refreshToken', msg.data.refreshToken);
          console.log('✅ RefreshToken已保存到localStorage');
        }
        
        // 更新initialState中的用户信息
        if (msg.data?.user) {
          console.log('👤 用户信息:', msg.data.user);
          await setInitialState((s) => ({
            ...s,
            currentUser: msg.data.user,
          }));
          console.log('✅ 用户状态已更新');
          
          // 等待状态更新完成后再跳转
          setTimeout(() => {
            // 跳转到首页或指定页面
            const urlParams = new URL(window.location.href).searchParams;
            const redirect = urlParams.get('redirect') || '/dashboard';
            console.log('🔄 准备跳转到:', redirect);
            
            console.log('🚀 执行跳转...');
            try {
              history.push(redirect);
              console.log('✅ 跳转成功');
            } catch (error) {
              console.error('❌ 跳转失败:', error);
              // 备用方案：使用window.location
              window.location.href = redirect;
            }
          }, 500); // 增加延迟确保状态更新完成
        } else {
          console.error('❌ 没有用户信息，无法跳转');
        }
        
        return;
      }
      
      // 如果失败去设置用户错误信息
      setUserLoginState(msg);
    } catch (error) {
      const defaultLoginFailureMessage = '登录失败，请重试！';
      console.log(error);
      message.error(defaultLoginFailureMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'auto',
        backgroundImage:
          "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
        backgroundSize: '100% 100%',
      }}
    >
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          logo={<img alt="logo" src="/logo.svg" />}
          title="GDP作业调度系统"
          subTitle="企业级分布式任务调度平台"
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values as { username: string; password: string });
          }}
        >
          {userLoginState && userLoginState.code !== 200 && userLoginState.message && (
            <LoginMessage content={userLoginState.message} />
          )}

          <ProFormText
            name="username"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined />,
            }}
            placeholder="用户名: admin or user"
            rules={[
              {
                required: true,
                message: '请输入用户名!',
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined />,
            }}
            placeholder="密码: 123456"
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          />

          <div
            style={{
              marginBottom: 24,
            }}
          >
            <a
              style={{
                float: 'right',
              }}
            >
              忘记密码
            </a>
          </div>
        </LoginForm>
      </div>
    </div>
  );
};

export default Login;
