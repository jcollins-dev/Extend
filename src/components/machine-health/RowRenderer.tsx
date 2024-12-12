// 3rd party libs
import React from 'react';
import styled from 'styled-components';
/*
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
import theme from 'themes';
*/

// Types
import { KpiRow, Value } from 'types/machine-health';

type Props = {
  rows: KpiRow[];
  containerHeight?: number;
  rowHeight?: number;
  onClick?: () => void;
};

// Default row height,in pixel unit
const DEFAULT_ROW_HEIGHT = 58;

const Row = styled.div<Value>`
  height: ${({ height }) => height}px;
  gap: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${({ color }) => color};
  background: ${({ bgColor }) => bgColor};
  font-weight: ${({ weight }) => weight || 400};
  font-size: 0.8125rem;
  border-bottom: ${(props) => `0.0625rem solid ${props.theme.colors.mediumGrey1}`};
  cursor: ${({ clickable }) => (clickable ? 'pointer' : 'default')};

  div {
    word-break: break-all;
  }
`;

/*
const RightArrow = styled.span`
  float: right;
`;
*/
// Dynamically calculate the rows height to fit in the container vertically
const kpiRowHeight = (rowsNumber: number, containerHeight?: number): number => {
  if (!containerHeight) return DEFAULT_ROW_HEIGHT;
  // Number of rows can go up to 15
  const maxRows = Math.min(rowsNumber, 15);
  let rowHeight = DEFAULT_ROW_HEIGHT;
  while (rowHeight-- * maxRows > containerHeight);
  return rowHeight;
};

const RowRenderer = ({ rows, containerHeight, onClick }: Props): JSX.Element => {
  const rowHeight = kpiRowHeight(rows.length, containerHeight);
  return (
    <>
      {rows.map((pair) => {
        const { key, content, weight, height, color, bgColor, clickable } = pair.value as Value;
        return (
          <Row
            key={key}
            weight={weight}
            height={height && height < rowHeight ? height : rowHeight}
            color={color}
            bgColor={bgColor}
            clickable={clickable}
            onClick={onClick}
          >
            <div>{pair.label}</div>
            {content && <div>{content}</div>}
            {/*clickable && (
              <RightArrow>
                <FontAwesomeIcon icon={faLongArrowAltRight} color={theme.colors.darkGrey} />
              </RightArrow>
            )*/}
          </Row>
        );
      })}
    </>
  );
};

export default RowRenderer;
