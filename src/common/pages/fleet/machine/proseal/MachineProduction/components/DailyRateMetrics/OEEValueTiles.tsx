import React, { ReactNode } from 'react';
import {
  OEEValueTilesContainer,
  OEEValueTileContainer,
  OEEValueTileContainerProps
} from './OEEValueTile.elements';
import { StyledUiContainerProps } from 'components';
import { StyledLoader } from 'components/StyledUi/elements/StyledLoader';

export interface OEEValueTilesPropsTile extends OEEValueTileContainerProps {
  // goes above the value
  title?: ReactNode;
  // goes below the value
  label?: ReactNode;
  value?: ReactNode;
  // the unique id of the tile,
  // this is also used to get color from the theme
  id?: string;
}

export interface OEEValueTilesProps extends StyledUiContainerProps {
  tiles?: OEEValueTilesPropsTile[];
  isLoading?: boolean;
  hasMessage?: string;
  hasError?: string;
}

export const OEEValueTiles = ({ tiles, isLoading, className }: OEEValueTilesProps): JSX.Element => {
  className = className ? `${className} oee-value-tiles` : `oee-value-tiles`;

  if (isLoading) {
    return (
      <div className={className}>
        <StyledLoader />
      </div>
    );
  }

  if (!tiles) return <></>;

  return (
    <OEEValueTilesContainer className={className}>
      {tiles.map(({ title, label, value, color, id }) => (
        <OEEValueTileContainer {...{ color }} key={id} className="oee-value-tiles__tile">
          {title && <div className="oee-value-tiles__title">{title}</div>}
          {value && <div className="oee-value-tiles__value">{value}</div>}
          {label && <div className="oee-value-tiles__label">{label}</div>}
        </OEEValueTileContainer>
      ))}
    </OEEValueTilesContainer>
  );
};
