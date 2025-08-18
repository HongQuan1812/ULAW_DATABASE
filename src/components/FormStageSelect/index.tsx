import React from 'react';
import { Select } from 'antd';

interface FormStageSelectProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const FormStageSelect: React.FC<FormStageSelectProps> = ({
  placeholder = 'Chọn giai đoạn',
  value,
  onChange,
}) => {
  return (
    <Select<string> placeholder={placeholder} value={value} onChange={onChange}>
      <Select.Option value="firstStage">Giai đoạn 1 (từ 01/01 đến 30/06 hàng năm)</Select.Option>
      <Select.Option value="secondStage">Giai đoạn 2 (từ 01/07 đến 31/12 hàng năm)</Select.Option>
    </Select>
  );
};

export default FormStageSelect;
