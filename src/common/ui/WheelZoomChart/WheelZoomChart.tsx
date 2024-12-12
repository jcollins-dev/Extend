import { styledTheme } from 'common/theme';
import React, { useState } from 'react';
import { XAxis, YAxis, CartesianGrid, Brush, AreaChart, Area, ResponsiveContainer } from 'recharts';

const Scrubber = (
  <svg width="13" height="24" viewBox="0 0 13 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12.306 4C12.306 1.79086 9.74576 0 6.58757 0C3.42937 0 0.869141 1.79086 0.869141 4V20C0.869141 22.2091 3.42937 24 6.58757 24C9.74576 24 12.306 22.2091 12.306 20V4Z"
      fill="#0A70FF"
    />
  </svg>
);

interface WheelZoomChartProps {
  data: Record<string, unknown>[];
  height: number;
  width?: number;
  dataKeyArea: string;
  dataKeyBrush?: string;
  dataKeyXAxis?: string;
  dataKeyYAxis?: string;
  accentColor?: string;
  showCartesianGrid?: boolean;
}

export const WheelZoomChart = ({
  data,
  height,
  dataKeyArea,
  dataKeyBrush,
  dataKeyXAxis,
  dataKeyYAxis,
  showCartesianGrid
}: WheelZoomChartProps): JSX.Element => {
  const [index, setIndex] = useState<{
    startIndex: number | undefined;
    endIndex: number | undefined;
  }>({ startIndex: data.length - 2, endIndex: data.length - 1 });

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} width={100} height={height}>
        {dataKeyBrush && (
          <Brush
            className="smallbrush"
            gap={1}
            fill={styledTheme.colors.bg.negLighter}
            stroke={'#000000'}
            strokeWidth={0}
            height={45}
            startIndex={index.startIndex}
            endIndex={index.endIndex}
            dataKey={dataKeyBrush}
            traveller={Scrubber}
            travellerWidth={10}
            onChange={(e) => {
              e && setIndex({ startIndex: e.startIndex, endIndex: e.endIndex });
            }}
            opacity={1}
            tickFormatter={(tick) => new Date(tick).toLocaleDateString()}
          />
        )}

        <Area
          type="monotone"
          dataKey={dataKeyArea}
          stroke="#9D9D9D"
          fillOpacity={1}
          fill="url(#colorUv)"
          data={data}
        />
        {showCartesianGrid && <CartesianGrid strokeDasharray="3 3" />}

        {dataKeyXAxis && (
          <XAxis
            dataKey={dataKeyXAxis}
            tickFormatter={(tick) => new Date(tick).toLocaleDateString()}
            strokeWidth={1}
          />
        )}
        {dataKeyYAxis && <YAxis dataKey={dataKeyYAxis} type="number" />}

        {/* <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="25%" stopColor="#9D9D9D" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#9D9D9D" stopOpacity={0} />
          </linearGradient>
        </defs> */}
      </AreaChart>
    </ResponsiveContainer>
  );
};
