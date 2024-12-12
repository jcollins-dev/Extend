import React, { ReactElement } from 'react';
import styled, { useTheme } from 'styled-components';
import { KPICard, LineChart, Typography } from 'components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Cell, Row as CardRow, Value } from 'components/KPICard/CardComponents';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import _ from 'lodash';
import { useContainerSize } from 'hooks';

interface Props {
  heading: Value;
  height?: string;
  subHeading?: string;
  icon?: IconProp;
  chartData: { x: number; y: number }[];
  footerData?: { right: { label: string; value: number }; left: { label: string; value: number } };
  showXaxis?: boolean;
  roundAxisFormat?: boolean;
  custom?: JSX.Element;
  isZoomEnabled?: boolean;
}

// Styling
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
const StyledIcon = styled(FontAwesomeIcon)`
  margin-top: 1rem;
  margin-right: -1rem;
`;

const KPIChartPanel = ({
  heading,
  height,
  subHeading,
  chartData,
  icon,
  footerData,
  custom,
  showXaxis = false,
  roundAxisFormat = true,
  isZoomEnabled = false
}: Props): ReactElement => {
  const { width: graphWidth, containerRef: graphContainerRef } = useContainerSize();

  const theme = useTheme();
  return (
    <KPICard
      height={height || '17.1875rem'}
      ref={graphContainerRef}
      component={
        <StyledHeader>
          <CardRow>
            <Cell>
              <Typography
                color="darkGrey"
                size={heading.size ?? '0.8125rem'}
                mb={heading.mb ?? '0.3125rem'}
                weight={heading.weight ?? 'normal'}
              >
                {heading.value}
              </Typography>
              <Typography color="darkGrey" size="1.3125rem" weight="bold" mb="0.3125rem">
                {subHeading}
              </Typography>
            </Cell>
            <Cell />
            {icon && <StyledIcon color={theme.colors.darkGrey} icon={icon} />}
          </CardRow>
        </StyledHeader>
      }
    >
      {!_.isEmpty(chartData) && (
        <LineChart
          width={graphWidth}
          height={140}
          data={chartData}
          strokeColor={theme.colors.darkGrey}
          leftLabel={{ title: '-8 hrs', height: 54 }}
          rightLabel={{ title: 'Now', height: 54 }}
          isVisibleAxis={{ x: showXaxis, y: true }}
          isAxisRounded={roundAxisFormat}
          isVisibleScatter={true}
          custom={custom}
          isZoomEnabled={isZoomEnabled}
        />
      )}
      {footerData && (
        <CardRow>
          <Cell />
          <Cell>
            <Typography
              style={{ textAlign: 'right', marginRight: '0.3125rem' }}
              mb={0}
              color="mediumGrey3"
              size="0.75rem"
            >
              {footerData.left.label}
            </Typography>
          </Cell>
          <Cell>
            {' '}
            <Typography style={{ textAlign: 'left' }} mb={0} color="mediumGrey3" size="0.75rem">
              {footerData.left.value.toLocaleString()}
            </Typography>
          </Cell>
          <Cell>
            <Typography
              style={{ textAlign: 'right', marginRight: '0.3125rem' }}
              mb={0}
              color="mediumGrey3"
              size="0.75rem"
            >
              {footerData.right.label}
            </Typography>
          </Cell>
          <Cell>
            {' '}
            <Typography style={{ textAlign: 'left' }} mb={0} color="mediumGrey3" size="0.75rem">
              {footerData.right.value.toLocaleString()}
            </Typography>
          </Cell>
          <Cell />
        </CardRow>
      )}
    </KPICard>
  );
};

export default KPIChartPanel;
