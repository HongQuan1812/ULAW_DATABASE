import { Avatar, Space, Modal } from 'antd';
import { useCallback, useState } from 'react';
import { FormattedMessage, history, useModel } from 'umi';
import {
  LockOutlined,
  LogoutOutlined,
  UserOutlined,
  IdcardOutlined,
  DownOutlined,
} from '@ant-design/icons';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import type { MenuInfo } from 'rc-menu/lib/interface';
import ChangePasswordForm from '@/pages/user/Login/ChangePasswordForm';
import { ItemType } from 'antd/lib/menu/hooks/useItems';

const AvatarDropdown = () => {
  const { setInitialState, initialState } = useModel('@@initialState');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const loginOut = async () => {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('username');
    window.localStorage.removeItem('firstname');
    window.localStorage.removeItem('lastname');
    window.localStorage.removeItem('role');
    setInitialState((s) => ({ ...s, currentUser: undefined, token: undefined }));
    history.push('/user/login');
  };

  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      if (key === 'logout') {
        loginOut();
        return;
      }
      if (key === 'changePassword') {
        setIsModalVisible(true);
        return;
      }
      if (key === 'user') {
        history.push('/thongtin-canhan');
        return;
      }
    },
    [setInitialState],
  );

  const MenuItems: ItemType[] = [];

  if (initialState?.currentUser?.role === 'user') {
    MenuItems.push({
      key: 'user',
      icon: (
        <>
          <Avatar size="small" style={{ backgroundColor: 'color' }}>
            <IdcardOutlined style={{ width: '14px', color: 'black' }} />
          </Avatar>
          <span style={{ paddingLeft: '5px' }}>
            <FormattedMessage id="menu.account.avatar.info" defaultMessage="Thông tin cá nhân" />
          </span>
        </>
      ),
    });
  }

  MenuItems.push({
    key: 'changePassword',
    icon: (
      <>
        <Avatar size="small" style={{ backgroundColor: 'color' }}>
          <LockOutlined style={{ width: '14px', color: 'black' }} />
        </Avatar>
        <span style={{ paddingLeft: '5px' }}>
          <FormattedMessage id="menu.account.avatar.changePassword" defaultMessage="Đổi mật khẩu" />
        </span>
      </>
    ),
  });

  MenuItems.push({
    key: 'logout',
    icon: (
      <>
        <Avatar size="small" style={{ backgroundColor: 'color' }}>
          <LogoutOutlined style={{ width: '14px', color: 'black' }} />
        </Avatar>
        <span style={{ paddingLeft: '5px' }}>
          <FormattedMessage id="menu.account.avatar.logout" defaultMessage="Đăng xuất" />
        </span>
      </>
    ),
  });

  MenuItems.unshift({
    key: 'user-info',
    type: 'group',
    label: (
      <>
        <div className={styles.userInfoName}>
          {initialState?.currentUser?.lastName} {initialState?.currentUser?.firstName}
        </div>
        <div className={styles.userInfoEmail}>{initialState?.currentUser?.email}</div>
        <hr className={styles.menuNoSpacing}></hr>
      </>
    ),
  });

  const menuHeaderDropdown = {
    items: MenuItems,
    onClick: onMenuClick,
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handlePasswordChangeSuccess = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <HeaderDropdown menu={menuHeaderDropdown}>
        <Space className={`${styles.action} ${styles.account}`}>
          <Avatar
            size={30}
            className={styles.avatar}
            icon={<UserOutlined style={{ color: 'black' }} />}
            style={{ cursor: 'pointer' }}
          />
          <span className={styles.userInfoDropdown}>
            {initialState?.currentUser?.lastName} {initialState?.currentUser?.firstName}{' '}
            <DownOutlined className={styles.dropdownIcon} style={{ color: 'rgba(0,0,0,1)' }} />
          </span>
        </Space>
      </HeaderDropdown>
      <Modal
        className={styles.modalChangePassword}
        title="Đổi mật khẩu"
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        destroyOnClose={true}
        width={380}
      >
        <ChangePasswordForm onFinish={handlePasswordChangeSuccess} />
      </Modal>
    </>
  );
};

export default AvatarDropdown;
