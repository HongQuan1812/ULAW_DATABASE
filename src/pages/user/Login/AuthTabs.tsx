import React from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import styles from './index.less';

interface AuthTabsProps {
  activeKey?: string;
  onTabChange?: (key: string) => void;
}

const AuthTabs: React.FC<AuthTabsProps> = ({ activeKey, onTabChange }) => {
  const items: TabsProps['items'] = [
    {
      key: 'login',
      label: 'Đăng nhập hệ thống',
      children: <Tabs.TabPane key="login" />,
    },
    {
      key: 'register',
      label: 'Đăng ký tài khoản',
      children: <Tabs.TabPane key="register" />,
    },
  ];

  return (
    <Tabs activeKey={activeKey} onChange={onTabChange} className={styles.tabStyle} items={items} />
  );
};

export default AuthTabs;
