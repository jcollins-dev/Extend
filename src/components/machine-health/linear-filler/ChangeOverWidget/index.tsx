// 3rd party libs
import React, { ReactElement } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { faAngleRight, faCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

// Themes
import theme from 'themes';

// Components
import { Column, KPICard, Loader, Row, Typography } from 'components';
import { Cell, Row as CardRow } from 'components/KPICard/CardComponents';
import ThreeValueCard from 'components/KPICard/ThreeValueCard';
import { JBTRoutes } from 'constants/routes';
import { MachineAccountInfoQueryParams } from 'types/protein';
import { AsepticChangeoverType } from 'types/machine-health/aseptic';
import { formatDate } from 'helpers';
import { useTimeZone } from 'providers';

// Styling
const StyledIcon = styled(FontAwesomeIcon)`
  margin-top: 1rem;
  margin-right: -1rem;
  cursor: pointer;
`;
const StyledIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  border: 0.3125rem solid ${theme.colors.onTrackGreen3};
`;
const StyledHeader = styled.div`
  width: 100%;
  & div:first-of-type,
  h4 {
    line-height: 1.125rem;
    padding: 0;
    margin: 0;
    text-align: left;
  }
`;

const StyledStatus = styled(Typography)`
  margin-left: -0.9375rem;
`;
interface Props {
  currentChangeoverSummary: AsepticChangeoverType;
  isLoading?: boolean;
  error?: unknown;
  hideArrow?: boolean;
}

const ChangeOverWidget = ({
  currentChangeoverSummary,
  isLoading,
  hideArrow
}: Props): ReactElement => {
  // connect to api later,using mock now, type to be determined later when connecting to api
  const { machineId } = useParams<MachineAccountInfoQueryParams>();
  const history = useHistory();
  const { timeZone } = useTimeZone();
  const { t } = useTranslation(['mh']);
  const goto = (subRoute: string) => {
    const path = subRoute.replace(':machineId', machineId);
    history.push(path);
  };
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <KPICard
          height="20.738rem"
          component={
            <StyledHeader>
              <CardRow>
                <Cell>
                  <CardRow>
                    <Cell>
                      <Typography color="darkGrey" size="1rem" mb="0.625rem" weight="bold">
                        {t('changeover')}
                      </Typography>
                      <Row>
                        <Column size={1}>
                          <StyledIconContainer>
                            <FontAwesomeIcon
                              color={theme.colors.onTrackGreen}
                              icon={faCircle}
                              size="xs"
                            />
                          </StyledIconContainer>
                        </Column>
                        <Column size={11}>
                          <StyledStatus
                            color="onTrackGreen"
                            size="1.25rem"
                            weight="bold"
                            mb="0.3125rem"
                          >
                            {currentChangeoverSummary?.status}
                          </StyledStatus>
                        </Column>
                      </Row>
                    </Cell>
                  </CardRow>
                </Cell>
                <Cell />
                {!hideArrow && (
                  <StyledIcon
                    color={theme.colors.darkGrey}
                    icon={faAngleRight}
                    onClick={() => {
                      goto(JBTRoutes.machineHealthChangeOver);
                    }}
                  />
                )}
              </CardRow>
            </StyledHeader>
          }
        >
          <CardRow>
            <Cell>
              {' '}
              <ThreeValueCard
                value1={{
                  value: formatDate(
                    currentChangeoverSummary?.startDate +
                      'T' +
                      currentChangeoverSummary?.startTime +
                      '+00:00',
                    'numeric-date-time',
                    timeZone
                  ),
                  unit: 'Start Time',
                  color: theme.colors.darkGrey,
                  weight: 'bold',
                  mb: '0rem',
                  size: '1.3125rem'
                }}
                value2={{
                  value: currentChangeoverSummary?.previousRecipeDesc,
                  unit: 'Previous Part Number',
                  color: theme.colors.darkGrey,
                  weight: 'bold',
                  mb: '0rem',
                  size: '1.3125rem'
                }}
                value3={{
                  value: currentChangeoverSummary?.duration,
                  unit: 'Duration (h)',
                  color: theme.colors.darkGrey,
                  weight: 'bold',
                  mb: '0rem',
                  size: '1.3125rem'
                }}
              />
            </Cell>
          </CardRow>
        </KPICard>
      )}
    </>
  );
};

export default ChangeOverWidget;
