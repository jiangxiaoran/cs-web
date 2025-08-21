import {
  ModalForm,
  ProFormText,
  ProFormSelect,
  ProFormTextArea,
  ProFormDigit,
  ProFormTimePicker,
} from '@ant-design/pro-components';
import { message } from 'antd';
import { useEffect, useState } from 'react';
import { addJob, getExecutorGroups } from '@/services/job/api';

interface CreateJobModalProps {
  visible: boolean;
  onVisibleChange: (visible: boolean) => void;
  onSuccess: () => void;
}

const CreateJobModal: React.FC<CreateJobModalProps> = ({
  visible,
  onVisibleChange,
  onSuccess,
}) => {
  const [executorGroups, setExecutorGroups] = useState<API.ExecutorGroup[]>([]);

  useEffect(() => {
    if (visible) {
      loadExecutorGroups();
    }
  }, [visible]);

  const loadExecutorGroups = async () => {
    try {
      const groups = await getExecutorGroups();
      setExecutorGroups(groups);
    } catch (error) {
      console.error('加载执行器列表失败:', error);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      // 验证作业代码格式
      if (!/^[A-Z_][A-Z0-9_]*$/.test(values.jobCode)) {
        message.error('作业代码只能包含大写字母、数字和下划线，且必须以字母或下划线开头');
        return false;
      }

      // 移除JSON参数格式验证，允许任意格式
      // if (values.jobParams) {
      //   try {
      //     JSON.parse(values.jobParams);
      //   } catch (e) {
      //     message.error('作业参数必须是有效的JSON格式');
      //     return false;
      //   }
      // }

      // 处理时间格式
      let scheduleTime = null;
      if (values.scheduleTime) {
        // 如果是moment对象，转换为字符串
        if (typeof values.scheduleTime === 'object' && values.scheduleTime.format) {
          scheduleTime = values.scheduleTime.format('HH:mm:ss');
        } else {
          scheduleTime = values.scheduleTime;
        }
      }

      const jobData = {
        jobCode: values.jobCode,
        jobName: values.jobName,
        jobGroup: values.jobGroup || null,
        jobOrder: values.jobOrder || 0,
        groupOrder: values.groupOrder || 0,
        procName: values.procName || null,
        jobParams: values.jobParams || null,
        jobType: values.jobType || null,
        scheduleTimeStr: scheduleTime,
        status: values.status || 'ACTIVE',
        timeoutSec: values.timeoutSec || 3600,
        retryCount: values.retryCount || 0,
        notifyEmail: values.notifyEmail || null,
        isActive: true,
        isDepend: false,
      };

      await addJob(jobData);
      message.success('新增任务成功');
      onSuccess();
      return true;
    } catch (error) {
      console.error('新增任务失败:', error);
      message.error('新增任务失败: ' + (error.message || '未知错误'));
      return false;
    }
  };

  return (
    <ModalForm
      title="新增任务"
      open={visible}
      onOpenChange={onVisibleChange}
      onFinish={handleSubmit}
      width={800}
      layout="horizontal"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
    >
      <ProFormText
        name="jobCode"
        label="作业代码"
        placeholder="请输入作业代码，如：DATA_SYNC_001"
        rules={[
          { required: true, message: '请输入作业代码' },
          { 
            pattern: /^[A-Z_][A-Z0-9_]*$/, 
            message: '作业代码只能包含大写字母、数字和下划线，且必须以字母或下划线开头' 
          }
        ]}
        tooltip="作业代码必须唯一，建议使用大写字母和下划线"
      />

      <ProFormText
        name="jobName"
        label="作业名称"
        placeholder="请输入作业名称"
        rules={[
          { required: true, message: '请输入作业名称' },
          { max: 200, message: '作业名称不能超过200个字符' }
        ]}
      />

      <ProFormText
        name="jobGroup"
        label="作业分组"
        placeholder="请输入作业分组，如：数据处理"
        rules={[{ max: 50, message: '作业分组不能超过50个字符' }]}
        tooltip="用于对作业进行分类管理"
      />

      <ProFormDigit
        name="jobOrder"
        label="作业顺序"
        placeholder="请输入作业顺序"
        min={0}
        initialValue={0}
        tooltip="同一分组内作业的执行顺序，数字越小优先级越高"
      />

      <ProFormDigit
        name="groupOrder"
        label="分组顺序"
        placeholder="请输入分组顺序"
        min={0}
        initialValue={0}
        tooltip="分组的显示顺序，数字越小排序越靠前"
      />

      <ProFormText
        name="procName"
        label="存储过程名称"
        placeholder="请输入存储过程名称，如：sp_sync_data"
        rules={[{ max: 200, message: '存储过程名称不能超过200个字符' }]}
        tooltip="当作业类型为存储过程时，此字段为必填"
      />

      <ProFormTextArea
        name="jobParams"
        label="作业参数"
        placeholder="请输入作业参数，如：{'source':'mysql','target':'oracle'} 或 任意格式"
        rows={3}
        tooltip="作业执行时传递给存储过程或脚本的参数，支持任意格式"
      />

      <ProFormSelect
        name="jobType"
        label="作业类型"
        placeholder="请选择作业类型"
        options={[
          { label: '存储过程', value: 'stored_procedure' },
          { label: '脚本', value: 'SCRIPT' },
          { label: 'HTTP', value: 'HTTP' },
        ]}
        rules={[{ required: true, message: '请选择作业类型' }]}
        tooltip="选择作业的执行方式"
      />

      <ProFormTimePicker
        name="scheduleTime"
        label="调度时间"
        placeholder="请选择调度时间"
        fieldProps={{
          format: 'HH:mm:ss'
        }}
        tooltip="作业每天的执行时间，格式为HH:mm:ss"
      />

      <ProFormSelect
        name="status"
        label="状态"
        placeholder="请选择状态"
        options={[
          { label: '激活', value: 'ACTIVE' },
          { label: '停用', value: 'INACTIVE' },
        ]}
        initialValue="ACTIVE"
        tooltip="激活状态下的作业会正常调度执行"
      />

      <ProFormDigit
        name="timeoutSec"
        label="超时时间(秒)"
        placeholder="请输入超时时间"
        min={1}
        max={86400}
        initialValue={3600}
        tooltip="作业执行的最大时间，超过此时间将被强制终止"
      />

      <ProFormDigit
        name="retryCount"
        label="重试次数"
        placeholder="请输入重试次数"
        min={0}
        max={10}
        initialValue={0}
        tooltip="作业执行失败时的重试次数"
      />

      <ProFormText
        name="notifyEmail"
        label="通知邮箱"
        placeholder="请输入通知邮箱，多个邮箱用逗号分隔"
        tooltip="作业执行完成后的通知邮箱，多个邮箱用逗号分隔"
      />
    </ModalForm>
  );
};

export default CreateJobModal; 