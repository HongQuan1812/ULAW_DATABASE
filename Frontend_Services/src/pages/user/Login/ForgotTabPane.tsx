import { ProFormText } from '@ant-design/pro-form';
import { GoogleOutlined } from '@ant-design/icons';
import { Typography } from 'antd';

const ForgotTabPane = () => {
  return (
    <ProFormText
      name="email"
      label={
        <Typography.Text strong>
          <span style={{ color: 'red' }}>* </span>Email
        </Typography.Text>
      }
      placeholder="Nhập Email"
      fieldProps={{
        autoComplete: 'email',
        size: 'large',
        prefix: <GoogleOutlined />,
      }}
      tooltip={
        <>
          <Typography.Text style={{ color: '#fff', fontSize: '12px' }}>
            1. Nhập Email đã đăng ký khi tạo tài khoản
          </Typography.Text>
          <br />
          <Typography.Text style={{ color: '#fff', fontSize: '12px' }}>
            2. Mật khẩu mới sẽ gửi vào Email đã nhập
          </Typography.Text>
        </>
      }
      rules={[
        {
          required: true,
          message: 'Vui lòng nhập Email',
        },
        {
          type: 'email',
          message: 'Vui lòng nhập đúng định dạng Email',
        },
      ]}
    />
  );
};

export default ForgotTabPane;
