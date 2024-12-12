// 3rd party libs
import React from 'react';
import { VictoryLabelProps } from 'victory';
import styled, { useTheme } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronDown } from '@fortawesome/free-solid-svg-icons';

// Components
import { Typography } from 'components';

// Types
import { Row, Padding, RowClickEvent } from '.';

const LABEL_FONT_SIZE_PX = 13;

interface Props extends VictoryLabelProps {
  hideSubStepIds?: boolean;
  index?: number;
  padding: Padding;
  rows: Row[];
  rowHeight: number;
  onClick?: (e: RowClickEvent) => void;
}

const Button = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem 0;
  line-height: 1.2;
  text-align: right;
  display: flex;
  align-items: center;
  font-size: 0.8125rem;
`;

const LabelContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  height: 100%;
  text-align: right;
  align-items: center;
`;

/* Prevent very long labels from overflowing the container,
by limiting to 2 lines and adding ellipsis if too long */
const LineClamp = styled.span`
  /* Add ellipsis if more than 2 lines: https://css-tricks.com/line-clampin/#the-standardized-way */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  white-space: normal;

  overflow: hidden;
  line-height: 1.2;
  font-size: ${LABEL_FONT_SIZE_PX / 16}rem;
`;

/**
 * TickLabelY is a custom VictoryLabel component that will either render text (with some css to
 * handle very long labels) or a Button, if the row has isButton: true property
 */
const TickLabelYComponent = (props: Props): JSX.Element => {
  const theme = useTheme();
  const row = props.rows[props.index || 0];

  const labelHeight = LABEL_FONT_SIZE_PX * 2.5;

  return (
    <g transform={`translate(0,${props.y})`}>
      <foreignObject
        width={(props.padding.left as number) - 10}
        height={labelHeight}
        x={0}
        y={-labelHeight / 2}
      >
        <LabelContainer>
          {row && row.isButton && !row.isLabel ? (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                props.onClick &&
                  props.onClick({ idx: props.index, parentRowProperty: row.parentRowProperty });
              }}
            >
              <Typography as="p" mb={0} size="0.8125rem" weight="bold">
                {row.label}
              </Typography>
              <FontAwesomeIcon
                style={{ marginLeft: '0.125rem' }}
                icon={row.isExpanded ? faChevronDown : faChevronRight}
                color={theme.colors.darkGrey}
              />
            </Button>
          ) : (
            <Typography
              as="span"
              mb={0}
              color={row?.isLabel ? 'black' : 'mediumGrey3'}
              weight={row?.isLabel ? 'bold' : 'normal'}
            >
              <LineClamp>{`${row?.label} ${
                !props.hideSubStepIds && row?.state
                  ? row.stateNameLabel
                    ? ''
                    : ` (${row.state})`
                  : ''
              } `}</LineClamp>
            </Typography>
          )}
        </LabelContainer>
      </foreignObject>
    </g>
  );
};

export default TickLabelYComponent;
