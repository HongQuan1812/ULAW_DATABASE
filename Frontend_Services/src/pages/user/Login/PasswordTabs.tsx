import React from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import styles from './index.less';

interface PasswordTabsProps {
  activeKey?: string;
  onTabChange?: (key: string) => void;
}

const PasswordTabs: React.FC<PasswordTabsProps> = ({ activeKey, onTabChange }) => {
  const items: TabsProps['items'] = [
    {
      key: 'forgot',
      label: 'Cấp lại mật khẩu',
      children: <Tabs.TabPane key="forgot" />,
    },
  ];

  return (
    <Tabs activeKey={activeKey} onChange={onTabChange} className={styles.tabStyle} items={items} />
  );
};

export default PasswordTabs;
