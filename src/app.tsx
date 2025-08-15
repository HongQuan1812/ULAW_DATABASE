import { history } from 'umi';
import RightContent from '@/components/RightContent';
import defaultSettings from '../config/defaultSettings';
import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig } from 'umi';
import { fetchUserInfo as queryCurrentUser, UserInfoResponse } from './services/auth';
import NoFoundPage from './pages/403';
import Footer from '@/components/Footer';
import styles from '@/components/RightContent/index.less';

const loginPath = '/user/login';

export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: UserInfoResponse['data'];
  token?: string | null;
  loading?: boolean;
  fetchUserInfo?: () => Promise<UserInfoResponse['data'] | undefined>;
}> {
  const userToken = window.localStorage.getItem('token');
  const currentPath = history.location.pathname;
  const storedFirstName = window.localStorage.getItem('firstname');
  const storedLastName = window.localStorage.getItem('lastname');
  const storedUsername = window.localStorage.getItem('username');
  const storedRole = window.localStorage.getItem('role');

  if (!userToken || !storedFirstName || !storedLastName || !storedUsername || !storedRole) {
    if (history.location.pathname !== loginPath) {
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('username');
      window.localStorage.removeItem('firstname');
      window.localStorage.removeItem('lastname');
      window.localStorage.removeItem('role');
      history.replace(loginPath);
    }
    return {
      fetchUserInfo: async () => undefined,
      currentUser: undefined,
      token: null,
      settings: defaultSettings,
    };
  }

  const fetchCurrentUserDetails = async (): Promise<UserInfoResponse['data'] | undefined> => {
    try {
      const response = await queryCurrentUser(userToken);
      const backendUser = response?.data;

      if (response.code !== 200 || !backendUser || !backendUser.role) {
        window.localStorage.clear();
        if (currentPath !== loginPath) {
          history.push(loginPath);
        }
        return undefined;
      }

      const currentUserData: UserInfoResponse['data'] = {
        ...backendUser,
      };

      return currentUserData;
    } catch (error) {
      window.localStorage.clear();
      if (currentPath !== loginPath) {
        history.push(loginPath);
      }
      return undefined;
    }
  };

  const currentUser = await fetchCurrentUserDetails();
  if (userToken && currentPath === loginPath) {
    if (currentUser?.role === 'adminPdt' || currentUser?.role === 'adminSdh') {
      history.push('/quanly-hoso');
    } else {
      history.push('/trangchu');
    }
    return {
      fetchUserInfo: fetchCurrentUserDetails,
      currentUser,
      token: userToken,
      settings: defaultSettings,
    };
  }

  return {
    fetchUserInfo: fetchCurrentUserDetails,
    currentUser,
    token: userToken,
    settings: defaultSettings,
  };
}

export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    footerRender: () => <Footer />,
    unAccessible: <NoFoundPage />,
    headerContentRender: () => (
      <div className={styles.headerLeft}>
        <img src="/gra_pic.png" alt="Ulaw Logo" className={styles.headerLogo} />
        <span className={styles.headerTitle}>TRƯỜNG ĐẠI HỌC LUẬT THÀNH PHỐ HỒ CHÍ MINH</span>
      </div>
    ),

    childrenRender: (children, props) => {
      return (
        <>
          {children}
          {!props.location?.pathname?.includes('/user/login')}
        </>
      );
    },
    ...initialState?.settings,
  };
};
