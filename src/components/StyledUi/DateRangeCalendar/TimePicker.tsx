import TimeInput, { TimePickerValue } from 'react-time-picker';
import React, { useState } from 'react';

export const TimePicker = (): JSX.Element => {
  const [value, setValue] = useState<TimePickerValue>(new Date());
  return <TimeInput {...{ value, onChange: setValue }} />;
};
