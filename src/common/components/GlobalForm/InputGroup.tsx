import React, { ChangeEvent } from 'react';
import { InputGroupContainer } from './InputGroup.elements';
import { FieldValidatorsProps, getFieldError } from './helpers/validators';
import { MultiRangeSlider } from './MultiRangeSlider';

export interface InputGroupProps {
  name: string;
  label?: string;
  type?: string;
  error?: string;
  helper?: string;
  value?: unknown;
  isRequired?: boolean;
  isDisabled?: boolean;
  setError?: (x?: string) => void;
  validator?: FieldValidatorsProps;
  min?: number;
  max?: number;
}

const handlers = (
  type: 'change' | 'blur' | 'focus',
  e: ChangeEvent<HTMLInputElement>,
  options?: {
    error?: string | undefined;
    isRequired?: boolean;
    setError?: (x?: string) => void;
    validator?: FieldValidatorsProps;
  }
) => {
  let value: string | undefined = e.target.value;
  if (value === '') value = undefined;

  const reqCheck = () => {
    // check if required
    if (options?.isRequired) {
      // check for value
      if (!value) return options?.setError?.('required');
      // check for error and clear if needed
      if (options?.error === 'required') return options?.setError?.(undefined);
    }
  };

  const validate = () => {
    // check if this field should be validated
    if (options?.validator) {
      // run the validator to get errors
      const fieldError = getFieldError(options.validator.type, { value, ...options.validator });
      // there is a problem with this field, set the error
      if (fieldError) return options?.setError?.(fieldError);
      // this field is valid, clear the error
      else if (options?.error) return options?.setError?.(undefined);
    }
  };

  switch (type) {
    case 'change': {
      // first check if required
      // we want to clear this if the user has started typing
      // or back spaces out of an error
      reqCheck();
      // we'll only run the validator if there is an error set and the error is not the 'required' error
      // this way, we're only revalidating on input and not every time the user types
      // this prevents an error from showing up before a user is done filling out this field
      // but will clear the error the moment the user fixes the error in the field
      if (options?.error && options?.error !== 'required') validate();
      return undefined;
    }
    // settings this up later
    case 'blur': {
      // first check if required
      reqCheck();
      // check for validator, we do this on blur to prevent errors from showing up before the user has a chance to fill out the field
      validate();
      return undefined;
    }
    // settings this up later
    case 'focus': {
      return undefined;
    }
    // for TS
    default: {
      return console.log('error not set');
    }
  }
};

export const InputGroup = ({
  name,
  label,
  value,
  type,
  error,
  setError,
  helper,
  isRequired,
  isDisabled,
  validator,
  min,
  max
}: InputGroupProps): JSX.Element => {
  // set the default input type to 'text'
  type = type || 'text';
  // set the default class name then add modifiers based on settings
  let className = `input-group input-group--${type} input-group--${name}`;
  // add error className if there is an error
  if (error) className += ' has-error';
  // just make it easier to call the handlers from the input
  const handle = (type: 'change' | 'blur' | 'focus', e: ChangeEvent<HTMLInputElement>) =>
    handlers(type, e, { error, setError, isRequired, validator });

  return (
    <InputGroupContainer className={className}>
      {label && (
        <label htmlFor={name}>
          {isRequired && <span className="input-group__required-mark">* </span>}
          {label}
        </label>
      )}
      {type === 'minMaxSlider' ? (
        <MultiRangeSlider {...{ name, min: min || 0, max: max || 100 }} />
      ) : (
        <input
          autoComplete="off"
          type={type}
          id={name}
          name={name}
          className="input-group__input-field"
          onChange={(e) => handle('change', e)}
          onBlur={(e) => handle('blur', e)}
          onFocus={(e) => handle('focus', e)}
          disabled={isDisabled}
          //@ts-expect-error: input can be any value - string or number
          value={value}
        />
      )}
      {helper && !error && (
        <div className="input-group__message input-group__message--helper">{helper}</div>
      )}
      {error && <div className="input-group__message input-group__message--error">{error}</div>}
    </InputGroupContainer>
  );
};
