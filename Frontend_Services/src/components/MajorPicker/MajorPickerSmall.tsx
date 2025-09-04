import React, { useState, useEffect } from 'react';
import { Select, Row, Col, Typography, Empty } from 'antd';
import { MajorData } from '@/services/data_info';

interface MajorPickerSmallProps {
  majors: MajorData[];
  title?: boolean;
  defaultValue?: any;
  value?: { majorCode?: number };
  onChange?: (value: { majorCode?: number }) => void;
}

const MajorPickerSmall: React.FC<MajorPickerSmallProps> = ({
  majors,
  value,
  title,
  defaultValue,
  onChange,
}) => {
  const [selectedMajorCode, setSelectedMajorCode] = useState<number | undefined>(value?.majorCode);

  useEffect(() => {
    if (value?.majorCode !== selectedMajorCode) {
      setSelectedMajorCode(value?.majorCode);
    }
  }, [value, selectedMajorCode]);
  const triggerChange = (newMajorCode?: number) => {
    if (newMajorCode !== value?.majorCode) {
      onChange?.({ majorCode: newMajorCode });
    }
  };

  const handleMajorChange = (code: number) => {
    setSelectedMajorCode(code);
    triggerChange(code);
  };

  return (
    <>
      {title ? (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={24}>
            <Typography.Text strong>
              <span style={{ color: 'red' }}>* </span>Ngành đăng ký
            </Typography.Text>{' '}
            <br></br>
            <Select
              style={{ marginTop: '10px' }}
              placeholder="Chọn Ngành"
              value={selectedMajorCode}
              onChange={handleMajorChange}
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
              {majors.map((major) => (
                <Select.Option key={major.code} value={major.code}>
                  {major.name}
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>
      ) : (
        <Select
          defaultValue={defaultValue}
          style={{ marginTop: '10px' }}
          placeholder="Chọn Ngành"
          value={selectedMajorCode}
          onChange={handleMajorChange}
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
          {majors.map((major) => (
            <Select.Option key={major.code} value={major.code}>
              {major.name}
            </Select.Option>
          ))}
        </Select>
      )}
    </>
  );
};

export default MajorPickerSmall;
