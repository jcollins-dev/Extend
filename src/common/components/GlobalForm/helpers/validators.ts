export const validateReqiuredFields = (
  formData: Record<string, unknown>,
  requiredFields?: string[]
): string[] => {
  // setup missing fields array to pass back if there are any missing
  const missingFields: string[] = [];
  // return early if no require fields are found
  if (!requiredFields) return missingFields;
  // loop through the required fields and compare against formData to see what's missing
  requiredFields.forEach((name) => {
    if (!formData[name] || formData[name] === '') missingFields.push(name);
  });
  // return the missing fields
  return missingFields;
};

export interface FieldValidatorsProps {
  // the type of pre-made validator to use
  // you can add to this
  type: string;
  // the value of the field or object key
  value?: string | number;
  // if the validator needs a higher than value
  highVal?: number;
  // if the validator needs a lower than value
  lowVal?: number;
  // if the validator needs an equal to value
  equalVal?: number;
  // a custom message if you don't want the defaults
  message?: string;
}

export const getFieldError = (type: string, options?: FieldValidatorsProps): string | undefined => {
  const value = options?.value;
  const message = options?.message;

  switch (type) {
    case 'isRequired': {
      if (!value || value === '') return message || 'Required field';
      return undefined;
    }

    case 'isEmail': {
      // only run if there is a value
      if (value) {
        const validEmail = /^\S+@\S+\.\S+$/.test(String(value));
        if (!validEmail) return message || 'Please Enter a Valid Email Address';
      }
      return undefined;
    }

    default:
      return undefined;
  }
};
