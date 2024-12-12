import React, { ReactElement, useEffect, useRef, useState } from 'react';

import { BarSeriesCardProps } from 'types';
import ThresholdBarGraph from 'components/ThresholdBarGraph/ThresholdBarGraph';
import styled from 'styled-components';
import { default as theme } from 'themes';

const Card = styled.div`
  // change this to grow when the collapsed sidenav is implemented
  // should be 19.313rem wide then
  width: 15.5rem;
  max-height: 5.938rem;
  border: ${theme.colors.borders.border02.border};
  border-radius: 10px;
  padding: 15px 22px 10px;
`;
const CardTitle = styled.h3`
  margin: 0;
`;

const GraphContainer = styled.div`
  margin-top: 3px;
  height: 2.5rem;
`;

const BarSeriesCard = ({ title, data }: BarSeriesCardProps): ReactElement => {
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // victory didn't like static sizing for the bar graph component, so we calculate
    // the size of the parent container at runtime and pass it down to the bar graph
    if (ref.current !== null) {
      setHeight(ref.current.clientHeight);
      setWidth(ref.current.clientWidth);
    }
  });
  return (
    <Card>
      <CardTitle>{title}</CardTitle>
      <GraphContainer ref={ref}>
        <ThresholdBarGraph
          height={height}
          width={width}
          barData={data.barData}
          threshold={data.threshold}
          goodAboveThreshold={data.goodAboveThreshold}
        />
      </GraphContainer>
    </Card>
  );
};

BarSeriesCard.defaultProps = {
  title: 'placeholder',
  data: {}
};
export default BarSeriesCard;
