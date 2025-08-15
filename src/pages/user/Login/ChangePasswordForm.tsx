import React, { useState, useEffect } from 'react';
import { Typography, Descriptions } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { requestResetPassword } from '@/services/auth';
import { CustomMessageError, CustomMessageSuccess } from '@/components/CustomMessage/CustomMessage';
import styles from './index.less';

interface ChangePasswordFormProps {
  onFinish?: (values: any) => void;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ onFinish }) => {
  const [form] = ProForm.useForm();
  const [showPasswordNotice, setShowPasswordNotice] = useState<number | null>(null);

  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      form.setFieldsValue({ username: savedUsername });
    }
  }, []);

  const handleSubmit = async (values: any) => {
    try {
      const response = await requestResetPassword(values);

      if (response.code === 200) {
        CustomMessageSuccess({ content: response.message });
        form.resetFields();
        setShowPasswordNotice(null);
        if (onFinish) {
          onFinish(values);
        }
      } else {
        if (response.code === 400) {
          setShowPasswordNotice(400);
        } else if (response.code === 401) {
          setShowPasswordNotice(401);
        } else {
          setShowPasswordNotice(null);
        }
        CustomMessageError({ content: response.message });
      }
    } catch (error: any) {
      CustomMessageError({ content: 'Đổi mật khẩu thất bại!' });
      setShowPasswordNotice(null);
    }
  };

  return (
    <ProForm
      className={styles.formContainer}
      requiredMark={false}
      form={form}
      name="change_password"
      onFinish={handleSubmit}
      layout="vertical"
      submitter={{
        render: (_, dom) => (
          <>
            {(showPasswordNotice === 400 || showPasswordNotice === 401) && (
              <div style={{ marginBottom: '10px' }}>
                <div className={styles.resetPasswordErrorHeader}>
                  <Typography.Text className={styles.resetPasswordErrorTitle}>
                    Lưu ý về Mật khẩu:
                  </Typography.Text>
                </div>
                <div className={styles.resetPasswordErrorContainer}>
                  <Descriptions
                    bordered
                    size="small"
                    column={1}
                    labelStyle={{
                      backgroundColor: '#e6e6e6',
                      color: '#ff4d4f',
                      fontWeight: 'bold',
                    }}
                  >
                    <Descriptions.Item label="*">
                      <Typography.Text>Có ít nhất 8 ký tự</Typography.Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="*">
                      <Typography.Text>Có ít nhất 1 ký tự số</Typography.Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="*">
                      <Typography.Text>Có ít nhất 1 ký tự in hoa</Typography.Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="*">
                      <Typography.Text>Có ít nhất 1 ký tự đặc biệt</Typography.Text>
                    </Descriptions.Item>
                  </Descriptions>
                </div>
              </div>
            )}
            {dom.pop()}
          </>
        ),
        submitButtonProps: {
          style: { width: '328px', height: '40.15px', fontSize: '16px' },
        },
        searchConfig: {
          submitText: 'Xác nhận',
        },
      }}
    >
      <ProFormText
        name="username"
        disabled
        label={<Typography.Text strong>Tên đăng nhập</Typography.Text>}
        placeholder="Nhập Tên đăng nhập"
        fieldProps={{
          autoComplete: 'username',
          size: 'large',
          prefix: <UserOutlined />,
          style: { width: '328px', color: 'rgba(0, 0, 0, 0.25)' },
        }}
      />

      <ProFormText.Password
        name="currentPassword"
        label={
          <Typography.Text strong>
            <span style={{ color: 'red' }}>* </span>Mật khẩu hiện tại
          </Typography.Text>
        }
        placeholder="Nhập Mật khẩu hiện tại"
        fieldProps={{
          autoComplete: 'current-password',
          size: 'large',
          prefix: <LockOutlined />,
          style: { width: '328px' },
        }}
        rules={[
          {
            required: true,
            message: 'Vui lòng nhập Mật khẩu hiện tại',
          },
        ]}
      />

      <ProFormText.Password
        name="newPassword"
        label={
          <Typography.Text strong>
            <span style={{ color: 'red' }}>* </span>Mật khẩu mới
          </Typography.Text>
        }
        fieldProps={{
          autoComplete: 'new-password',
          size: 'large',
          prefix: <LockOutlined />,
          style: { width: '328px' },
        }}
        tooltip={{
          title: (
            <>
              <Typography.Text style={{ color: '#fff', fontSize: '12px' }}>
                *Có ít nhất 8 ký tự
              </Typography.Text>
              <br />
              <Typography.Text style={{ color: '#fff', fontSize: '12px' }}>
                *Có ít nhất 1 ký tự số
              </Typography.Text>
              <br />
              <Typography.Text style={{ color: '#fff', fontSize: '12px' }}>
                *Có ít nhất 1 ký tự in hoa
              </Typography.Text>
              <br />
              <Typography.Text style={{ color: '#fff', fontSize: '12px' }}>
                *Có ít nhất 1 ký tự đặc biệt
              </Typography.Text>
            </>
          ),
        }}
        rules={[
          {
            required: true,
            message: 'Vui lòng nhập Mật khẩu mới',
          },
        ]}
        placeholder="Nhập Mật khẩu mới"
      />

      <ProFormText.Password
        name="confirmNewPassword"
        label={
          <Typography.Text strong>
            <span style={{ color: 'red' }}>* </span>Xác nhận Mật khẩu mới
          </Typography.Text>
        }
        dependencies={['newPassword']}
        fieldProps={{
          autoComplete: 'new-password',
          size: 'large',
          prefix: <LockOutlined />,
          style: { width: '328px' },
          onPressEnter: () => {
            form.submit();
          },
        }}
        rules={[
          {
            required: true,
            message: 'Vui lòng Xác nhận Mật khẩu mới',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('newPassword') === value) {
                return Promise.resolve();
              }
              return Promise.reject('Xác nhận Mật khẩu mới không khớp');
            },
          }),
        ]}
        placeholder="Nhập Xác nhận Mật khẩu mới"
      />
    </ProForm>
  );
};

export default ChangePasswordForm;
