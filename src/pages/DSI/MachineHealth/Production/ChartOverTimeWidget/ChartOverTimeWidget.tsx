import React, { Fragment, useMemo, useState } from 'react';
import { default as LoaderBase } from 'react-loader-spinner';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  ChartOverTimeWidgetContainer,
  ChartOverTimeLegendItem
} from './ChartOverTimeWidget.elements';
import { useParams } from 'react-router-dom';
import { useInterval } from '../../_hooks/useInterval';
import useMachineHealthByBuKpi from 'hooks/useMachineHealthByBuKpi';
import { DSIKPIType, BusinessUnit } from 'types/dsi';
import { StyledLineChart } from 'components/StyledUi/StyledCharts/StyledLineChart/StyledLineChart';
import { filterSelectedData, useFilterSelected } from 'components';

export interface ChartOverTimeWidgetProps {
  title?: string;
  kpiType?: DSIKPIType;
  dataType?: string;
  unit?: string;
  charts?: {
    xKey: string;
    yKey: string;
    color?: string;
    label: string;
    unit?: string;
  }[];
  toggle?: () => void;
}

const ChartInner = ({
  kpiType,
  dataType,
  charts,
  title,
  toggle,
  unit
}: ChartOverTimeWidgetProps) => {
  const { machineId } = useParams<{ machineId: string }>();
  const { interval } = useInterval();

  const [selected] = useFilterSelected();

  const [selectedChart, setSelectedChart] = useState<string[] | undefined>(undefined);

  if (!kpiType) return <>error: missing kpiType</>;

  const { machineHealth, isLoading, error } = useMachineHealthByBuKpi(
    machineId,
    kpiType,
    interval,
    true,
    'dsi' as BusinessUnit,
    dataType,
    600000
  );

  const d = machineHealth?.[0]?.values;
  const filteredData = filterSelectedData({ data: d, selected }); //d;

  const data = useMemo(() => {
    if (!charts) return filteredData;
    else
      return filteredData?.map((item: Record<string, unknown>) => {
        const newItem: Record<string, unknown> = { ...item };
        charts.map(({ xKey, yKey }: { xKey: string; yKey: string }) => {
          if (!newItem[xKey]) newItem[xKey] = 0;
          if (!newItem[yKey]) newItem[yKey] = 0;
        });
        return newItem;
      });
  }, [filteredData, interval]);

  if (isLoading)
    return (
      <div className="chart-widget-ui__status">
        <LoaderBase type="TailSpin" color="#d0d0d0" height={40} width={40} />
      </div>
    );
  if (error) return <div className="chart-widget-ui__status">error loading chart</div>;
  if (
    !data ||
    ((data as Record<string, unknown>[]) && [...(data as Record<string, unknown>[])].length < 1)
  )
    return <div className="chart-widget-ui__status">no data within range</div>;

  const legendItems = charts?.map(({ label, color }) => ({ label, color }));

  const handleLegendClick = (label: string) => {
    if (selectedChart?.includes(label)) setSelectedChart(undefined);
    else setSelectedChart(label ? [label] : undefined);
  };

  return (
    <>
      {legendItems && (
        <div className="chart-over-time__legend">
          {title && (
            <h2 onClick={() => toggle?.()}>
              {title}
              <br />
              {`(${unit})`}
            </h2>
          )}
          {legendItems.map(({ label, color }, index) => (
            <ChartOverTimeLegendItem
              type="button"
              color={color}
              onClick={() => handleLegendClick(label || '')}
              key={index}
              className={selectedChart && !selectedChart?.includes(label) ? 'is-inactive' : ''}
            >
              {label}
            </ChartOverTimeLegendItem>
          ))}
        </div>
      )}
      <StyledLineChart {...{ data, charts, selectedChart, unit }} />
    </>
  );
};

export const ChartOverTimeWidget = ({
  title,
  ...chartProps
}: ChartOverTimeWidgetProps): JSX.Element => {
  const [open, setOpen] = useState(false);

  return (
    <ChartOverTimeWidgetContainer className={`${open ? `is-open` : `is-closed`}`}>
      <button className="show-hide-trigger" type="button" onClick={() => setOpen(!open)}>
        <span>
          <FontAwesomeIcon icon={faCaretDown} />
        </span>{' '}
        {title}
      </button>
      {open && (
        <div className="chart-wrapper">
          <ChartInner {...{ title, ...chartProps }} toggle={() => setOpen(false)} />
        </div>
      )}
    </ChartOverTimeWidgetContainer>
  );
};
