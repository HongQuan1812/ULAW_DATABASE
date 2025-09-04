import { ProFormText } from '@ant-design/pro-form';
import { IdcardOutlined, PhoneOutlined, UserOutlined, GoogleOutlined } from '@ant-design/icons';
import { Typography } from 'antd';

const RegisterTabPane = () => {
  const fullNameRegex =
    /^[a-zA-ZaAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ\s]+$/;
  return (
    <>
      <ProFormText
        name="lastName"
        label={
          <Typography.Text strong>
            <span style={{ color: 'red' }}>* </span>Họ và tên đệm
          </Typography.Text>
        }
        placeholder="Nhập Họ và tên đệm"
        fieldProps={{
          size: 'large',
          prefix: <IdcardOutlined />,
        }}
        tooltip={
          <div>
            <Typography.Text style={{ color: '#fff', fontSize: '12px' }}>
              * Phải có ít nhất 1 ký tự
            </Typography.Text>
            <br />
            <Typography.Text style={{ color: '#fff', fontSize: '12px' }}>
              * Chỉ được nhập chữ cái và khoảng trắng
            </Typography.Text>
            <br />
            <Typography.Text style={{ color: '#fff', fontSize: '12px' }}>
              * Không được vượt quá 50 ký tự
            </Typography.Text>
          </div>
        }
        rules={[
          {
            required: true,
            message: 'Vui lòng nhập Họ và tên đệm',
          },
          {
            min: 1,
            message: 'Họ và tên đệm chứa ít nhất 1 ký tự',
          },
          {
            pattern: fullNameRegex,
            message: 'Họ và tên đệm chỉ được chứa chữ cái và khoảng trắng',
          },
          {
            max: 50,
            message: 'Họ và tên đệm không quá 50 ký tự',
          },
        ]}
      />
      <ProFormText
        name="firstName"
        label={
          <Typography.Text strong>
            <span style={{ color: 'red' }}>* </span>Tên
          </Typography.Text>
        }
        placeholder="Nhập Tên"
        fieldProps={{
          size: 'large',
          prefix: <IdcardOutlined />,
        }}
        tooltip={
          <>
            <Typography.Text style={{ color: '#fff', fontSize: '12px' }}>
              * Phải có ít nhất 1 ký tự
            </Typography.Text>
            <br />
            <Typography.Text style={{ color: '#fff', fontSize: '12px' }}>
              * Chỉ được nhập chữ cái và khoảng trắng
            </Typography.Text>
            <br />
            <Typography.Text style={{ color: '#fff', fontSize: '12px' }}>
              * Không được vượt quá 50 ký tự
            </Typography.Text>
          </>
        }
        rules={[
          {
            required: true,
            message: 'Vui lòng nhập Tên',
          },
          {
            min: 1,
            message: 'Tên chứa ít nhất 1 ký tự',
          },
          {
            pattern: fullNameRegex,
            message: 'Tên chỉ được chứa chữ cái và khoảng trắng',
          },
          {
            max: 50,
            message: 'Tên không quá 50 ký tự',
          },
        ]}
      />
      <ProFormText
        name="phoneNumber"
        label={
          <Typography.Text strong>
            <span style={{ color: 'red' }}>* </span>Số điện thoại
          </Typography.Text>
        }
        placeholder="Nhập Số điện thoại"
        required
        fieldProps={{
          size: 'large',
          prefix: <PhoneOutlined />,
        }}
        tooltip={
          <>
            <Typography.Text style={{ color: '#fff', fontSize: '12px' }}>
              * Chỉ được nhập số
            </Typography.Text>
            <br />
            <Typography.Text style={{ color: '#fff', fontSize: '12px' }}>
              * Phải nhập chính xác và đủ 10 số
            </Typography.Text>
          </>
        }
        rules={[
          {
            validator: (_, value) => {
              const phoneReg = /((0[3|5|7|8|9])+([0-9]{8})\b)/;
              if (value === undefined || !value || value.length === 0) {
                return Promise.reject('Vui lòng nhập Số điện thoại');
              } else if (value.length > 11) {
                return Promise.reject('Số điện thoại không hợp lệ');
              } else if (!phoneReg.test(value)) {
                return Promise.reject('Số điện thoại không hợp lệ');
              }
              return Promise.resolve();
            },
          },
        ]}
      />
      <ProFormText
        name="username"
        label={
          <Typography.Text strong>
            <span style={{ color: 'red' }}>* </span>Tên đăng nhập
          </Typography.Text>
        }
        placeholder="Nhập Tên đăng nhập"
        fieldProps={{
          size: 'large',
          prefix: <UserOutlined />,
        }}
        tooltip={
          <>
            <Typography.Text style={{ color: '#fff', fontSize: '12px' }}>
              * Phải có ít nhất 3 ký tự
            </Typography.Text>
            <br />
            <Typography.Text style={{ color: '#fff', fontSize: '12px' }}>
              * Không được vượt quá 50 ký tự
            </Typography.Text>
          </>
        }
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
      <ProFormText
        name="email"
        label={
          <Typography.Text strong>
            <span style={{ color: 'red' }}>* </span>Email
          </Typography.Text>
        }
        placeholder="Nhập Email"
        fieldProps={{
          size: 'large',
          prefix: <GoogleOutlined />,
        }}
        tooltip={
          <>
            <Typography.Text style={{ color: '#fff', fontSize: '12px' }}>
              {'* Phải nhập đúng định dạng Email, ví dụ:'}
            </Typography.Text>
            <br />
            <Typography.Text style={{ color: '#fff', fontSize: '12px' }}>
              {'- '}
              <i>{'abc@example.com'}</i>
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
    </>
  );
};

export default RegisterTabPane;
