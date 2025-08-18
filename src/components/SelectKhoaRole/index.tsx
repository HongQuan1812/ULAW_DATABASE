import React from 'react';
import { Select } from 'antd';

interface SelectKhoaRoleProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const SelectKhoaRole: React.FC<SelectKhoaRoleProps> = ({
  placeholder = 'Chọn Chức vụ',
  value,
  onChange,
}) => {
  return (
    <Select<string> placeholder={placeholder} value={value} onChange={onChange}>
      <Select.Option value="TK">Trưởng khoa</Select.Option>
      <Select.Option value="PTK">Phó Trưởng khoa</Select.Option>
      <Select.Option value="TBM">Trưởng bộ môn</Select.Option>
      <Select.Option value="PTBM">Phó Trưởng bộ môn</Select.Option>
      <Select.Option value="TLK">Trợ lý Khoa</Select.Option>
      <Select.Option value="GV">Giảng viên</Select.Option>
      <Select.Option value="CTV">Cộng tác viên</Select.Option>
    </Select>
  );
};

export default SelectKhoaRole;
