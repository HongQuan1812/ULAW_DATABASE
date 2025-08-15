import React, { useState, useEffect, useMemo } from 'react';
import { Select, Typography, Row, Col, Empty } from 'antd';
import { ProvinceData } from '@/services/enroll';

interface ProvincePickerProps {
  title?: string;
  provinces: ProvinceData[];
  value?: { provinceCode?: string; wardCode?: string };
  onChange?: (value: { provinceCode?: string; wardCode?: string }) => void;
}

const ProvincePicker: React.FC<ProvincePickerProps> = ({ title, provinces, value, onChange }) => {
  const [selectedProvinceCode, setSelectedProvinceCode] = useState<string | undefined>(
    value?.provinceCode,
  );
  const [selectedWardCode, setSelectedWardCode] = useState<string | undefined>(value?.wardCode);

  const availableWard = useMemo(() => {
    const selectedProvince = provinces.find((p) => p.code == selectedProvinceCode);
    return selectedProvince?.wards || [];
  }, [selectedProvinceCode, provinces]);

  useEffect(() => {
    if (value?.provinceCode !== selectedProvinceCode) {
      setSelectedProvinceCode(value?.provinceCode);
    }
    if (value?.wardCode !== selectedWardCode) {
      setSelectedWardCode(value?.wardCode);
    }
  }, [value]);

  useEffect(() => {
    if (provinces.length === 0) {
      triggerChange(undefined, undefined);
      return;
    }

    const selectedProvince = provinces.find((p) => p.code === selectedProvinceCode);

    if (!selectedProvince || !selectedProvince.wards || selectedProvince.wards.length === 0) {
      if (selectedWardCode !== undefined) {
        setSelectedWardCode(undefined);
        triggerChange(selectedProvinceCode, undefined);
      }
    } else {
      const isCurrentWardValid = availableWard.some((w) => w.code === selectedWardCode);
      if (selectedWardCode && !isCurrentWardValid) {
        setSelectedWardCode(undefined);
        triggerChange(selectedProvinceCode, undefined);
      }
    }
  }, [selectedProvinceCode, provinces, selectedWardCode]);

  const triggerChange = (newProvinceCode?: string, newWardCode?: string) => {
    if (newProvinceCode !== value?.provinceCode || newWardCode !== value?.wardCode) {
      onChange?.({ provinceCode: newProvinceCode, wardCode: newWardCode });
    }
  };

  const handleProvinceChange = (code: string) => {
    setSelectedProvinceCode(code);
    setSelectedWardCode(undefined);
    triggerChange(code, undefined);
  };

  const handleWardChange = (code: string) => {
    setSelectedWardCode(code);
    triggerChange(selectedProvinceCode, code);
  };

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={12}>
        {title === 'THPT' ? (
          <>
            <Typography.Text strong>
              <span style={{ color: 'red' }}>* </span>Tỉnh/Thành phố THPT
            </Typography.Text>{' '}
          </>
        ) : (
          <>
            <Typography.Text strong>
              <span style={{ color: 'red' }}>* </span>Tỉnh/Thành phố
            </Typography.Text>{' '}
          </>
        )}
        <br></br>
        <Select
          style={{ marginTop: '10px' }}
          placeholder={title === 'THPT' ? 'Chọn Tỉnh/Thành phố THPT' : 'Chọn Tỉnh/Thành phố'}
          value={selectedProvinceCode}
          onChange={handleProvinceChange}
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) => {
            return String(option?.children ?? '')
              .toLowerCase()
              .includes(input.toLowerCase());
          }}
          notFoundContent={
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Không có dữ liệu"
              imageStyle={{ height: 30 }}
              style={{ margin: 0 }}
            />
          }
          className="w-full"
        >
          {provinces.map((province) => (
            <Select.Option key={province.code} value={province.code}>
              {province.name}
            </Select.Option>
          ))}
        </Select>
      </Col>
      <Col xs={24} md={12}>
        {title === 'THPT' ? (
          <>
            <Typography.Text strong>
              <span style={{ color: 'red' }}>* </span>Phường/Xã THPT
            </Typography.Text>{' '}
          </>
        ) : (
          <>
            <Typography.Text strong>
              <span style={{ color: 'red' }}>* </span>Phường/Xã
            </Typography.Text>{' '}
          </>
        )}
        <br></br>
        <Select
          style={{ marginTop: '10px' }}
          placeholder={title === 'THPT' ? 'Chọn Phường/Xã THPT' : 'Chọn Phường/Xã'}
          value={selectedWardCode}
          onChange={handleWardChange}
          disabled={!selectedProvinceCode || availableWard.length === 0}
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) => {
            return String(option?.children ?? '')
              .toLowerCase()
              .includes(input.toLowerCase());
          }}
          notFoundContent={
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Không có dữ liệu"
              imageStyle={{ height: 30 }}
              style={{ margin: 0 }}
            />
          }
          className="w-full"
        >
          {availableWard.map((ward) => (
            <Select.Option key={ward.code} value={ward.code}>
              {ward.name}
            </Select.Option>
          ))}
        </Select>
      </Col>
    </Row>
  );
};

export default ProvincePicker;
