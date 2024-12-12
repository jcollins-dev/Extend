// 3rd party
import React, { useMemo } from 'react';
import styled from 'styled-components';

// Hooks
import { useFilterSelected } from 'components/StyledUi/FilterSelected';

// Components
import { Card, Typography, generateCategoriesArray } from 'components';
import { Alarm, DSIAlarm } from 'types/machine-health/alarms';
import { BaseType } from 'types';
import { uniqueId } from 'lodash';

const StyledCard = styled(Card)`
  background: ${({ theme }) => theme.colors.lightGrey1};
  padding-top: 1rem;
  padding-bottom: 1rem;

  display: flex;
  gap: 0 1rem;

  > * {
    flex: 1;
  }
`;

const StatisticContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

interface Props {
  data?: Array<Alarm | DSIAlarm>;
  relatedChartsSettings?: string[];
}

export const ContainerWithTotals = ({ data, relatedChartsSettings }: Props): JSX.Element => {
  if (!data || relatedChartsSettings?.length === 0) return <></>;

  const dataCache = useMemo(() => data, [data]);
  const [selected] = useFilterSelected();

  // Removing dupes in array
  const uniq = [...new Set(relatedChartsSettings)];
  const group = {} as BaseType;
  uniq?.map((item) => {
    const objKey = item;
    group[objKey] = generateCategoriesArray(dataCache, item);
  });

  // Calculate totals for every category
  const objTot = {} as BaseType;
  dataCache.map((dataItem) => {
    for (const property in group) {
      const objKey = property;
      const objVal = group[objKey] as BaseType[];
      const dataValues = dataItem[property] as unknown;
      // @ts-expect-error: test
      if (objVal.indexOf(dataValues) > -1) {
        if (!Object.prototype.hasOwnProperty.call(objTot, property)) {
          objTot[property] = {};
          // @ts-expect-error: test
          objTot[property][dataValues] = 1;
        } else {
          // @ts-expect-error: test
          if (!Object.prototype.hasOwnProperty.call(objTot[property], dataValues)) {
            // @ts-expect-error: test
            objTot[property][dataValues] = 1;
          } else {
            // @ts-expect-error: test
            objTot[property][dataValues] += 1;
          }
        }
      }
    }
  });

  // @ts-expect-error: test
  const currentTotal = (selectedKey, objectTotals): number => {
    let totalVal = 0;
    if (!Object.keys(objectTotals).length) return totalVal;
    if (!selectedKey) {
      for (const property in objectTotals) {
        const tot = Object.values(objectTotals[property]).reduce(
          // @ts-expect-error: skip err in reduce
          (pv, cv) => pv + cv,
          0
        ) as unknown as number;
        return (totalVal += tot);
      }
    } else {
      for (const property in objectTotals) {
        if (Object.prototype.hasOwnProperty.call(selectedKey, property)) {
          const selectedValArr = selectedKey[property];
          // @ts-expect-error: test
          selectedValArr.forEach((item) => {
            totalVal += objectTotals[property][item];
          });
        }
      }
    }
    return totalVal;
  };

  const renderData = (
    <StatisticContainer key={uniqueId()}>
      <Typography weight="bold" as="h3" color={'darkGrey'} size="1.25rem" mb={0}>
        {currentTotal(selected, objTot)}
      </Typography>
      <Typography weight="medium" color={'mediumGrey2'} as="h3" size="1rem" mb={0}>
        Total Count
      </Typography>
    </StatisticContainer>
  );

  return <StyledCard>{renderData}</StyledCard>;
};
