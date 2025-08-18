import RightContent from '@/components/RightContent';
import defaultSettings from '../config/defaultSettings';
import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig } from 'umi';
import NoFoundPage from './pages/403';
//import Footer from '@/components/Footer';
import styles from '@/components/RightContent/index.less';

export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: any;
  token?: string | null;
  loading?: boolean;
  fetchUserInfo?: () => Promise<any | undefined>;
}> {
  const mockUser = {
    username: 'demoUser',
    firstName: 'Demo',
    lastName: 'User',
    role: 'adminPdt',
  };

  return {
    fetchUserInfo: async () => mockUser,
    currentUser: mockUser,
    token: 'mock-token-123',
    settings: defaultSettings,
  };
}

export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    //footerRender: () => <Footer />,
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
