import React from 'react';
import { Select } from 'antd';

interface FormDateSelectProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  startYear?: number;
  endYear?: number;
}

const FormDateSelect: React.FC<FormDateSelectProps> = ({
  placeholder = 'Chọn năm',
  value,
  onChange,
  startYear = 2020,
}) => {
  const today = new Date();
  const currentYear = today.getFullYear();

  const isLastDayOfYear = today.getMonth() === 11 && today.getDate() === 31;

  const endYear = isLastDayOfYear ? currentYear + 1 : currentYear;

  const years: string[] = [];
  for (let y = startYear; y <= endYear; y++) {
    years.push(y.toString());
  }

  return (
    <Select placeholder={placeholder} value={value} onChange={onChange}>
      {years.map((year) => (
        <Select.Option key={year} value={year.toString()}>
          {year}
        </Select.Option>
      ))}
    </Select>
  );
};

export default FormDateSelect;
