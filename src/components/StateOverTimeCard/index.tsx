// 3rd party libs
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

// Components
import { ActionButton, Card, GraphLegend, StateOverTimeChart, Typography } from 'components';
import {
  BarPeriod,
  Padding,
  Row,
  ScatterChartData,
  TrackingLine
} from 'components/StateOverTimeChart';

// Types
import { StatePeriod, ProteinMachineState, ProteinMachineCategoryStates } from 'types/protein';
import { ZoomObjectTuples } from 'types';
import { BrushProps } from 'types/graph';

export interface NestedRow {
  id: number;
  label: string;
  parentProperty: string;
  data: StatePeriod[];
  isLabel?: boolean;
  children?: NestedRow[];
}

type Props = {
  nestedData: NestedRow[];
  stateColors: Record<string, string>;
  title: string | React.ReactNode;
  subHeadingComponent?: React.ReactNode;
  // Flag to sync zooming with other graphs
  sync?: boolean;
  brush?: BrushProps;
  trackingLines?: TrackingLine[];
  scatterChartData?: { title?: string; data: ScatterChartData[] };
  barSpacing?: number;
  barCornerRadius?: number;
  intervalSpacing?: number;
  tickLabelPadding?: string | number;
  chartPadding?: Padding;
  hideStateCodes?: boolean;
  hideSubStepIds?: boolean;
  borderColor?: string;
  isDefaultExpanded?: boolean;
};

// Map state codes to state names
interface CodeNameMap {
  [code: string]: {
    stateName: string;
    stateCode: string | ProteinMachineState | ProteinMachineCategoryStates;
    uniqueStateCode: string;
  };
}

const graphPadding = {
  top: 50,
  right: 30,
  bottom: 5,
  left: 150
};

const Container = styled(Card)`
  display: flex;
`;

const Legends = styled.div`
  width: 11.5625rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.lightGrey1};
  border-right: 1px solid ${({ theme }) => theme.colors.lightGrey2};
`;

const LegendRow = styled.div`
  margin-bottom: 0.5rem;
`;

const ResetZoom = styled.div`
  margin-bottom: 0.5rem;
`;

/**
 * Create an array of BarPeriods to populate a row in the chart, filtering out
 * any bars that are not active (i.e. the legend has been unselected)
 */
const createBars = (
  data: StatePeriod[],
  colors: Record<string, string>,
  activeState: Record<string, boolean>,
  overrideCode?: string
) => {
  return data.reduce((prev, current) => {
    const { stateCode, recipeName, stateName, startTimestamp, endTimestamp } = current;
    if (activeState[stateCode]) {
      const startTime = new Date(startTimestamp);
      const endTime = new Date(endTimestamp);
      prev.push({
        state: overrideCode ? overrideCode : (stateCode as string),
        color: colors[stateCode],
        startTime,
        endTime,
        toolTipData: {
          title: recipeName ? recipeName : stateName,
          startTime,
          endTime
        }
      });
    }
    return prev;
  }, [] as BarPeriod[]);
};

// Initial state for expanded rows (all collapsed by default)
const initExpandedState = (nestedData: NestedRow[], isDefaultExpanded = false) => {
  const state: Record<string, boolean> = {};
  nestedData.forEach((parentRow) => {
    state[parentRow.parentProperty] = isDefaultExpanded;
  });
  return state;
};

// Initial state for active states (i.e. legends that are currently selected)
// All states (rows) are shown by default
const initActiveState = (nestedData: NestedRow[]): Record<string, boolean> => {
  const active: Record<string, boolean> = {};
  nestedData.forEach((parentRow) => {
    parentRow.data.forEach(({ stateCode }) => {
      active[stateCode] = true;
    });

    parentRow.children?.forEach((childRow) => {
      childRow.data.forEach(({ stateCode }) => {
        active[stateCode] = true;
      });
    });
  });
  return active;
};

// Check if all state are active states
const areAllActiveState = (data: Record<string, boolean>): boolean => {
  const key = (Object.keys(data) as Array<string>).find((key) => data[key] === false);
  if (key) {
    return false;
  }
  return true;
};

/**
 * Card component that accepts a nested data structure (parent rows containing child rows) to display
 * StatePeriod data on a StateOverTimeChart.
 *
 * Includes legends, and logic for enabling zoom on the StateOverTimeChart.
 *
 * This gives us a fully featured component to  display state over time data,
 * with legends, that can be reused easily.
 */
const StateOverTimeCard = ({
  borderColor,
  nestedData,
  title,
  stateColors,
  sync,
  brush,
  trackingLines,
  scatterChartData,
  barSpacing,
  barCornerRadius,
  intervalSpacing,
  tickLabelPadding,
  chartPadding,
  subHeadingComponent,
  hideStateCodes,
  hideSubStepIds,
  isDefaultExpanded
}: Props): JSX.Element => {
  const [expandedRows, setExpandedRows] = useState(
    initExpandedState(nestedData, isDefaultExpanded)
  );
  const [activeState, setActiveState] = useState(initActiveState(nestedData));
  const { t } = useTranslation(['mh']);

  // Not zoomed by default
  const [zoomedDomain, setZoomedDomain] = useState<ZoomObjectTuples | undefined>(undefined);
  // True - when an area is being selecting
  const [zooming, setZooming] = useState(false);

  const legends = useMemo(() => {
    const map: Record<string, { stateName: string; stateColor: string }> = {};
    nestedData.forEach((parentRow) => {
      parentRow.data.forEach(({ stateCode, stateName }) => {
        map[stateCode] = {
          stateName: hideStateCodes ? stateName : `${stateName} (${stateCode})`,
          stateColor: stateColors[stateCode]
        };
      });

      parentRow.children?.forEach((childRow) => {
        childRow.data.forEach(({ stateCode, stateName }) => {
          map[stateCode] = {
            stateName: hideStateCodes ? stateName : `${stateName} (${stateCode})`,
            stateColor: stateColors[stateCode]
          };
        });
      });
    });
    return map;
  }, [stateColors, nestedData]);

  // Define rows for the StateOverTimeChart
  const rows: Row[] = useMemo(() => {
    const rows: Row[] = [];

    // Add the top level button rows
    nestedData.forEach((parentRow) => {
      const topLevelRow = {
        parentRowProperty: parentRow.parentProperty,
        label: parentRow.label,
        isButton: true,
        isLabel: parentRow.isLabel,
        isExpanded: expandedRows[parentRow.parentProperty],
        state: parentRow.parentProperty,
        bars: createBars(parentRow.data, stateColors, activeState, parentRow.parentProperty)
      } as Row;

      rows.push(topLevelRow);

      // Add the child rows, if this row is expanded
      if (expandedRows[parentRow.parentProperty]) {
        const nameMap: CodeNameMap = {};

        // Add mid level rows as non-expandable rows, similar to top level rows
        if ((parentRow?.children?.length || 0) > 0) {
          parentRow?.children?.forEach((child) => {
            const midLevelRow = {
              parentRowProperty: child.parentProperty,
              label: child.label,
              isButton: false,
              isLabel: child.isLabel,
              isExpanded: expandedRows[child.parentProperty],
              state: child.parentProperty,
              bars: createBars(child.data, stateColors, activeState, child.parentProperty)
            } as Row;

            rows.push(midLevelRow);

            child.data.forEach(({ stateCode, stateName }) => {
              // Combine the parent property with the child state code to make it a unique state
              const uniqueStateCode = `${child.parentProperty}-${stateCode}`;
              nameMap[uniqueStateCode] = {
                stateName,
                stateCode,
                uniqueStateCode
              };
            });
          });
          // If there are no mid level rows, add the child rows
        } else {
          parentRow.data.forEach(({ stateCode, stateName }) => {
            // Combine the parent property with the child state code to make it a unique state
            const uniqueStateCode = `${parentRow.parentProperty}-${stateCode}`;
            nameMap[uniqueStateCode] = {
              stateName,
              stateCode,
              uniqueStateCode
            };
          });

          // Then dynamically add a child row for each state
          Object.values(nameMap).forEach((val) => {
            rows.push({
              bars: createBars(
                parentRow.data.filter((bar) => bar.stateCode === val.stateCode),
                stateColors,
                activeState,
                val.uniqueStateCode
              ),
              label: hideStateCodes
                ? val.stateName
                : `${nameMap[val.uniqueStateCode].stateName} (${
                    nameMap[val.uniqueStateCode].stateCode
                  })`,
              state: val.uniqueStateCode,
              stateNameLabel: val.stateName
            } as Row);
          });
        }
      }
    });

    return rows;
  }, [nestedData, expandedRows, activeState]);

  // Sync zoom if Applicable
  useEffect(() => {
    if (sync) {
      setZoomedDomain(brush?.zoomedDomain);
      setZooming(false);
    }
  }, [brush?.zoomedDomain]);

  return (
    <Container borderColor={borderColor}>
      <Legends>
        <div>
          {typeof title === 'string' ? (
            <Typography weight="medium" size="0.8125rem">
              {title}
            </Typography>
          ) : (
            title
          )}
          {subHeadingComponent}
          {zoomedDomain?.x && (
            <ResetZoom>
              <ActionButton
                onClick={() => {
                  if (sync) brush?.resetZoom();
                  else setZoomedDomain(undefined);
                }}
                hideArrow
              >
                {t('reset_zoom')}
              </ActionButton>
            </ResetZoom>
          )}
        </div>
        <div>
          {Object.keys(legends).map((key) => (
            <LegendRow key={key}>
              <GraphLegend
                active={activeState[key]}
                onClick={() => {
                  if (areAllActiveState(activeState)) {
                    // set [key] to true, all others to false
                    setActiveState({
                      ...Object.keys(activeState).reduce((acc, curr) => {
                        return {
                          ...acc,
                          [curr]: false
                        };
                      }, {}),
                      [key]: true
                    });
                  } else {
                    if (activeState[key]) {
                      // set [key] to true, all others to false
                      setActiveState({
                        ...Object.keys(activeState).reduce((acc, curr) => {
                          return {
                            ...acc,
                            [curr]: true
                          };
                        }, {}),
                        [key]: true
                      });
                    } else {
                      // set [key] to true, keep all others current values
                      setActiveState({
                        ...activeState,
                        [key]: true
                      });
                    }
                  }
                }}
                id={key}
                label={legends[key].stateName}
                color={legends[key].stateColor}
              />
            </LegendRow>
          ))}
        </div>
      </Legends>
      <StateOverTimeChart
        padding={chartPadding ? chartPadding : graphPadding}
        tickLabelPadding={tickLabelPadding}
        rows={rows}
        onLabelClick={({ parentRowProperty }) => {
          parentRowProperty &&
            setExpandedRows({
              ...expandedRows,
              [parentRowProperty]: !expandedRows[parentRowProperty]
            });
        }}
        trackingLines={trackingLines}
        scatterChartData={scatterChartData}
        barSpacing={barSpacing}
        barCornerRadius={barCornerRadius}
        intervalSpacing={intervalSpacing}
        hasZoom={true}
        zooming={zooming}
        brush={{
          onBrushDomainChange: () => !zooming && setZooming(true),
          onBrushDomainChangeEnd: (d) => {
            if (sync) {
              brush?.onBrushDomainChangeEnd(d);
            } else {
              setZoomedDomain(d);
              setZooming(false);
            }
          },
          resetZoom: () => {
            if (sync) brush?.resetZoom();
            else setZoomedDomain(undefined);
          },
          zoomedDomain
        }}
        syncAxis={sync}
        hideSubStepIds={hideSubStepIds}
      />
    </Container>
  );
};

export default StateOverTimeCard;
