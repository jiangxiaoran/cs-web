import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Card, theme, Row, Col, Statistic, Button, Space, Typography } from 'antd';
import { 
  SafetyOutlined, 
  HeartOutlined, 
  TeamOutlined, 
  TrophyOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  StarOutlined
} from '@ant-design/icons';
import React from 'react';

const { Title, Paragraph, Text } = Typography;

/**
 * 友邦保险特色服务卡片
 */
const ServiceCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
}> = ({ icon, title, desc, color }) => {
  const { token } = theme.useToken();

  return (
    <Card
      style={{
        borderRadius: 12,
        border: `1px solid ${token.colorBorderSecondary}`,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
      }}
      hoverable
    >
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            backgroundColor: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '28px',
            color: '#fff',
          }}
        >
          {icon}
        </div>
        <Title level={4} style={{ marginBottom: 8, color: token.colorTextHeading }}>
          {title}
        </Title>
        <Paragraph style={{ color: token.colorTextSecondary, margin: 0 }}>
          {desc}
        </Paragraph>
      </div>
    </Card>
  );
};

/**
 * 数据统计卡片
 */
const StatCard: React.FC<{
  title: string;
  value: number;
  suffix: string;
  color: string;
}> = ({ title, value, suffix, color }) => {
  return (
    <Card style={{ borderRadius: 8, textAlign: 'center' }}>
      <Statistic
        title={title}
        value={value}
        suffix={suffix}
        valueStyle={{ color, fontSize: '24px', fontWeight: 'bold' }}
      />
    </Card>
  );
};

const Welcome: React.FC = () => {
  const { token } = theme.useToken();
  const { initialState } = useModel('@@initialState');

  return (
    <PageContainer>
      {/* 主横幅区域 */}
      <Card
        style={{
          borderRadius: 12,
          marginBottom: 24,
          background: 'linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 100%)',
          border: '1px solid #d9e7ff',
        }}
      >
        <Row gutter={24} align="middle">
          <Col span={16}>
            <Title level={2} style={{ color: token.colorTextHeading, marginBottom: 16 }}>
              欢迎使用报表任务统一处理平台
            </Title>
            <Paragraph style={{ color: token.colorTextSecondary, fontSize: '16px', marginBottom: 24 }}>
              专业的报表任务处理平台，为您提供高效、准确的报表生成和处理服务。
              我们致力于为企业提供最优质的报表解决方案和数据处理服务。
            </Paragraph>
            <Space>
              <Button type="primary" size="large">
                开始使用 <ArrowRightOutlined />
              </Button>
              <Button size="large">
                了解更多
              </Button>
            </Space>
          </Col>
          <Col span={8} style={{ textAlign: 'center' }}>
            <img
              src="/logo.svg"
              alt="友邦报表平台"
              style={{
                width: '80px',
                height: '80px',
                opacity: 0.8,
              }}
            />
          </Col>
        </Row>
      </Card>

      {/* 核心数据统计 */}
      <Row gutter={16} style={{ marginBottom: 32 }}>
        <Col span={6}>
          <StatCard title="处理任务" value={12580} suffix="个" color="#52c41a" />
        </Col>
        <Col span={6}>
          <StatCard title="报表模板" value={156} suffix="种" color="#1890ff" />
        </Col>
        <Col span={6}>
          <StatCard title="处理成功率" value={98.5} suffix="%" color="#faad14" />
        </Col>
        <Col span={6}>
          <StatCard title="用户满意度" value={99.2} suffix="%" color="#eb2f96" />
        </Col>
      </Row>

      {/* 特色服务 */}
      <Card title="我们的特色服务" style={{ marginBottom: 24 }}>
        <Row gutter={[24, 24]}>
          <Col span={8}>
            <ServiceCard
              icon={<SafetyOutlined />}
              title="智能报表生成"
              desc="支持多种数据源，自动生成各类报表，提供高效、准确的报表处理服务"
              color="#52c41a"
            />
          </Col>
          <Col span={8}>
            <ServiceCard
              icon={<HeartOutlined />}
              title="任务调度管理"
              desc="灵活的任务调度系统，支持定时执行、批量处理，确保任务按时完成"
              color="#eb2f96"
            />
          </Col>
          <Col span={8}>
            <ServiceCard
              icon={<TeamOutlined />}
              title="统一处理平台"
              desc="集中化的报表处理平台，提供统一的数据处理、格式转换和分发服务"
              color="#1890ff"
            />
          </Col>
        </Row>
      </Card>

      {/* 平台优势 */}
      <Card title="平台核心优势" style={{ marginBottom: 24 }}>
        <Row gutter={[24, 16]}>
          <Col span={12}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
              <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '20px', marginRight: 12 }} />
              <Text strong>高性能处理</Text>
            </div>
            <Paragraph style={{ color: token.colorTextSecondary, marginLeft: 32 }}>
              采用先进的数据处理技术，支持大规模并发处理，确保报表生成的高效性和准确性。
            </Paragraph>
          </Col>
          <Col span={12}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
              <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '20px', marginRight: 12 }} />
              <Text strong>智能调度系统</Text>
            </div>
            <Paragraph style={{ color: token.colorTextSecondary, marginLeft: 32 }}>
              智能任务调度算法，自动优化执行顺序，提高系统整体处理效率。
            </Paragraph>
          </Col>
          <Col span={12}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
              <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '20px', marginRight: 12 }} />
              <Text strong>多格式支持</Text>
            </div>
            <Paragraph style={{ color: token.colorTextSecondary, marginLeft: 32 }}>
              支持Excel、PDF、Word等多种报表格式，满足不同业务场景的需求。
            </Paragraph>
          </Col>
          <Col span={12}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
              <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '20px', marginRight: 12 }} />
              <Text strong>实时监控</Text>
            </div>
            <Paragraph style={{ color: token.colorTextSecondary, marginLeft: 32 }}>
              提供实时任务监控和状态跟踪，确保每个报表任务都能按时完成。
            </Paragraph>
          </Col>
        </Row>
      </Card>

      {/* 用户评价 */}
      <Card title="用户评价" style={{ marginBottom: 24 }}>
        <Row gutter={24}>
          <Col span={8}>
            <Card style={{ textAlign: 'center', borderRadius: 8 }}>
              <div style={{ marginBottom: 16 }}>
                <StarOutlined style={{ color: '#faad14', fontSize: '20px' }} />
                <StarOutlined style={{ color: '#faad14', fontSize: '20px' }} />
                <StarOutlined style={{ color: '#faad14', fontSize: '20px' }} />
                <StarOutlined style={{ color: '#faad14', fontSize: '20px' }} />
                <StarOutlined style={{ color: '#faad14', fontSize: '20px' }} />
              </div>
              <Paragraph style={{ fontStyle: 'italic', color: token.colorTextSecondary }}>
                "报表处理速度很快，格式支持全面，大大提高了我们的工作效率。"
              </Paragraph>
              <Text strong>— 财务部 张经理</Text>
            </Card>
          </Col>
          <Col span={8}>
            <Card style={{ textAlign: 'center', borderRadius: 8 }}>
              <div style={{ marginBottom: 16 }}>
                <StarOutlined style={{ color: '#faad14', fontSize: '20px' }} />
                <StarOutlined style={{ color: '#faad14', fontSize: '20px' }} />
                <StarOutlined style={{ color: '#faad14', fontSize: '20px' }} />
                <StarOutlined style={{ color: '#faad14', fontSize: '20px' }} />
                <StarOutlined style={{ color: '#faad14', fontSize: '20px' }} />
              </div>
              <Paragraph style={{ fontStyle: 'italic', color: token.colorTextSecondary }}>
                "任务调度功能很智能，自动化程度高，减少了大量人工操作。"
              </Paragraph>
              <Text strong>— 技术部 李工程师</Text>
            </Card>
          </Col>
          <Col span={8}>
            <Card style={{ textAlign: 'center', borderRadius: 8 }}>
              <div style={{ marginBottom: 16 }}>
                <StarOutlined style={{ color: '#faad14', fontSize: '20px' }} />
                <StarOutlined style={{ color: '#faad14', fontSize: '20px' }} />
                <StarOutlined style={{ color: '#faad14', fontSize: '20px' }} />
                <StarOutlined style={{ color: '#faad14', fontSize: '20px' }} />
                <StarOutlined style={{ color: '#faad14', fontSize: '20px' }} />
              </div>
              <Paragraph style={{ fontStyle: 'italic', color: token.colorTextSecondary }}>
                "界面简洁易用，监控功能完善，能够实时了解任务执行状态。"
              </Paragraph>
              <Text strong>— 运营部 王主管</Text>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* 技术支持 */}
      <Card title="技术支持" style={{ marginBottom: 24 }}>
        <Row gutter={24}>
          <Col span={12}>
            <Title level={4}>技术支持热线</Title>
            <Paragraph style={{ fontSize: '18px', color: '#1890ff', fontWeight: 'bold' }}>
              400-888-8888
            </Paragraph>
            <Paragraph style={{ color: token.colorTextSecondary }}>
              7×24小时专业技术支持服务
            </Paragraph>
          </Col>
          <Col span={12}>
            <Title level={4}>系统维护时间</Title>
            <Paragraph style={{ color: token.colorTextSecondary }}>
              每周日凌晨2:00-6:00进行系统维护
            </Paragraph>
            <Paragraph style={{ color: token.colorTextSecondary }}>
              维护期间系统暂停服务
            </Paragraph>
          </Col>
        </Row>
      </Card>
    </PageContainer>
  );
};

export default Welcome;
