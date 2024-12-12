// 3rd party libs
import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { LineSegment, VictoryLabel } from 'victory';

type Props = {
  bottom: number;
  top: number;
  packCount: number;
  x: number;
};

// Format Path String
const leftRoundedRect = (x: number, y: number, width: number, height: number, radius: number) => {
  return (
    'M' +
    (x + radius) +
    ',' +
    y +
    'h' +
    (width - radius) +
    'v' +
    height +
    'h' +
    (radius - width) +
    'a' +
    radius +
    ',' +
    radius +
    ' 0 0 1 ' +
    -radius +
    ',' +
    -radius +
    'v' +
    (2 * radius - height) +
    'a' +
    radius +
    ',' +
    radius +
    ' 0 0 1 ' +
    radius +
    ',' +
    -radius +
    'z'
  );
};

const HEIGHT = 30;
const RADIUS = 15;
const WIDTH = 160;
const LABEL_Y = HEIGHT * (4 / 5);
const CurrentPackIntervalMarker = ({ bottom, x, top, packCount }: Props): ReactElement => {
  const { t } = useTranslation(['mh']);
  return (
    <>
      <LineSegment
        x1={x}
        x2={x}
        y1={top}
        y2={bottom}
        style={{ stroke: '#415c85', strokeWidth: 2 }}
      />
      <path d={leftRoundedRect(x - WIDTH, top, WIDTH, HEIGHT, RADIUS)} fill="#415c85" />
      <VictoryLabel
        dx={x - (WIDTH - 10)}
        dy={LABEL_Y}
        style={[{ fill: 'white', fontSize: 14 }]}
        text={(t('current_packs_per_min') as string) + ':'}
      />
      <VictoryLabel
        dx={x - 35}
        dy={LABEL_Y}
        style={[{ fill: 'white', fontSize: 14, fontWeight: 'Bold' }]}
        text={packCount}
      />
    </>
  );
};

export default CurrentPackIntervalMarker;
