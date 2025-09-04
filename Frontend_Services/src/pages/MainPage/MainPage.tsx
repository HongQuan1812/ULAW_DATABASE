import { useState } from 'react';
import { Segmented } from 'antd';
import PhongTrungtamCard from '@/components/CardOption/PhongTrungtamCard';
import VienCard from '@/components/CardOption/VienCard';
import VanphongCard from '@/components/CardOption/VanphongCard';
import KhoaCard from '@/components/CardOption/KhoaCard';
import styles from './index.less';
import {
  AppstoreOutlined,
  BankOutlined,
  ClusterOutlined,
  DeploymentUnitOutlined,
} from '@ant-design/icons';

const MainPage = () => {
  const [value, setValue] = useState<any>('phong-trung-tam');

  const options = [
    {
      label: (
        <div
          style={{
            color: value === 'phong-trung-tam' ? '#14489f' : 'inherit',
            fontWeight: value === 'phong-trung-tam' ? 'bold' : 'normal',
          }}
        >
          <ClusterOutlined style={{ marginRight: 5 }} />
          Phòng - Trung tâm
        </div>
      ),
      value: 'phong-trung-tam',
    },
    {
      label: (
        <div
          style={{
            color: value === 'vien' ? 'rgb(44, 79, 98)' : 'inherit',
            fontWeight: value === 'vien' ? 'bold' : 'normal',
          }}
        >
          <DeploymentUnitOutlined style={{ marginRight: 5 }} />
          Viện
        </div>
      ),
      value: 'vien',
    },
    {
      label: (
        <div
          style={{
            color: value === 'van-phong' ? 'rgb(114, 46, 209)' : 'inherit',
            fontWeight: value === 'van-phong' ? 'bold' : 'normal',
          }}
        >
          <BankOutlined style={{ marginRight: 5 }} />
          Văn phòng
        </div>
      ),
      value: 'van-phong',
    },
    {
      label: (
        <div
          style={{
            color: value === 'khoa' ? 'rgb(220, 85, 57)' : 'inherit',
            fontWeight: value === 'khoa' ? 'bold' : 'normal',
          }}
        >
          <AppstoreOutlined style={{ marginRight: 5 }} />
          Khoa
        </div>
      ),
      value: 'khoa',
    },
  ];

  const renderCardComponent = () => {
    switch (value) {
      case 'phong-trung-tam':
        return <PhongTrungtamCard />;
      case 'vien':
        return <VienCard />;
      case 'van-phong':
        return <VanphongCard />;
      case 'khoa':
        return <KhoaCard />;
      default:
        return null;
    }
  };

  return (
    <>
      <Segmented
        options={options}
        value={value}
        onChange={setValue}
        block
        className={styles.segmentedContainer}
      />
      <div style={{ marginTop: 20 }}>{renderCardComponent()}</div>
    </>
  );
};

export default MainPage;
