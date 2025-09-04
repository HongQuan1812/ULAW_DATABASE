import React from 'react';
import { Select } from 'antd';

interface SelectVPRoleProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const SelectVPRole: React.FC<SelectVPRoleProps> = ({
  placeholder = 'Chọn chức vụ',
  value,
  onChange,
}) => {
  return (
    <Select<string> placeholder={placeholder} value={value} onChange={onChange}>
      <Select.Option value="TP">Trưởng phòng</Select.Option>
      <Select.Option value="PTP">Phó Trưởng phòng</Select.Option>
      <Select.Option value="CV">Chuyên viên</Select.Option>
      <Select.Option value="CTV">Cộng tác viên</Select.Option>
    </Select>
  );
};

export default SelectVPRole;
