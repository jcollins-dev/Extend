// 3rd party libs
import React, { ReactElement } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';

// component
import { KPICard, Loader, Typography } from 'components';
import { Cell, Row as CardRow, Value } from 'components/KPICard/CardComponents';
import TwoColumnCard from 'components/KPICard/TwoColumnCard';
import {
  SMALL_SIZE_THRESHOLD,
  LARGE_SIZE_THRESHOLD,
  DISTANCE_EDGE_THRESHOLD,
  DISTANCE_BETWEEN_THRESHOLD,
  MINIMUM_CAP_SIZE,
  MAXIMUM_CAP_SIZE
} from 'constants/machineTags';

//theme
import theme from 'themes';
import { find, includes, isEmpty, keys } from 'lodash';
import {
  AsepticMachineHealthInterval,
  AsepticMachineHealthKpiItem,
  AsepticMachineHealthType
} from 'types/machine-health';
import useMachineHealthKpi from 'hooks/useMachineHealthKpi';

// Styling
const StyledIcon = styled(FontAwesomeIcon)`
  margin-top: 0.625rem;
  margin-right: -1rem;
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

const FoilWidget = (): ReactElement => {
  const findThreshold = (id: string) => {
    const threshold = find(resultFoil, function (o) {
      return o.id === id;
    });
    return threshold && threshold.value && threshold.value.value
      ? threshold.value.value
      : undefined;
  };
  const isOutOfRange = (item: AsepticMachineHealthKpiItem, mapping: { [key: string]: string }) => {
    const value = item && item.value && item.value.value;
    const id = item.id;
    const thresholdId = mapping[id];
    const threshold = findThreshold(thresholdId);
    return id === MAXIMUM_CAP_SIZE
      ? value && threshold && value > threshold
      : value && threshold && value < threshold;
  };
  const {
    machineHealth: resultFoil,
    isLoading: isLoadingFoil,
    error: foilError
  } = useMachineHealthKpi(
    AsepticMachineHealthType.Foil,
    AsepticMachineHealthInterval.Last8Hours,
    false
  );

  const getValues = () => {
    const values: Value[] = [];
    if (!isEmpty(resultFoil)) {
      resultFoil?.forEach((item: AsepticMachineHealthKpiItem) => {
        const value = item && item.value && item.value.value;
        const id = item && item.id && item.id;
        const thresholdMapping: { [key: string]: string } = {
          minimum_cap_size: SMALL_SIZE_THRESHOLD,
          maximum_cap_size: LARGE_SIZE_THRESHOLD,
          min_distance_to_edge: DISTANCE_EDGE_THRESHOLD,
          min_distance_between_caps: DISTANCE_BETWEEN_THRESHOLD
        };

        const itemKeys = keys(thresholdMapping);
        if (includes(itemKeys, item.id)) {
          const outOfRange = isOutOfRange(item, thresholdMapping);
          values.push({
            value: `${value.toLocaleString()} ${item.unit}`,
            color: outOfRange ? theme.colors.darkRed : theme.colors.darkGrey,
            size: '1.3125rem',
            mb: 0,
            unit: !isEmpty(id) ? id.substr(id.indexOf('_') + 1).replaceAll('_', ' ') : '',
            unitTitle: !isEmpty(id) ? id.split('_')[0] : '',
            unitTitleColor:
              (item && item.id === MINIMUM_CAP_SIZE) || item.id === MAXIMUM_CAP_SIZE
                ? theme.colors.mediumBlue2
                : theme.colors.mediumGrey2,
            key: item.type
          });
        }
      });
    }
    return values;
  };

  const values = getValues();
  return (
    <KPICard
      height="17.1875rem"
      component={
        <StyledHeader>
          <CardRow>
            <Cell>
              <CardRow>
                <Cell>
                  <Typography color="darkGrey" size="1rem" weight="medium">
                    Foil
                  </Typography>
                </Cell>
              </CardRow>
            </Cell>
            <Cell />
            <StyledIcon color={theme.colors.darkGrey} icon={faAngleRight} />
          </CardRow>
        </StyledHeader>
      }
    >
      {foilError && (
        <Typography color="negativeRed" style={{ marginLeft: '2rem', marginTop: '1.5rem' }}>
          Failed to load foil data
        </Typography>
      )}
      {!foilError &&
        (isLoadingFoil ? (
          <Loader />
        ) : (
          <CardRow>
            <Cell>{!isEmpty(values) && <TwoColumnCard values={values} />}</Cell>
          </CardRow>
        ))}
    </KPICard>
  );
};

export default FoilWidget;
