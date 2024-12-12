import React, { useState } from 'react';
import { VictoryPie, VictoryLabel } from 'victory';

import { ChartTooltipWrapper, ChartTooltipWrapperPropsTooltip } from '../../../components';
import { GlobalChartProps } from '../Charts.types';
import { globalChartStyles, globalChartHandlers } from '../_helpers';

export interface PieChartProps extends GlobalChartProps {
  data?: Record<string, unknown>[];
  barRatio?: number;
  labelRadius?: number;
}

export const PieChart = ({
  data,
  dimensions,
  colors,
  handleClick,
  checkIfSelected,
  colorScale,
  colorKey,
  CustomTooltip
}: PieChartProps): JSX.Element => {
  const [tooltipProps, setTooltipProps] = useState<ChartTooltipWrapperPropsTooltip | undefined>(
    undefined
  );

  if (tooltipProps) {
    console.log('tooltip not set', { setTooltipProps });
  }
  // return empty if no data.
  // this should be checked for higher up, in case data is loading.
  // if this loads and there is no data, there should a message saying no data
  // in a parent component

  if (!data) return <>error no data</>;

  const width = dimensions?.width;
  const height = dimensions?.height;

  const handleHover = () => {
    /*const slice = props?.slice as Record<string, number>;
    const datum = props?.datum as Record<string, unknown>;

    const calculatePieSliceCenter = (startAngle: number, endAngle: number) => {
      const chartWidth = 175;
      const chartHeight = 175;
      const containerLeft = 0;
      const containerTop = 0;

      const chartCenterX = containerLeft + chartWidth / 2;
      const chartCenterY = containerTop + chartHeight / 2;
      const sliceAngle = (startAngle + endAngle) / 2;

      const radius = Math.min(chartWidth, chartHeight) / 2;
      const sliceCenterX = chartCenterX + radius * Math.cos(sliceAngle * (Math.PI / 180));
      const sliceCenterY = chartCenterY + radius * Math.sin(sliceAngle * (Math.PI / 180));

      return { x: sliceCenterX, y: sliceCenterY };
    };*/

    //if (slice && width && height && datum) {
    //const center = calculatePieSliceCenter(slice.startAngle, slice.endAngle); //({ x: width / 2 + (width / 2) * Math.cos((slice.startAngle + slice.endAngle) / 2 * (Math.PI / 180)), y: height / 2 + (height / 2) * Math.sin((slice.startAngle + slice.endAngle) / 2 * (Math.PI / 180)) });      console.log('center not set', { center });
    //return setTooltipProps({ x: center.x, y: center.y, datum })
    //}
    return;
  };

  const CustomLabel = (props: Record<string, unknown>) => {
    const datum = props.datum as Record<string, unknown>;
    //const y = datum.y as number;

    const settings: Record<string, unknown> = {
      renderInPortal: true,
      textAnchor: 'middle', //"middle" | "inherit" | "start" | "end"
      verticleAnchor: 'middle', //| "start" | "end"
      x: props.x as number,
      y: props.y as number,
      text: `${datum.y}%`,
      backgroundStyle: {
        fill: 'black',
        filter: 'drop-shadow(0px 3px 2px rgba(0, 0, 0, .3))',
        rx: 5,
        opacity:
          (datum.y as number) < 10 ? 0 : checkIfSelected?.({ label: datum?.label }) ? 0.4 : 0.1
      },
      backgroundPadding: { left: 5, top: 3, right: 5, bottom: 3 },

      style: {
        fontFamily: 'inherit',
        fill: 'white',
        fontWeight: 500,
        opacity: (datum.y as number) < 10 ? 0 : checkIfSelected?.({ label: datum?.label }) ? 1 : 0.3
      }
    };

    /* this removes the background style of smaller values,
    /* please keep for now, will be needed in the near future
    // thanks TS
    if (y < 15) {
      delete settings.backgroundStyle;
      delete settings.backgroundPadding;
      delete settings.backgroundComponent;
    }
    */
    return <VictoryLabel {...settings} />;
  };

  return (
    <>
      {CustomTooltip && <ChartTooltipWrapper {...{ tooltipProps, CustomTooltip, handleHover }} />}

      <VictoryPie
        {...{
          width,
          height,
          data,
          style: globalChartStyles({ checkIfSelected, colors, colorScale, colorKey }),
          events: globalChartHandlers({ handleClick, handleHover }),
          domainPadding: 0,
          padding: 0,
          labelComponent: <CustomLabel />,
          //labelComponent: <CustomLabel />,
          labelRadius: Number(width) * 0.3
        }}
      />
    </>
  );
};
