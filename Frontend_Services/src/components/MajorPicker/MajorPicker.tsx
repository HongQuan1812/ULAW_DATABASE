import React, { useState, useEffect, useMemo } from 'react';
import { Select, Row, Col, Typography, Empty } from 'antd';
import { MajorData } from '@/services/data_info';

interface MajorPickerProps {
  majors: MajorData[];
  title?: boolean;
  defaultValue?: any;
  value?: { majorCode?: number; subjectGroupCode?: string };
  onChange?: (value: { majorCode?: number; subjectGroupCode?: string }) => void;
}

const MajorPicker: React.FC<MajorPickerProps> = ({
  majors,
  value,
  title,
  defaultValue,
  onChange,
}) => {
  const [selectedMajorCode, setSelectedMajorCode] = useState<number | undefined>(value?.majorCode);
  const [selectedSubjectGroupCode, setSelectedSubjectGroupCode] = useState<string | undefined>(
    value?.subjectGroupCode,
  );

  const availableSubjectGroups = useMemo(() => {
    const selectedMajor = majors.find((m) => m.code === selectedMajorCode);
    return selectedMajor?.subjectGroup || [];
  }, [selectedMajorCode, majors]);

  useEffect(() => {
    if (value?.majorCode !== selectedMajorCode) {
      setSelectedMajorCode(value?.majorCode);
    }
    if (value?.subjectGroupCode !== selectedSubjectGroupCode) {
      setSelectedSubjectGroupCode(value?.subjectGroupCode);
    }
  }, [value]);

  useEffect(() => {
    if (majors.length === 0) {
      triggerChange(undefined, undefined);
      return;
    }

    const selectedMajor = majors.find((m) => m.code === selectedMajorCode);

    if (!selectedMajor || !selectedMajor.subjectGroup || selectedMajor.subjectGroup.length === 0) {
      if (selectedSubjectGroupCode !== undefined) {
        setSelectedSubjectGroupCode(undefined);
        triggerChange(selectedMajorCode, undefined);
      }
    } else {
      const isCurrentSubjectGroupValid = availableSubjectGroups.some(
        (sg) => sg.code === selectedSubjectGroupCode,
      );
      if (selectedSubjectGroupCode && !isCurrentSubjectGroupValid) {
        setSelectedSubjectGroupCode(undefined);
        triggerChange(selectedMajorCode, undefined);
      }
    }
  }, [selectedMajorCode, majors, selectedSubjectGroupCode]);

  const triggerChange = (newMajorCode?: number, newSubjectGroupCode?: string) => {
    if (newMajorCode !== value?.majorCode || newSubjectGroupCode !== value?.subjectGroupCode) {
      onChange?.({ majorCode: newMajorCode, subjectGroupCode: newSubjectGroupCode });
    }
  };

  const handleMajorChange = (code: number) => {
    setSelectedMajorCode(code);
    setSelectedSubjectGroupCode(undefined);
    triggerChange(code, undefined);
  };

  const handleSubjectGroupChange = (code: string) => {
    setSelectedSubjectGroupCode(code);
    triggerChange(selectedMajorCode, code);
  };

  return (
    <>
      {title ? (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
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
          <Col xs={24} md={12}>
            <Typography.Text strong>
              <span style={{ color: 'red' }}>* </span>Tổ hợp môn
            </Typography.Text>{' '}
            <br></br>
            <Select
              style={{ marginTop: '10px' }}
              placeholder="Chọn Tổ hợp môn"
              value={selectedSubjectGroupCode}
              onChange={handleSubjectGroupChange}
              disabled={!selectedMajorCode || availableSubjectGroups.length === 0}
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
              {availableSubjectGroups.map((group) => (
                <Select.Option key={group.code} value={group.code}>
                  {group.name}
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>
      ) : (
        <Select
          defaultValue={defaultValue}
          style={{ marginTop: '10px' }}
          placeholder="Chọn Tổ hợp môn"
          value={selectedSubjectGroupCode}
          onChange={handleSubjectGroupChange}
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
          {availableSubjectGroups.map((group) => (
            <Select.Option key={group.code} value={group.code}>
              {group.name}
            </Select.Option>
          ))}
        </Select>
      )}
    </>
  );
};

export default MajorPicker;
