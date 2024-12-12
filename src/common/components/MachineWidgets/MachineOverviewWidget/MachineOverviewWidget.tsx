import React, { ReactNode } from 'react';
import {
  MachineOverviewWidgetContainer,
  WidgetTilesContainer,
  WigetTileCellContainer
} from './MachineOverviewWidget.elements';
import { WidgetUiProps } from 'common/components/WidgetUi/WidgetUi.types';
import { WidgetUi } from 'common/components/WidgetUi/WidgetUi';

export interface MachineOverviewWidgetProps extends WidgetUiProps {
  machingeImage?: ReactNode;
  tiles?: Record<string, unknown>[];
  image?: string;
}

interface Props extends MachineOverviewWidgetProps {
  children?: ReactNode;
}

const WidgetTile = ({
  title,
  label,
  value,
  color,
  id,
  Icon,
  isHidden
}: {
  title?: string;
  label?: string;
  value?: ReactNode;
  color?: string;
  id?: string;
  Icon?: ({ color }: { color?: string }) => JSX.Element;
  isHidden?: boolean;
}): JSX.Element => {
  if (isHidden) return <></>;
  return (
    <>
      <WigetTileCellContainer
        className={`widget-tile--${id} widget-tile__cell widget-tile__cell--icon`}
        {...{ color }}
      >
        <span>{Icon}</span>
      </WigetTileCellContainer>
      <WigetTileCellContainer
        className={`widget-tile--${id} widget-tile__cell widget-tile__cell--title`}
      >
        {title}
      </WigetTileCellContainer>
      <WigetTileCellContainer
        className={`widget-tile--${id} widget-tile__cell widget-tile__cell--value`}
        {...{ color }}
      >
        {label && <div className="widget-tile__label">{label}</div>}
        <div className="widget-tile__value">{value}</div>
      </WigetTileCellContainer>
    </>
  );
};

const WidgetTiles = ({ tiles }: Props): JSX.Element => {
  if (!tiles) return <></>;
  return (
    <WidgetTilesContainer className="widget-tiles">
      {tiles.map((props: Record<string, unknown>) => {
        if (!props.id) return <>error: missing id</>;
        return <WidgetTile key={props?.id as string} id={props?.id as string} {...props} />;
      })}
    </WidgetTilesContainer>
  );
};

export const MachineOverviewWidget = ({
  className,
  title,
  children,
  tiles,
  image
}: Props): JSX.Element => {
  const widgetSettings = {
    title,
    className: className ? `machine-overview-widget ${className}` : `machine-overview-widget`,
    hasButtons: {
      headerRight: ['settings']
    }
  };

  return (
    <WidgetUi
      {...widgetSettings}
      Main={
        <MachineOverviewWidgetContainer className="widget-ui__main ">
          <div className="machine-overview-widget__image">
            <img src={image} alt="machine" />
          </div>
          <div className="machine-overview-widget__tiles">
            <WidgetTiles tiles={tiles} />
          </div>
          {children}
        </MachineOverviewWidgetContainer>
      }
    />
  );
};
