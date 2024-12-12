// 3rd Party Libs
import React from 'react';
import styled, { useTheme } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

// Components
import { DashboardWidget, Loader, Switch, Typography } from 'components';

// Types
import { AlertConfig } from 'types/machine-health/alerts';
import { AlertsTableDropdownItem } from 'types/machine-health/widget-table';

// Styling
const StyledListWrapper = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 0;
  padding: 1rem 1rem;
`;

const StyledListItem = styled.li`
  align-items: center;
  display: flex;
  gap: 1rem;
`;

const StyledButtonContainer = styled.div<{ width: string }>`
  display: flex;
  font-size: 0.85rem;
  gap: 1rem;
  width: ${({ width }) => width};

  & > svg {
    cursor: pointer;
    transition: color 0.2s ease-in-out;

    &:hover {
      color: ${({ theme }) => theme.colors.mediumBlue};
    }
  }
`;

const StyledTextWrapper = styled.div`
  width: 50%;
`;

const StyledSpacer = styled.div<{ width: string }>`
  width: ${({ width }) => width};
`;

interface Props {
  alerts: AlertConfig[];
  alertIdToEdit: string | undefined;
  description: string;
  isToggling: boolean;
  setAlertToDelete: (alert: AlertConfig) => void;
  setAlertToEdit: (alert: AlertConfig) => void;
  title: string;
  toggleAlert: (alert: AlertConfig) => void;
}

/**
 * This component is used to display a list of alerts.
 * It displays a card with a title, description, and a list of alerts.
 * Each alert has a toggle switch, name, tag, and edit and delete buttons.
 * @param alerts - the alerts to display
 * @param alertIdToEdit - the alert being edited
 * @param description - the description to display in the tooltip
 * @param isToggling - whether or not an alert is toggling
 * @param setAlertToDelete - the function to call when the delete button is clicked
 * @param setAlertToEdit - the function to call when the edit button is clicked
 * @param title - the title of the card
 * @param toggleAlert - the function to call when the toggle switch is clicked
 */

const AlertList = ({
  alerts,
  alertIdToEdit,
  description,
  isToggling,
  setAlertToDelete,
  setAlertToEdit,
  toggleAlert,
  title
}: Props): JSX.Element => {
  const theme = useTheme();
  const { t } = useTranslation(['mh']);
  return (
    <DashboardWidget
      linksToPathTooltipContent={description}
      showIconHelper
      title={title}
      tooltipProperties={{
        placement: 'left'
      }}
    >
      <StyledListWrapper>
        {alerts.length === 0 ? (
          <Typography color={theme.colors.mediumGrey2}>{t('no_alerts_configured')}</Typography>
        ) : (
          <StyledListItem>
            <StyledSpacer width="2rem" />
            <StyledTextWrapper>
              <Typography color={theme.colors.darkGrey} mb={0} variant="body1">
                {t('alert_name_title')}
              </Typography>
            </StyledTextWrapper>
            <StyledTextWrapper>
              <Typography color={theme.colors.darkGrey} mb={0} variant="body1">
                {t('alert_data_source')}
              </Typography>
            </StyledTextWrapper>
            <StyledSpacer width="3rem" />
          </StyledListItem>
        )}
        {alerts.map((alert) => {
          const typedTags: AlertsTableDropdownItem[] = Object.values(
            (alert.conditions ?? []).reduce((acc, cond) => {
              if (cond?.dataSource) {
                acc[cond.dataSource.id] = cond.dataSource;
              }
              return acc;
            }, {} as { [id: string]: AlertsTableDropdownItem })
          );
          return (
            <StyledListItem key={alert.id}>
              <StyledButtonContainer width="2rem">
                {isToggling && alertIdToEdit === alert.id ? (
                  <Loader size={12} margin={0} />
                ) : (
                  <Switch
                    checked={!!alert.active}
                    handleDiameter={12}
                    height={6}
                    offColor={theme.colors.mediumGrey2}
                    offHandleColor={theme.colors.mediumGrey3}
                    onChange={() => toggleAlert(alert)}
                    width={20}
                  />
                )}
              </StyledButtonContainer>
              <StyledTextWrapper>
                <Typography color={theme.colors.darkGrey} mb={0}>
                  {alert.name}
                </Typography>
              </StyledTextWrapper>
              <StyledTextWrapper>
                <Typography color={theme.colors.darkGrey} mb={0}>
                  {typedTags.map((typedTag) => typedTag.friendlyName ?? typedTag.id).join(',')}
                </Typography>
              </StyledTextWrapper>
              <StyledButtonContainer width="3rem">
                <FontAwesomeIcon icon={faPen} onClick={() => setAlertToEdit(alert)} />
                <FontAwesomeIcon icon={faTrashCan} onClick={() => setAlertToDelete(alert)} />
              </StyledButtonContainer>
            </StyledListItem>
          );
        })}
      </StyledListWrapper>
    </DashboardWidget>
  );
};

export default AlertList;
