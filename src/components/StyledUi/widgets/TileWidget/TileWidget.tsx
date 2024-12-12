import React, { ReactNode } from 'react';
import { TileWidgetContainer } from '../../WidgetUi/WidgetUi.elements';
import { TileWidgetProps, TileWidgetCellValueProps } from './TileWidget.types';

import { default as LoaderBase } from 'react-loader-spinner';

interface LoaderProps extends TileWidgetProps {
  children?: ReactNode;
}

const Loader = ({ isLoading, hasError, hasMessage, children }: LoaderProps): JSX.Element => {
  if (hasError)
    return (
      <div className="tile-widget-main tile-widget-main--full tile-widget--center status--error">
        {hasError}
      </div>
    );
  if (hasMessage)
    return (
      <div className="tile-widget-main tile-widget-main--full tile-widget--center">
        {hasMessage}
      </div>
    );
  if (isLoading)
    return (
      <div className="tile-widget-main tile-widget-main--full tile-widget--center">
        <LoaderBase type="TailSpin" color="#d0d0d0" height={40} width={40} />
      </div>
    );
  return <>{children}</>;
};

// TODO: Setup progress bar
export const TileWidget = ({
  isLoading,
  hasError,
  hasMessage,
  title,
  subTitle,
  cellValues,
  Main,
  className,
  hasStatus,
  ga
}: TileWidgetProps): JSX.Element => {
  const Cells = cellValues ? useCellValues(cellValues) : Main;

  className = `tile-widget res-font-md ${className ? className : ``}${
    hasStatus ? `status--${hasStatus}` : ``
  }`;

  return (
    <TileWidgetContainer {...{ className, ga }}>
      <Loader {...{ isLoading, hasError, hasMessage }}>
        <header className="tile-widget-header">
          {title && <div className="tile-widget-header__title">{title}</div>}
          {subTitle && <div className="tile-widget-header__sub-title">{subTitle}</div>}
        </header>
        <div className="tile-widget-main">{Cells}</div>
      </Loader>
    </TileWidgetContainer>
  );
};

const useCellValues = (cellValues: TileWidgetCellValueProps[]) =>
  cellValues
    .map(({ value, title, label }, i) =>
      value || title || label ? (
        <div key={`${value}${i}`} className="tile-widget-cell">
          {value && <div className="tile-widget-cell__value">{value}</div>}
          {label && <div className="tile-widget-cell__label">{label}</div>}
          {title && <div className="tile-widget-cell__title">{title}</div>}
        </div>
      ) : (
        false
      )
    )
    .filter((x) => x);
