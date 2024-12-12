// Third Party
import React from 'react';
import styled, { useTheme } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGear,
  faScrewdriverWrench,
  faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

// Components
import { Loader, Typography, Card } from 'components';

// Helpers
import { stringOrLoadingText } from 'helpers';

// Types
import { AlertCriticality, AlertType, AlertTypeLabel } from 'types/machine-health/alerts';

// Theme
import theme from 'themes';

interface AlertDetailCardProps {
  description?: string;
  subcomponent?: string;
  importance?: AlertCriticality;
  alertId?: string;
  isLoading: boolean;
  alertType?: AlertType;
}

export const Table = styled.table<{ mb?: string }>`
  width: 100%;
  margin-bottom: ${({ mb }) => mb || '0'};

  td {
    padding: 0.5rem 0;

    &:first-child {
      width: 33%;
    }
  }
`;
interface CriticalityIconProps {
  criticality?: AlertCriticality;
}

const CriticalityIconContainer = styled.div<CriticalityIconProps>`
  padding: 1rem;
  justify-content: center;
  vertical-align: middle;
  align-items: center;
  border-radius: 0.25rem;
  background: ${theme.colors.alertCriticalityColors[AlertCriticality.Medium]};
`;
interface ImportanceIndicatorProps {
  active: boolean;
}

const ImportanceIndicator = styled.span<ImportanceIndicatorProps>`
  height: 0.75rem;
  width: 0.75rem;
  border-radius: 1rem;
  background: ${({ theme, active }) =>
    active ? theme.colors.darkGrey2 : theme.colors.mediumGrey1};
`;

const ImportanceIndicatorContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 0.3rem;
  gap: 0.1rem;
`;

const AlertDetailCard = ({
  description,
  subcomponent,
  importance,
  alertId,
  isLoading,
  alertType
}: AlertDetailCardProps): JSX.Element => {
  const theme = useTheme();
  const { t } = useTranslation(['mh', 'common']);

  const getIcon = () => {
    switch (true) {
      case alertType === AlertType.Operations:
        return faGear;

      case alertType === AlertType.Maintenance:
        return faScrewdriverWrench;

      default:
        return faTriangleExclamation;
    }
  };

  return (
    <Card>
      <Card.Header>
        <CriticalityIconContainer criticality={importance}>
          <FontAwesomeIcon
            size="lg"
            icon={getIcon()}
            color={theme.colors.alertCriticalityIconFillColors[AlertCriticality.Medium]}
          />
        </CriticalityIconContainer>
      </Card.Header>
      <Card.Body pt={0}>
        <Typography as="h3" mb={0} size="1.125rem" weight="bold">
          {stringOrLoadingText(
            description,
            isLoading,
            t('description', { ns: 'common' }) as string
          )}
        </Typography>
        {isLoading && <Loader size={40} />}
        {!isLoading && (
          <Table>
            <tbody>
              {alertType && (
                <tr>
                  <td>
                    <Typography as="span" size="0.75rem">
                      {t('alert_type')}:
                    </Typography>
                  </td>
                  <td>
                    <Typography as="span" size="0.75rem">
                      {AlertTypeLabel[alertType]}
                    </Typography>
                  </td>
                </tr>
              )}
              <tr>
                <td>
                  <Typography as="span" size="0.75rem">
                    {t('sub_component')}:
                  </Typography>
                </td>
                <td>
                  <Typography as="span" size="0.75rem">
                    {stringOrLoadingText(subcomponent, isLoading, 'Subcomponent')}
                  </Typography>
                </td>
              </tr>
              <tr>
                <td>
                  <Typography as="span" size="0.75rem">
                    {t('importance')}:
                  </Typography>
                </td>
                <td>
                  <ImportanceIndicatorContainer>
                    <ImportanceIndicator active={true} />
                    <ImportanceIndicator
                      active={
                        importance === AlertCriticality.Medium ||
                        importance === AlertCriticality.High
                      }
                    />
                    <ImportanceIndicator active={importance === AlertCriticality.High} />
                  </ImportanceIndicatorContainer>
                </td>
              </tr>
              <tr>
                <td>
                  <Typography as="span" size="0.75rem">
                    {t('id', { ns: 'common' })}:
                  </Typography>
                </td>
                <td>
                  <Typography as="span" size="0.75rem">
                    {alertId}
                  </Typography>
                </td>
              </tr>
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
};

export default AlertDetailCard;
