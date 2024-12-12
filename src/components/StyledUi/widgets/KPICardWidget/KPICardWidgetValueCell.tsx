import React from 'react';
import { KPICardWidgetValueProps } from './KPICardWidget.types';

interface Props extends KPICardWidgetValueProps {
  hasStatusColor?: boolean;
  fullCol?: boolean;
}
export const KPICardWidgetValueCell = ({
  units,
  value,
  label,
  duration,
  fullCol,
  title,
  hasStatusColor
}: Props): JSX.Element | null => {
  if (!value || Number(value) === 0) {
    return null;
  }

  /** checks if value is less than 4 digits and doesn't have a long unit (checking for percent, mm, in, -, fpm, etc... )  */
  let valueClass =
    `${value}`.length < 4 && units && `${units}`.length < 4 && !fullCol
      ? `kpi-cell__value kpi-cell__value--xl`
      : `kpi-cell__value`;

  // add status font for coloring
  valueClass = hasStatusColor ? `${valueClass}` : valueClass;

  // checks if this is a full col value
  if (fullCol) valueClass = `${valueClass} kpi-cell--full`;

  const ShowUnits =
    value !== '-' ? (
      units === `%` ? (
        `%`
      ) : (
        <span className="kpi-cell__units">{units === 'lb' ? 'lbs' : units}</span>
      )
    ) : undefined;

  return units || value || label ? (
    <>
      {title && <div className="kpi-cell__title">{title}</div>}
      <div className={valueClass}>
        {value}
        {ShowUnits}
      </div>
      <div className={`kpi-cell__label${fullCol ? ` kpi-cell--full` : ``}`}>
        {duration || label}
      </div>
    </>
  ) : (
    <></>
  );
};
