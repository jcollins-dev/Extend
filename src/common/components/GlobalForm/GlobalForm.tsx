import React, { useState } from 'react';
import { GlobalFormContainer } from './GlobalForm.elements';
import { InputGroup, InputGroupProps } from './InputGroup';
import { validateReqiuredFields } from './helpers/validators';

export interface GlobalFormPropsHandle {
  cancel?: () => void;
  submit?: (x: Record<string, unknown>) => void;
}

export interface GlobalFormProps {
  title?: string;
  formFields?: InputGroupProps[];
  formGroups?: InputGroupProps[][];
  handle?: GlobalFormPropsHandle;
}

export const GlobalForm = ({
  title,
  formFields,
  formGroups,
  handle
}: GlobalFormProps): JSX.Element => {
  const [errors, setErrors] = useState<Record<string, string> | undefined>(undefined);

  // return early if missing fields
  if (!formFields && !formGroups)
    return (
      <div className="global-form global-form--error">
        error loading form: missing `formFields` or `formGroups`
      </div>
    );

  // set the submit handler
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // prevent default submit action, this keeps page from refreshing on submit
    e.preventDefault();
    // lets count the number of errors keys to see if we have any
    const errorCounter = Object.keys(errors || {}).length;
    // return early if we know there are errors
    if (errorCounter) return alert('there are errors');
    // this gets us a list of required fields to make sure everything is sumbmitted that is supposed to be
    const requiredFields = formFields?.reduce((acc: string[], { name, isRequired }) => {
      if (isRequired) acc.push(name as string);
      return acc;
    }, []);
    // make a new FormData object from this form, this will end up being a normal JS object
    // that we're used to working with.
    // this is much more efficient than using states and updating values on every change
    const formData = Object.fromEntries(new FormData(e.currentTarget));
    // lets make sure at least all the required fields are filled out before we submit
    const missingFields = validateReqiuredFields(formData, requiredFields);
    // we're going to double validate this form before submitting
    // first check to make sure all required fields are filled out

    if (missingFields.length) {
      const newErrors: Record<string, string> = {};
      missingFields.forEach((field) => (newErrors[field] = 'required'));
      return setErrors(newErrors);
    } else {
      if (errors) setErrors(undefined);
      return alert('all good');
    }
  };

  const handleSetErrors = (key: string, val?: string) => {
    // start new obj to manipulate
    let newErrors = { ...errors };
    // check if there is an error being set or removed
    if (!val || val === '') delete newErrors[key];
    else newErrors = { ...newErrors, [key]: val };
    // set the new errors, if any
    return setErrors(newErrors);
  };

  return (
    <GlobalFormContainer className="global-form" onSubmit={handleSubmit}>
      {errors && <div> this form has errors</div>}
      {title && <h2 className="global-form__title">{title}</h2>}

      <div className="global-form__inputs">
        {
          // display formFields in one col
          formFields &&
            formFields.map((field: InputGroupProps) => (
              <InputGroup
                key={field.name}
                {...{
                  error: errors?.[field.name],
                  setError: (val?: string) => handleSetErrors(field.name, val),
                  ...field
                }}
              />
            ))
        }

        {
          /// display formFields in groups
          // this is not in use yet
          formGroups &&
            formGroups.map((formFieldGroup: InputGroupProps[], i: number) => (
              <div
                key={`inputGroup${i}`}
                className={`global-form__input-group global-form__input-group--${i}`}
              >
                {formFieldGroup.map((field: InputGroupProps) => (
                  <InputGroup key={field.name} {...field} />
                ))}
              </div>
            ))
        }
      </div>

      {
        // only show the buttons if there are handlers
        handle && (
          <div className="global-form__buttons">
            <input className="form-button" type="submit" value="Submit" />
            {handle?.cancel && (
              <button
                type="button"
                onClick={() => handle?.cancel?.()}
                className="form-button form-button--cancel"
              >
                Cancel
              </button>
            )}
          </div>
        )
      }
    </GlobalFormContainer>
  );
};
