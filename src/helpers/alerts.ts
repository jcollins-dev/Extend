import { AlertConfigType } from 'types/machine-health/alerts';

const DEFAULT_ALERT_TRIGGERS = 'set_point';
const CONFIGURED_ALERT_TRIGGERS =
  process.env.REACT_APP_ALERT_CREATOR_SUPPORTED_TRIGGERS ?? DEFAULT_ALERT_TRIGGERS;

export const getSupportedMachineAlertTriggerRules = (
  triggers: string = CONFIGURED_ALERT_TRIGGERS
): AlertConfigType[] => triggers.split(',').map((trigger) => trigger as AlertConfigType);
