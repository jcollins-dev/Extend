import React from 'react';
import { BarBlockProps, DowntimeData } from './Chart.types';
import { categoryMapping } from '../../../../../../../../helpers/colorMapping';
import { uniqueId } from 'lodash';
import { styledTheme } from 'common/theme';
import { BarBlockContainer, DD, DL } from './Bars.elements';

const BarBlock = ({ category, count, duration, status }: BarBlockProps): JSX.Element => {
  const categoryObj = (categoryMapping[category]
    ? categoryMapping[category]
    : categoryMapping['Undefined']) as unknown as { icon: Element; color: string };

  return (
    <BarBlockContainer className="bar-indicator-container">
      <div className="bar-indicator--icon">{categoryObj && categoryObj.icon}</div>
      <div className="bar-indicator--bars">
        <p className="bar-indicator--name">{status && status}</p>
        <DL color={categoryObj && categoryObj.color}>
          <DD className={`percentage percentage-${count}`}>
            <span className="text"> {count && count} </span>
          </DD>
          <DD className={`percentage percentage-${duration}`}>
            <span className="text"> {duration} min </span>
          </DD>
        </DL>
      </div>
    </BarBlockContainer>
  );
};

export const BarsList = (data: DowntimeData): JSX.Element => {
  const bars = data.data.map((el) => {
    const key = uniqueId();
    const { status, total_time_seconds, count, category, color } = el;

    const duration = total_time_seconds ? Number(total_time_seconds / 60).toFixed(0) : '--';
    const categoryString = category ? category : 'undefined';
    const colorString = color ? color : styledTheme.colors.grayMedium;
    const countNumber = count ? count : undefined;

    const element = {
      category: categoryString,
      color: colorString,
      count,
      countNumber,
      duration,
      status
    };

    return <BarBlock key={key} {...element} />;
  });

  return <div className="bars">{bars}</div>;
};
