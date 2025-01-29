import React from 'react';
import { DatePicker } from 'antd';

const { RangePicker } = DatePicker;

function DateRangeSelector({ onDateChange, dateRange }) {
  return (
    <div>
      <RangePicker
        value={dateRange}
        onChange={onDateChange}
      />
    </div>
  );
}

export default DateRangeSelector; 