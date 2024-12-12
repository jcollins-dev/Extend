import React, { useEffect } from 'react';
import styled from 'styled-components';

const NewInput = styled.input`
  border: none;
  outline: none;
  padding: 0.2rem;
  fontsize: 1rem;
  border-bottom: 1px solid grey;
`;
const DebounceInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>): JSX.Element => {
  const [value, setValue] = React.useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);
  return <NewInput {...props} value={value} onChange={(e) => setValue(e.target.value)} />;
};

export default DebounceInput;
