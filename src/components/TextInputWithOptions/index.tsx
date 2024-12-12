// 3rd party
import React, { InputHTMLAttributes, ReactElement, useState } from 'react';

// Components
import { Input } from 'components';

// Types
import { ChangeEvent } from 'types';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  elementId: string;
  options?: string[];
  onValueChange?: (value: string | undefined) => void;
}

const TextInputWithOptions = ({
  elementId,
  options,
  onValueChange,
  ...inputProps
}: Props): ReactElement => {
  const [value, setValue] = useState<string>();

  const updateValue = (newVal: string | undefined) => {
    setValue(newVal);
    if (onValueChange) onValueChange(newVal);
  };

  return (
    <>
      <Input
        value={value !== undefined ? value : ''}
        list={elementId}
        onChange={(event: ChangeEvent) =>
          event.target.value === '' ? updateValue(undefined) : updateValue(event.target.value)
        }
        {...inputProps}
      />
      {options && options.length > 0 && (
        <datalist id={elementId}>
          {options
            .filter((option) => {
              return value === undefined ? true : option.includes(value);
            })
            .map((option, i) => (
              <option key={i}>{option}</option>
            ))}
        </datalist>
      )}
    </>
  );
};

export default TextInputWithOptions;
