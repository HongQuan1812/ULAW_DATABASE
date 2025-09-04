import { ProFormText } from '@ant-design/pro-form';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Typography } from 'antd';

const LoginTabPane = () => {
  return (
    <>
      <ProFormText
        name="username"
        label={
          <Typography.Text strong>
            <span style={{ color: 'red' }}>* </span>Tên đăng nhập
          </Typography.Text>
        }
        placeholder="Nhập Tên đăng nhập"
        fieldProps={{
          autoComplete: 'username',
          size: 'large',
          prefix: <UserOutlined />,
        }}
        rules={[
          {
            required: true,
            message: 'Vui lòng nhập Tên đăng nhập',
          },
          {
            min: 3,
            message: 'Tên đăng nhập phải có ít nhất 3 ký tự',
          },
          {
            max: 50,
            message: 'Tên đăng nhập không quá 50 ký tự',
          },
        ]}
      />
      <ProFormText.Password
        name="password"
        label={
          <Typography.Text strong>
            <span style={{ color: 'red' }}>* </span>Mật khẩu
          </Typography.Text>
        }
        placeholder="Nhập Mật khẩu"
        fieldProps={{
          autoComplete: 'current-password',
          size: 'large',
          prefix: <LockOutlined />,
        }}
        rules={[
          {
            required: true,
            message: 'Vui lòng nhập Mật khẩu',
          },
        ]}
      />
    </>
  );
};

export default LoginTabPane;
