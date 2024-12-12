// 3rd Party Libs
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { cloneDeep } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

// Components
import CreateEditAlertFlyout from './CreateEditAlertFlyout';
import { ButtonBar } from 'components/machine-health';
import { Button, Loader, Typography } from 'components';
import AlertList from './AlertList';
import AlertActionModal from './AlertActionModal';

// Helpers
import { getSupportedMachineAlertTriggerRules } from 'helpers/alerts';

// Types
import {
  AlertConfig,
  AlertConfigAlertLocation,
  AlertConfigTriggerRule,
  AlertConfigType,
  AlertConfigTypeDescription,
  AlertStateType
} from 'types/machine-health/alerts';

// Constants
import { toast } from 'react-toastify';

// Hooks
import { useLanguage } from 'providers';

// API
import {
  useGetAlertConfigsByMachineIdQuery,
  useUpdateAlertConfigMutation,
  usePatchAlertConfigMutation
} from 'api';

// Styling
const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding-left: 6rem;
  padding-right: 6rem;
  width: 100%;
`;

const StyledAlertListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: 2rem;
`;

const SUPPORTED_ALERT_TRIGGERS_SET: Set<AlertConfigType> = new Set(
  getSupportedMachineAlertTriggerRules()
);

const initialAlertMap: Record<AlertConfigType, AlertConfig[]> = {
  [AlertConfigType.MultiTrigger]: [],
  [AlertConfigType.SetPoint]: [],
  [AlertConfigType.Threshold]: [],
  [AlertConfigType.Boolean]: [],
  [AlertConfigType.DeviationFromMean]: []
};

// See type definition for descriptions of fields
const newAlertTemplate: AlertConfig = {
  id: undefined,
  machineId: undefined,
  name: undefined,
  description: '',
  importance: undefined,
  location: (Object.values(AlertConfigAlertLocation) as Array<AlertConfigAlertLocation>).map(
    (value) => value
  ),
  machineState: (Object.values(AlertStateType) as Array<AlertStateType>).map((value) => value),
  contacts: [],
  minimumOccurrences: 1,
  active: true,
  expunge: false,

  conditions: [
    {
      id: undefined,
      dataSourceType: 'tag',
      dataSource: undefined,
      triggerRule: AlertConfigType.SetPoint,
      triggerValueFormat: undefined,
      orangeAlertRangeUpper: undefined,
      orangeAlertRangeLower: undefined,
      redAlertRangeUpper: undefined,
      redAlertRangeLower: undefined,
      targetSetpoint: undefined,
      targetBoolean: undefined,
      timeframeOfMeanCalculation: undefined
    }
  ]
};

/**
 * This component is responsible for displaying the list of alerts by type
 * It is responsible for data fetching, and alert list state management
 * It handles the creation, editing, and deletion of alerts
 */

const Alerts = (): JSX.Element => {
  const theme = useTheme();
  const { t } = useTranslation(['mh']);
  const { machineId } = useParams<{ machineId: string }>();
  const { languageId } = useLanguage();

  const {
    data: alerts,
    error,
    isLoading
  } = useGetAlertConfigsByMachineIdQuery({ machineIds: [machineId], languageId });

  const [updateAlertConfig, { isLoading: isTogglingUpdateAlert }] = useUpdateAlertConfigMutation();
  const [patchAlertConfig, { isLoading: isPatchingAlert }] = usePatchAlertConfigMutation();

  const [alertLists, setAlertLists] = useState(initialAlertMap);
  const [alertToEdit, setAlertToEdit] = useState<AlertConfig | null>(null);
  const [isCreateAlertFlyoutOpen, setIsCreateAlertFlyoutOpen] = useState(false);
  const [alertToDelete, setAlertToDelete] = useState<AlertConfig | null>(null);

  // Build lists of alerts by type
  // store them in a map with the type as the key
  useEffect(() => {
    setAlertLists(
      [...(alerts ?? [])]
        .sort((a, b) => ((a.name ?? '') < (b.name ?? '') ? -1 : 1))
        .reduce((acc, alert) => {
          const alertTypes: Set<AlertConfigType> = (alert.conditions ?? []).reduce((accx, cond) => {
            if (cond?.triggerRule) {
              accx.add(cond.triggerRule);
            }
            return accx;
          }, new Set<AlertConfigType>());
          const alertType: AlertConfigType | undefined =
            alertTypes.size > 1 ? AlertConfigType.MultiTrigger : alert.conditions?.[0]?.triggerRule;
          if (!alertType) {
            return acc;
          }
          return {
            ...acc,
            [alertType]: [...acc[alertType], alert]
          };
        }, initialAlertMap)
    );
  }, [alerts]);

  const toggleAlert = async (alert: AlertConfig) => {
    if (!alert) {
      toast.error(t('could_not_toggle_alert'));
      return;
    }
    setAlertToEdit(alert);

    await updateAlertConfig({
      ...alert,
      active: !alert.active
    })
      .unwrap()
      .then((res) => {
        if (res) {
          toast.success(t('alert_toggled_successfully'));
        } else {
          toast.error(t('failed_to_toggle_alert'));
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error(t('failed_to_toggle_alert'));
      });

    setAlertToEdit(null);
  };

  const deleteAlert = async () => {
    const { id: alertId } = alertToDelete || {};

    if (!alertId) {
      toast.error(t('could_not_delete_alert'));
      return;
    }

    await patchAlertConfig({
      alert: { expunge: true }, // Anything we send here will be merged with the existing alert; we only want to update the expunge flag
      alertId
    })
      .unwrap()
      .then(() => toast.success(t('alert_deleted_successfully')))
      .catch((err) => {
        console.error(err);
        toast.error(t('failed_to_delete_alert'));
      });

    setAlertToDelete(null);
  };

  return (
    <StyledContainer>
      {isLoading && <Loader size={40} />}
      {error && <Typography color={theme.colors.darkRed}>{t('could_not_fetch_alerts')}</Typography>}
      {!isLoading && !error && (
        <>
          <ButtonBar columnGap="1.5rem" title="" padding="1.375rem 0">
            <Button
              onClick={() => {
                // need to give the condition a valid id
                const newAlert = cloneDeep(newAlertTemplate);
                const condition = newAlert.conditions?.[0] as AlertConfigTriggerRule;
                condition.id = uuidv4();
                setAlertToEdit(newAlert);
                setIsCreateAlertFlyoutOpen(true);
              }}
              variant="primary"
              width="fit-content"
            >
              {t('new_alert')}
            </Button>
          </ButtonBar>

          <StyledAlertListContainer>
            {/* Create a list card for each of the alert types */}
            {(Object.entries(alertLists) as [AlertConfigType, AlertConfig[]][])
              .filter(([key, alerts]) => SUPPORTED_ALERT_TRIGGERS_SET.has(key) || alerts.length > 0)
              .map(([key, alerts], i) => (
                <AlertList
                  alerts={alerts}
                  alertIdToEdit={alertToEdit?.id}
                  description={t(AlertConfigTypeDescription[key])}
                  isToggling={isTogglingUpdateAlert}
                  key={`alert-list-${i}`}
                  setAlertToDelete={setAlertToDelete}
                  setAlertToEdit={(alert) => {
                    setAlertToEdit(alert);
                    setIsCreateAlertFlyoutOpen(true);
                  }}
                  title={t(key)}
                  toggleAlert={toggleAlert}
                />
              ))
              .filter(Boolean)}
          </StyledAlertListContainer>

          <CreateEditAlertFlyout
            alertToEdit={alertToEdit}
            isOpen={isCreateAlertFlyoutOpen}
            onClose={() => {
              setAlertToEdit(null);
              setIsCreateAlertFlyoutOpen(false);
            }}
          />

          <AlertActionModal
            alert={alertToDelete}
            helperText={
              t('delete_alert_warning', {
                item: alertToDelete?.name || alertToDelete?.id
              }) as string
            }
            isDeleting={isPatchingAlert}
            isOpen={!!alertToDelete}
            onClose={() => setAlertToDelete(null)}
            onConfirm={deleteAlert}
            title={t('delete_alert')}
          />
        </>
      )}
    </StyledContainer>
  );
};

export default Alerts;
