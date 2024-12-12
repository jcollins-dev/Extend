import { AlertConfig, AlertConfigType } from 'types/machine-health/alerts';
import {
  AlertValidationConfig,
  CONDITION_VALIDATION_OBJECT,
  VALIDATION_OBJECT
} from './FormElementsTypes';
import { cloneDeep } from 'lodash';
import { TFunction } from 'i18next';

interface ValidationFormReturn {
  isValid: boolean;
  validationObject: AlertValidationConfig;
  errorMsg: string;
}

interface Args {
  form: AlertConfig | null;
  t: TFunction<('mh' | 'common')[], undefined>;
}

export const handleFormValidation = ({ form, t }: Args): ValidationFormReturn => {
  const copyValidationObject = cloneDeep(VALIDATION_OBJECT);

  // need to add conditions for to validation if # conditions > 1
  if (form?.conditions && form.conditions.length > 1) {
    for (let i = 1; i < form.conditions.length; i++) {
      copyValidationObject.conditions.push({ ...CONDITION_VALIDATION_OBJECT });
    }
  }

  const response = {
    isValid: true,
    validationObject: copyValidationObject,
    errorMsg: ''
  } as ValidationFormReturn;

  if (!form) {
    response.isValid = false;
    response.errorMsg = t('error_fill_out_each_field');
    return response;
  }

  // Check for common properties
  if (!form['machineState'] || (form['machineState'] && form['machineState'].length === 0)) {
    copyValidationObject['machineState'] = false;
    response.isValid = false;
  } else {
    copyValidationObject['machineState'] = true;
  }

  if (!form['importance']) {
    copyValidationObject['importance'] = false;
    response.isValid = false;
  } else {
    copyValidationObject['importance'] = true;
  }

  if (!form['location'] || (form['location'] && form['location'].length === 0)) {
    copyValidationObject['location'] = false;
    response.isValid = false;
  } else {
    copyValidationObject['location'] = true;
  }

  if (!form['minimumOccurrences']) {
    copyValidationObject['minimumOccurrences'] = false;
    response.isValid = false;
  } else {
    copyValidationObject['minimumOccurrences'] = true;
  }

  if (!form['name']) {
    copyValidationObject['name'] = false;
    response.isValid = false;
  } else {
    copyValidationObject['name'] = true;
  }

  if (!form['description']) {
    copyValidationObject['description'] = false;
    response.isValid = false;
  } else {
    copyValidationObject['description'] = true;
  }

  if (form?.conditions) {
    for (let idx = 0; idx < form.conditions.length; idx++) {
      const cond = form.conditions[idx];
      const vcond = copyValidationObject.conditions[idx];
      if (!cond.dataSource) {
        vcond.dataSource = false;
        response.isValid = false;
      } else {
        vcond.dataSource = true;
      }
      if (!cond.triggerRule) {
        vcond.triggerRule = false;
        response.isValid = false;
      } else {
        vcond.triggerRule = true;
      }
      // Trigger Rule: Boolean
      if (cond.triggerRule == AlertConfigType.Boolean) {
        if (!cond.targetBoolean) {
          vcond.targetBoolean = false;
          response.isValid = false;
        } else {
          vcond.targetBoolean = true;
        }

        if (!cond.booleanAlertColor) {
          vcond.booleanAlertColor = false;
          response.isValid = false;
        } else {
          vcond.booleanAlertColor = true;
        }

        continue; // done with this condition
      }

      const isThreshold = cond.triggerRule == AlertConfigType.Threshold;
      const isSetPoint = cond.triggerRule == AlertConfigType.SetPoint;

      if (isThreshold || isSetPoint) {
        // ORANGE ALERT
        const redUpper = cond.redAlertRangeUpper;
        const redLower = cond.redAlertRangeLower;
        const orangerUpper = cond.orangeAlertRangeUpper;
        const orangerLower = cond.orangeAlertRangeLower;

        if (orangerUpper === undefined) {
          vcond.orangeAlertRangeUpper = false;
          response.isValid = false;
        } else {
          vcond.orangeAlertRangeUpper = true;
        }

        if (orangerLower === undefined) {
          vcond.orangeAlertRangeLower = false;
          response.isValid = false;
        } else {
          vcond.orangeAlertRangeLower = true;
        }

        // RED ALERT
        if (redLower === undefined) {
          vcond.redAlertRangeLower = false;
          response.isValid = false;
        } else {
          vcond.redAlertRangeLower = true;
        }

        if (redUpper === undefined) {
          vcond.redAlertRangeUpper = false;
          response.isValid = false;
        } else {
          vcond.redAlertRangeUpper = true;
        }

        if (orangerLower && redLower && Number(redLower) <= Number(orangerLower)) {
          vcond.redAlertRangeLower = false;
          vcond.orangeAlertRangeLower = false;
          response.isValid = false;
          response.errorMsg = t('address_outstanding_issues', { ns: ['mh'] });
        }

        if (orangerUpper && redUpper && Number(redUpper) <= Number(orangerUpper)) {
          vcond.redAlertRangeUpper = false;
          vcond.orangeAlertRangeUpper = false;
          response.isValid = false;
          response.errorMsg = t('address_outstanding_issues', { ns: ['mh'] });
        }
      }

      // Trigger Rule: Threshold
      if (isThreshold) {
        continue; // done with this condition
      }

      // Trigger Rule: DeviationFromMean
      if (cond.triggerRule == AlertConfigType.DeviationFromMean) {
        if (!cond.orangeAlertDeviationFromMean) {
          vcond.orangeAlertDeviationFromMean = false;
          response.isValid = false;
          continue; // done with this condition
        } else {
          vcond.orangeAlertDeviationFromMean = true;
        }

        if (!cond.redAlertDeviationFromMean) {
          vcond.redAlertDeviationFromMean = false;
          response.isValid = false;
          continue; // done with this condition
        } else {
          vcond.redAlertDeviationFromMean = true;
        }

        if (cond.orangeAlertDeviationFromMean >= cond.redAlertDeviationFromMean) {
          vcond.orangeAlertDeviationFromMean = false;
          vcond.redAlertDeviationFromMean = false;
          response.isValid = false;
          response.errorMsg = t('address_outstanding_issues', { ns: ['mh'] });
        }

        continue; // done with this condition
      }

      if (!cond.triggerValueFormat) {
        vcond.triggerValueFormat = false;
        response.isValid = false;
      } else {
        vcond.triggerValueFormat = true;
      }

      if (!cond.targetSetpoint) {
        vcond.targetSetpoint = false;
        response.isValid = false;
      } else {
        vcond.targetSetpoint = true;
      }
    }
  }

  response.validationObject = copyValidationObject;
  return response;
};
