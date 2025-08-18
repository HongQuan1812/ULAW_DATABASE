import { useState, useEffect } from 'react';
import { Typography } from 'antd';
import { LoginForm } from '@ant-design/pro-form';
import AuthTabs from './AuthTabs';
import PasswordTabs from './PasswordTabs';
import styles from './index.less';
import LoginTabPane from './LoginTabPane';
import RegisterTabPane from './RegisterTabPane';
import ForgotTabPane from './ForgotTabPane';
import { history, useModel } from 'umi';
import { requestForgotPassword, requestLogin, requestRegister } from '@/services/auth';
import { CustomMessageError, CustomMessageSuccess } from '@/components/CustomMessage/CustomMessage';

const Login = () => {
  const [activeTabKey, setActiveTabKey] = useState<string>('login');
  const { setInitialState, refresh } = useModel('@@initialState');
  const userToken = window.localStorage.getItem('token');
  const storedUsername = window.localStorage.getItem('username');
  const storedFirstName = window.localStorage.getItem('firstname');
  const storedLastName = window.localStorage.getItem('lastname');
  const storedRole = window.localStorage.getItem('role');

  useEffect(() => {
    if (userToken && storedUsername && storedFirstName && storedLastName && storedRole) {
      if (storedRole === 'adminPdt' || storedRole === 'adminSdh') {
        history.push('/quanly-hoso');
      } else {
        history.push('/trangchu');
      }
    }
  }, []);

  const updateInitialStateAfterLogin = async (userData: any, token: string) => {
    await setInitialState((s) => ({
      ...s,
      currentUser: userData,
      token: token,
    }));
  };

  const getSubmitText = () => {
    switch (activeTabKey) {
      case 'login':
        return 'Đăng nhập';
      case 'register':
        return 'Đăng ký';
      case 'forgot':
        return 'Gửi yêu cầu';
      default:
        return 'Xác nhận';
    }
  };

  const handleToggleTabGroup = () => {
    if (activeTabKey === 'login' || activeTabKey === 'register') {
      setActiveTabKey('forgot');
    } else {
      setActiveTabKey('login');
    }
  };

  const handleClickLogin = async (values: any) => {
    try {
      const response = await requestLogin(values.username, values.password);
      if (response.code !== 200) {
        CustomMessageError({ content: response.message });
      } else if (response.code === 200) {
        window.localStorage.setItem('token', response.data.token);
        window.localStorage.setItem('username', response.data.username);
        window.localStorage.setItem('firstname', response.data.firstName);
        window.localStorage.setItem('lastname', response.data.lastName);
        window.localStorage.setItem('role', response.data.role);

        await refresh();
        CustomMessageSuccess({ content: response.message });
        await updateInitialStateAfterLogin(response.data, response.data.token);

        if (response.data.role === 'adminPdt' || response.data.role === 'adminSdh') {
          history.push('/quanly-hoso');
        } else {
          history.push('/trangchu');
        }
      } else {
        CustomMessageError({ content: response.message });
      }
    } catch (error: any) {
      CustomMessageError({ content: 'Lỗi đăng nhập!' });
    }
  };

  const handleClickRegister = async (values: any) => {
    try {
      const response = await requestRegister(values);
      if (response.code !== 200) {
        CustomMessageError({ content: response.message });
      } else if (response.code === 200) {
        CustomMessageSuccess({ content: response.message });
        setActiveTabKey('login');
      } else {
        CustomMessageError({ content: response.message });
      }
    } catch (error: any) {
      CustomMessageError({ content: 'Lỗi đăng ký!' });
    }
  };

  const handleClickForgotPassword = async (values: any) => {
    try {
      const response = await requestForgotPassword(values.email);
      if (response.code === 200) {
        CustomMessageSuccess({ content: response.message });
        setActiveTabKey('login');
      } else {
        CustomMessageError({ content: response.message });
      }
    } catch (error: any) {
      CustomMessageError({ content: 'Lỗi gửi yêu cầu!' });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          className={styles.formContainer}
          requiredMark={false}
          logo={
            <img
              alt="logo"
              src="/ulaw_logo.png"
              style={{ verticalAlign: '-webkit-baseline-middle' }}
            />
          }
          title="BÁO CÁO SỐ LIỆU"
          onFinish={async (values) => {
            switch (activeTabKey) {
              case 'login':
                await handleClickLogin(values);
                break;
              case 'register':
                await handleClickRegister(values);
                break;
              case 'forgot':
                await handleClickForgotPassword(values);
                break;
              default:
                CustomMessageError({ content: 'Chức năng không được hỗ trợ cho tab này.' });
                break;
            }
          }}
          submitter={{
            searchConfig: {
              submitText: getSubmitText(),
            },
          }}
        >
          {(activeTabKey === 'login' || activeTabKey === 'register') && (
            <AuthTabs activeKey={activeTabKey} onTabChange={setActiveTabKey} />
          )}
          {activeTabKey === 'forgot' && (
            <PasswordTabs activeKey={activeTabKey} onTabChange={setActiveTabKey} />
          )}

          {activeTabKey === 'login' && <LoginTabPane />}
          {activeTabKey === 'register' && <RegisterTabPane />}
          {activeTabKey === 'forgot' && <ForgotTabPane />}

          <div className={styles.textChangeTabs}>
            {activeTabKey === 'login' && (
              <Typography.Link onClick={handleToggleTabGroup}>Quên mật khẩu?</Typography.Link>
            )}
            {activeTabKey === 'forgot' && (
              <Typography.Link onClick={handleToggleTabGroup}>
                Quay lại Đăng nhập/Đăng ký
              </Typography.Link>
            )}
          </div>
        </LoginForm>
      </div>
    </div>
  );
};

export default Login;
