// 3rd party libs
import React, { ReactElement } from 'react';
import { isEmpty } from 'lodash';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

// components
import { Loader, StateOverTimeCard, Typography } from 'components';
import { StatePeriod } from 'types/protein';
import { TrackingLine } from 'components/StateOverTimeChart';
import { ActualChangeOverDetail, AsepticChangeoverType } from 'types/machine-health/aseptic';
import { NestedRow } from 'components/StateOverTimeCard';

// themes
import theme from 'themes';

const LineStatusContainer = styled.div`
  > * {
    border: none;
    border-radius: 0;
  }
`;

interface Props {
  selectedChangeover: AsepticChangeoverType;
  isLoading?: boolean;
  error?: unknown;
}

const toNestedData = (selectedChangeover?: AsepticChangeoverType): NestedRow[] => {
  const nestedRows: NestedRow[] = [];
  const actualStatusData: StatePeriod[] = [];
  selectedChangeover?.actualDetails?.forEach((changeOverStepDetail) => {
    actualStatusData.push({
      stateCode: changeOverStepDetail.modeNumber,
      stateName: changeOverStepDetail.modeDescr,
      startTimestamp: changeOverStepDetail.startTime,
      endTimestamp: changeOverStepDetail.endTime,
      recipeName: changeOverStepDetail.recipeDescr
    } as StatePeriod);
  });

  nestedRows.push({
    id: 0,
    label: 'Actual Status',
    parentProperty: '1',
    isLabel: true,
    data: actualStatusData
  } as NestedRow);

  const targetStatusData: StatePeriod[] = [];
  selectedChangeover?.targetDetails?.forEach((changeOverStepDetail) => {
    targetStatusData.push({
      stateCode: changeOverStepDetail.modeNumber,
      stateName: changeOverStepDetail.modeDescr,
      startTimestamp: changeOverStepDetail.startTime,
      endTimestamp: changeOverStepDetail.endTime,
      recipeName: changeOverStepDetail.recipeDescr
    } as StatePeriod);
  });

  nestedRows.push({
    id: 1,
    label: 'Target Status',
    parentProperty: '2',
    isLabel: false,
    data: targetStatusData
  } as NestedRow);

  return nestedRows;
};

const ChangeOverStateChartWidget = ({ selectedChangeover, isLoading }: Props): ReactElement => {
  const colors = {
    '1': '#2C476F',
    '0': '#7D96C3',
    '3': '#694085',
    '4': '#7EBCC3',
    '5': '#C2C2C6'
  };
  const { t } = useTranslation(['mh']);

  const getTrackingLines2 = (
    actualStatus: ActualChangeOverDetail[],
    targetStatus: ActualChangeOverDetail[]
  ) => {
    const trackingLines: TrackingLine[] = [];
    if (actualStatus && !isEmpty(actualStatus)) {
      actualStatus.forEach((actualStatusItem: ActualChangeOverDetail) => {
        // tracking red line only gets added for cleaning and sterilization and production and actual data's last element. Needs to be checked with real data Ids later.
        if (
          actualStatusItem.modeNumber === 2 ||
          actualStatusItem.modeNumber === 3 ||
          actualStatusItem.modeNumber === 4
        ) {
          // get the last interval in target with same status code to highlight the difference with tracking line
          let lastFoundIndex = -1;
          targetStatus.forEach((targetStatusItem, targetIndex) => {
            if (targetStatusItem.runLoginId === actualStatusItem.runLoginId) {
              lastFoundIndex = targetIndex;
            }
          });
          if (lastFoundIndex !== -1) {
            const trackingLineItem = {
              id: `${actualStatusItem.runLoginId}`,
              targetTime: new Date(targetStatus[lastFoundIndex].endTime),
              actualTime: new Date(actualStatusItem.endTime),
              color: theme.colors.negativeRed,
              dashed: true
            };
            trackingLines.push(trackingLineItem);
          }
        }
      });
    }
    return trackingLines;
  };

  const title = t('line_status');
  const heading = '';
  const subheading = '';
  const trackingLines = selectedChangeover
    ? getTrackingLines2(
        selectedChangeover.actualDetails as ActualChangeOverDetail[],
        selectedChangeover.targetDetails as ActualChangeOverDetail[]
      )
    : [];

  return (
    <LineStatusContainer>
      {isLoading ? (
        <Loader />
      ) : (
        <StateOverTimeCard
          hideStateCodes
          title={''}
          subHeadingComponent={
            <>
              <Typography weight="bold" size="1rem">
                {title}
              </Typography>
              <Typography weight="bold" size="1.125rem">
                {heading}
              </Typography>
              <Typography weight="medium" size="0.8125rem">
                {subheading}
              </Typography>
            </>
          }
          nestedData={toNestedData(selectedChangeover)}
          stateColors={colors}
          trackingLines={trackingLines}
          barSpacing={15}
          intervalSpacing={5}
          tickLabelPadding={30}
          chartPadding={{ top: 75, right: 30, bottom: 5, left: 150 }}
        />
      )}
    </LineStatusContainer>
  );
};

export default ChangeOverStateChartWidget;
