import React, { ReactNode, useState } from 'react';
import { DimensionsContainer } from 'components';
import { ChartAxisWrapper } from '../ChartAxisWrapper/ChartAxisWrapper';
import { LinePath } from '../LineChart';
import { ChartPoints } from '../ChartPoints';
import { ChartTooltipWrapper } from '../../ChartTooltipWrapper/ChartTooltipWrapper';
import { ConnectedScatterChartTooltip } from './ConnectedScatterChartTooltip';
import {
  ConnectedScatterChartContainer,
  LegendContainer,
  LegendItemContainer
} from './ConnectedScatterChart.elements';

type DataPoint = Record<string, unknown>; //{ date: string; value: number };
type ConnectedScatterChartProps = {
  width?: number;
  height?: number;
  className?: string;
  data?: DataPoint[];
  stackedData?: Record<string, DataPoint[]>;
  dateKey?: string;
  groupKey?: string;
  valueKeys?: string[];
  colors?: Record<string, string>;
  dateRange?: string[];
  dateRanges?: string[];
  TooltipComponent?: (props: Record<string, unknown>) => JSX.Element;
  bottomTickCount?: number;
  isOutlined?: boolean;
  axisMargins?: {
    t?: number;
    r?: number;
    b?: number;
    l?: number;
  };
  legendItems?: LegendProps;
  labelLeft?: ReactNode | ReactNode[];
  handle: (type: string, options?: Record<string, unknown>) => void;
  selected?: string[];
};

export interface LegendProps {
  items?: {
    id?: string;
    label?: string;
  }[];
  handleSelect?: (id?: string) => void;
  selected?: string[] | undefined;
  colors?: Record<string, string>;
}

const Legend = ({ items, colors, selected, handleSelect }: LegendProps): JSX.Element => {
  return (
    <LegendContainer className="chart-legend">
      {items?.map((x: Record<string, unknown>) => {
        const isSelected = !selected
          ? true
          : selected?.length === 0
          ? true
          : selected?.includes(x.id as string)
          ? true
          : false;
        return (
          <LegendItemContainer
            onClick={() => handleSelect?.(x.id as string)}
            color={colors?.[x.id as string]}
            key={x.id as string}
            className="legend__item"
            isSelected={isSelected}
          >
            <div>{x.label as string}</div>
          </LegendItemContainer>
        );
      })}
    </LegendContainer>
  );
};

export const ConnectedScatterChart = ({
  height,
  valueKeys,
  colors,
  groupKey,
  axisMargins,
  legendItems,
  TooltipComponent,
  labelLeft,
  className,
  handle,
  selected,
  dateRanges,
  ...props
}: ConnectedScatterChartProps): JSX.Element => {
  className = className ? `${className} connected-scatter-chart` : `connected-scatter-chart`;

  if (!dateRanges) console.log(dateRanges, 'not set');

  // set some defaults
  axisMargins = {
    t: axisMargins?.t || 40,
    l: axisMargins?.l || 40,
    r: axisMargins?.r || 40,
    b: axisMargins?.b || 40
  };

  const [curSelected, setSelected] = useState<string[] | undefined>(selected);

  const handleSelect = (id?: string) => {
    if (!id || curSelected?.length === 3) {
      if (handle) handle('select', { selected: [] });
      return setSelected([]);
    }
    const newSel: string[] = selected || [];
    if (newSel.length === 0) {
      if (handle) handle('select', { selected: [id] });
      return setSelected([id]);
    }
    if (newSel?.includes(id)) {
      const filt = newSel.filter((item) => item !== id).filter((x) => x);
      if (handle) handle('select', { selected: filt });
      return setSelected(filt);
    }
    if (handle) handle('select', { selected: [...newSel, id] });
    return setSelected([...newSel, id]);
  };

  return (
    <ConnectedScatterChartContainer {...{ className }}>
      {legendItems && <Legend {...legendItems} {...{ handleSelect, selected, colors }} />}
      {labelLeft && (
        <div className="chart-label-left">
          <span>{labelLeft}</span>
        </div>
      )}
      <DimensionsContainer
        {...{ height }}
        // wrap the chart in a dimensions container to get the width and height of the chart
        Component={({ width, height }) => (
          <ChartTooltipWrapper>
            <ConnectedScatterChartTooltip
              {...{ width, height, axisMargins, TooltipComponent, colors }}
            />
            <ChartAxisWrapper
              {...{ width, height, axisMargins, ...props }}
              // we send the chart dimensions to
              Chart={(chartDims) => {
                // return empty if no data to prevent errors
                if (!props.data) return <></>;
                // set default keys if none are provided
                valueKeys = valueKeys || ['value'];
                groupKey = groupKey || 'date';

                return (
                  // this wrapper is used to provide tooltip / setTooltip context
                  <>
                    {valueKeys.map((valueKey) => {
                      const isShown = !selected
                        ? true
                        : selected?.length > 0 && !selected?.includes(valueKey)
                        ? false
                        : true;
                      return (
                        isShown && (
                          <React.Fragment key={valueKey}>
                            <LinePath
                              {...{
                                ...chartDims,
                                ...props,
                                color: colors?.[valueKey],
                                valueKey,
                                groupKey
                              }}
                            />
                            <ChartPoints
                              {...{
                                ...chartDims,
                                ...props,
                                color: colors?.[valueKey],
                                valueKey,
                                groupKey
                              }}
                            />
                          </React.Fragment>
                        )
                      );
                    })}
                  </>
                );
              }}
            />
          </ChartTooltipWrapper>
        )}
      />
    </ConnectedScatterChartContainer>
  );
};
