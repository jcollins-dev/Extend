import React, { useState } from 'react';
import { CollapseContainer } from './IntensifiersStrokeCountsList.elements';
import { StyledUiContainerProps } from 'components';
import { IcoChevron } from 'icons/IcoChevron';
import { IcoTriangle } from 'icons/IcoTriangle';
import { IcoLineGragh } from 'icons/IcoLineGraph';

export interface CollapseContainerWrapperProps extends StyledUiContainerProps {
  title?: string;
  color?: string;
  count?: number;
  data?: Record<string, unknown>[];
}

export const CollapseContainerWrapper = ({
  title,
  color,
  className,
  data
}: CollapseContainerWrapperProps): JSX.Element => {
  const count = data?.length || 0;

  if (!title || !color) return <>Error: missing color or title</>;

  const [open, setOpen] = useState(false);

  className = className
    ? `${className} intensifiers-stroke-counts-list-item`
    : `intensifiers-stroke-counts-list-item`;

  if (open) className += ` is-open`;

  const handleClick = () => (count > 0 ? setOpen(!open) : undefined);

  return (
    <CollapseContainer {...{ className, color }}>
      <h3 onClick={() => handleClick()}>
        <IcoTriangle {...{ color }} />
        {title} ({count})
        {count > 0 && (
          <span className="icon-right">
            <IcoChevron />
          </span>
        )}
      </h3>
      <div className="collapse-area">
        {data?.map((item, i) => (
          <div className="intensifiers-stroke-counts-list-item__alert" key={i}>
            <div className="intensifiers-stroke-counts-list-item__date">
              <IcoLineGragh />
              {item.date}
            </div>
            <div className="intensifiers-stroke-counts-list-item__message">{item.alarm}</div>
          </div>
        ))}
      </div>
    </CollapseContainer>
  );
};
