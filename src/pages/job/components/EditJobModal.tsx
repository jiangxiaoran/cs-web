import {
  ModalForm,
  ProFormText,
  ProFormSelect,
  ProFormTextArea,
  ProFormDigit,
  ProFormTimePicker,
  ProFormSwitch,
} from '@ant-design/pro-components';
import { message } from 'antd';
import { useEffect, useState } from 'react';
import { updateJob, getExecutorGroups } from '@/services/job/api';

interface EditJobModalProps {
  visible: boolean;
  onVisibleChange: (visible: boolean) => void;
  job?: API.JobDef;
  onSuccess: () => void;
}

const EditJobModal: React.FC<EditJobModalProps> = ({
  visible,
  onVisibleChange,
  job,
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
    if (!job) return false;
    
    try {
      await updateJob({
        ...values,
        jobId: job.jobId,
      });
      message.success('更新任务成功');
      onSuccess();
      return true;
    } catch (error) {
      message.error('更新任务失败');
      return false;
    }
  };

  if (!job) return null;

  return (
    <ModalForm
      title="编辑任务"
      open={visible}
      onOpenChange={onVisibleChange}
      onFinish={handleSubmit}
      width={800}
      layout="horizontal"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      initialValues={{
        jobCode: job.jobCode,
        jobName: job.jobName,
        jobGroup: job.jobGroup,
        jobOrder: job.jobOrder,
        groupOrder: job.groupOrder,
        procName: job.procName,
        jobParams: job.jobParams,
        jobType: job.jobType,
        scheduleTime: job.scheduleTime,
        status: job.status,
        timeoutSec: job.timeoutSec,
        retryCount: job.retryCount,
        notifyEmail: job.notifyEmail,
        isDepend: job.isDepend,
        isActive: job.isActive,
      }}
    >
      <ProFormText
        name="jobCode"
        label="作业代码"
        placeholder="请输入作业代码，如：DATA_SYNC_001"
        rules={[{ required: true, message: '请输入作业代码' }]}
      />

      <ProFormText
        name="jobName"
        label="作业名称"
        placeholder="请输入作业名称"
        rules={[{ required: true, message: '请输入作业名称' }]}
      />

      <ProFormText
        name="jobGroup"
        label="作业分组"
        placeholder="请输入作业分组，如：数据处理"
      />

      <ProFormDigit
        name="jobOrder"
        label="作业顺序"
        placeholder="请输入作业顺序"
        min={0}
      />

      <ProFormDigit
        name="groupOrder"
        label="分组顺序"
        placeholder="请输入分组顺序"
        min={0}
      />

      <ProFormText
        name="procName"
        label="存储过程名称"
        placeholder="请输入存储过程名称，如：sp_sync_data"
      />

      <ProFormTextArea
        name="jobParams"
        label="作业参数"
        placeholder="请输入作业参数，JSON格式，如：{\"source\":\"mysql\",\"target\":\"oracle\"}"
        rows={3}
      />

      <ProFormSelect
        name="jobType"
        label="作业类型"
        placeholder="请选择作业类型"
        options={[
          { label: '存储过程', value: 'PROCEDURE' },
          { label: '脚本', value: 'SCRIPT' },
          { label: 'HTTP', value: 'HTTP' },
        ]}
        rules={[{ required: true, message: '请选择作业类型' }]}
      />

      <ProFormTimePicker
        name="scheduleTime"
        label="调度时间"
        placeholder="请选择调度时间"
        format="HH:mm:ss"
      />

      <ProFormSelect
        name="status"
        label="状态"
        placeholder="请选择状态"
        options={[
          { label: '激活', value: 'ACTIVE' },
          { label: '停用', value: 'INACTIVE' },
        ]}
      />

      <ProFormDigit
        name="timeoutSec"
        label="超时时间(秒)"
        placeholder="请输入超时时间"
        min={1}
      />

      <ProFormDigit
        name="retryCount"
        label="重试次数"
        placeholder="请输入重试次数"
        min={0}
      />

      <ProFormText
        name="notifyEmail"
        label="通知邮箱"
        placeholder="请输入通知邮箱，多个邮箱用逗号分隔"
      />

      <ProFormSwitch
        name="isDepend"
        label="是否有依赖"
      />

      <ProFormSwitch
        name="isActive"
        label="是否激活"
      />
    </ModalForm>
  );
};

export default EditJobModal; 