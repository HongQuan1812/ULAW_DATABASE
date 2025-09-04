import { Button, Result } from 'antd';
import { ResultStatusType } from 'antd/lib/result';
import React from 'react';
import { history } from 'umi';

type NoFoundPageProps = {
  status?: ResultStatusType;
  title?: string;
  subTitle?: string;
};

const NoFoundPage: React.FC<NoFoundPageProps> = ({}) => {
  const handleBackToHome = () => {
    history.push('/trangchu');
  };

  return (
    <Result
      status="403"
      title="Lỗi 403"
      subTitle="Bạn không có quyền xem trang này!"
      extra={
        <Button type="primary" onClick={handleBackToHome}>
          Quay về
        </Button>
      }
    />
  );
};

export default NoFoundPage;
