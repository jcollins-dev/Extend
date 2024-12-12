// 3rd party libs
import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

// Components
import { Cell, Row as CardRow } from 'components/KPICard/CardComponents';
import { Column, KPICard, Row, Typography, Loader } from 'components';

// Theme
import theme from 'themes';

import useMachineHealthKpi from 'hooks/useMachineHealthKpi';
import { AsepticMachineHealthInterval, AsepticMachineHealthType } from 'types/machine-health';
import { Unit } from 'types/machine-health/aseptic';

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

const StyledIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
`;

const StyledStatus = styled(Typography)`
  margin-left: -0.9375rem;
`;

const ThroughputKPICard = (): ReactElement => {
  const { machineHealth: resultThroughput, isLoading: isLoadingThroughput } = useMachineHealthKpi(
    AsepticMachineHealthType.Throughput,
    AsepticMachineHealthInterval.Last8Hours,
    false
  );
  const { t } = useTranslation(['mh']);
  const throughputData: Unit[] = [];
  let throughputStatusValue = 0;

  resultThroughput?.map((item) =>
    item.id != 'overall_percent'
      ? throughputData.push({
          id: item.id,
          tag: item.id,
          value: {
            value: item.value.value
          },
          unit: item.unit
        })
      : (throughputStatusValue = item.value.value)
  );

  return (
    <>
      <KPICard
        height="12.5rem"
        component={
          <StyledHeader>
            <CardRow>
              <Cell>
                <CardRow>
                  <Cell>
                    <Typography color="darkGrey" size="1rem" mb="0.625rem" weight="bold">
                      {t('throughput_efficiency')}
                    </Typography>
                    {isLoadingThroughput ? (
                      <Loader size={20} margin={0} />
                    ) : (
                      <Row>
                        <Column size={1}>
                          <StyledIconContainer />
                        </Column>
                        <Column size={11}>
                          <StyledStatus
                            color={theme.colors.darkGrey}
                            size="1.25rem"
                            weight="bold"
                            mb="0.3125rem"
                          >
                            {throughputStatusValue.toLocaleString().concat('%')}
                          </StyledStatus>
                        </Column>
                      </Row>
                    )}
                  </Cell>
                </CardRow>
              </Cell>
              <Cell />
            </CardRow>
          </StyledHeader>
        }
      >
        <CardRow>
          {isLoadingThroughput ? (
            <Cell>
              <Loader size={60} margin="auto" />
            </Cell>
          ) : (
            throughputData?.map((item) => (
              <Cell key={item.id}>
                <Typography mb={'0.625rem'} size={'1.3125rem'} color={'darkGrey'} weight={'bold'}>
                  {item.value.value}
                </Typography>
                <Typography>
                  <Typography
                    mb={0}
                    color={
                      item.id == 'Actual' ? theme.colors.mediumBlue2 : theme.colors.onTrackGreen
                    }
                    size="0.8125"
                    as="span"
                  >
                    {item.id}
                  </Typography>{' '}
                  <Typography mb={0} color="mediumGrey2" size="0.8125" as="span">
                    {item.unit}
                  </Typography>
                </Typography>
              </Cell>
            ))
          )}
        </CardRow>
      </KPICard>
    </>
  );
};

export default ThroughputKPICard;
