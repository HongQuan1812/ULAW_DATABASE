import { Button, Result } from 'antd';
import { ResultStatusType } from 'antd/lib/result';
import React from 'react';
import { history, useModel } from 'umi';

type NoFoundPageProps = {
  status?: ResultStatusType;
  title?: string;
  subTitle?: string;
};

const NoFoundPage: React.FC<NoFoundPageProps> = ({}) => {
  const { initialState } = useModel('@@initialState');
  const currentUserRole = initialState?.currentUser?.role;

  const handleBackToHome = () => {
    if (currentUserRole === 'adminPdt' || currentUserRole === 'adminSdh') {
      history.push('/quanly-hoso');
    } else {
      history.push('/trangchu');
    }
  };

  return (
    <Result
      status="404"
      title="Lỗi 404"
      subTitle="Trang bạn vừa tìm kiếm không tồn tại!"
      extra={
        <Button type="primary" onClick={handleBackToHome}>
          Quay về
        </Button>
      }
    />
  );
};

export default NoFoundPage;
