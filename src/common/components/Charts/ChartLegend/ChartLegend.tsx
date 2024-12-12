import React from 'react';
import { ChartLegendContainer, ItemContainer } from './ChartLegend.elements';
import { StyledUiContainerProps } from 'components';

export interface ChartLegendProps extends StyledUiContainerProps {
  items: Record<string, unknown>[];
  handleClick?: (props: Record<string, unknown>) => void;
  checkIfSelected?: (props: Record<string, unknown>) => void;
  isVertical?: boolean;
}

export const ChartLegend = ({
  items,
  handleClick,
  checkIfSelected,
  className,
  isVertical
}: ChartLegendProps): JSX.Element => {
  // establesh base class name
  className = className ? `chart-legend ${className}` : `chart-legend`;
  // add class if vertical
  if (isVertical) className += ` is-vertical`;
  // the legend item component
  const Item = (props: Record<string, unknown>) => {
    // get label and color from props
    const label = props?.label as string;
    const color = props?.color as string;
    // return early if missing label
    if (!label) return <>error: missing label</>;
    // establesh base class name
    let itemClassName = `chart-legend__item`;
    // check if this is selected, only if we have a function to check
    if (checkIfSelected?.(props)) itemClassName += ` is-selected`;

    return (
      <ItemContainer {...{ color, className: itemClassName, onClick: () => handleClick?.(props) }}>
        <span>{label}</span>
      </ItemContainer>
    );
  };

  return (
    <ChartLegendContainer {...{ className }}>
      {items.map((item, i) => (
        <Item {...item} key={i} />
      ))}
    </ChartLegendContainer>
  );
};
